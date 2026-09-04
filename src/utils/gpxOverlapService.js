import * as turf from '@turf/turf'

/**
 * Helper to escape CSV cell values
 */
export function escapeCsvCell(val) {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

/**
 * Converts a list of [lat, lng] points to a Turf Polygon Feature.
 * Note: Converts source [lat, lng] to GeoJSON standard [lng, lat].
 * Unkinking is done lazily only when needed for intersection calculation.
 *
 * @param {Array<[number, number]>} points - Array of [lat, lng] coordinates
 * @param {string} recordName - Identifier for logging
 * @returns {{ polygon: Feature<Polygon>|null, error?: string }}
 */
export function buildTurfPolygonFromPoints(points, recordName = 'unknown') {
  if (!Array.isArray(points) || points.length < 3) {
    return { polygon: null, error: 'Fewer than 3 points' }
  }

  try {
    const coords = points.map(p => {
      if (Array.isArray(p)) {
        return [Number(p[1]), Number(p[0])] // [lng, lat]
      }
      if (p && typeof p === 'object') {
        return [Number(p.lng ?? p.lon), Number(p.lat)]
      }
      return [0, 0]
    })

    // Ensure linear ring is closed
    const first = coords[0]
    const last = coords[coords.length - 1]
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coords.push([first[0], first[1]])
    }

    if (coords.length < 4) {
      return { polygon: null, error: 'Linear ring has fewer than 4 coordinates after closing' }
    }

    const poly = turf.polygon([coords])
    return { polygon: poly }
  } catch (err) {
    return { polygon: null, error: err.message }
  }
}

/**
 * Lazily repairs self-intersecting polygon geometries using unkinkPolygon.
 */
export function repairPolygonIfNeeded(poly, recordName = 'unknown') {
  try {
    const kinks = turf.kinks(poly)
    if (kinks && kinks.features && kinks.features.length > 0) {
      const unkinked = turf.unkinkPolygon(poly)
      if (unkinked && unkinked.features && unkinked.features.length > 0) {
        const sorted = [...unkinked.features].sort((a, b) => turf.area(b) - turf.area(a))
        return { polygon: sorted[0], repaired: true }
      }
    }
  } catch (err) {
    console.warn(`[GPX Overlap] Lazy repair failed for "${recordName}":`, err.message)
  }
  return { polygon: poly, repaired: false }
}

/**
 * Check if two bounding boxes [minX, minY, maxX, maxY] intersect.
 */
export function doBboxesOverlap(b1, b2) {
  return !(b1[2] < b2[0] || b1[0] > b2[2] || b1[3] < b2[1] || b1[1] > b2[3])
}

/**
 * Computes overlap statistics and generates a CSV report between a set of GPX records.
 * Optimized for datasets up to 10,000+ polygons using:
 * 1. Spatial Grid Partitioning (O(N) vs O(N^2))
 * 2. Bounding Box 2D Intersection Area Upper-Bound Pruning (O(1))
 * 3. Lazy Polygon Geometry Repair
 * 4. Non-blocking async event loop yielding with live progress callbacks
 *
 * @param {Array<Object>} records - GPX track records
 * @param {Object} options
 * @param {number} options.minOverlapPct - Minimum overlap % (default: 30% to capture duplicates & major overlaps, skipping minor touching edges)
 * @param {Function} options.onProgress - Callback with stage & progress metrics
 * @param {number} options.yieldIntervalMs - Yield to browser event loop every X ms (default: 12ms)
 * @param {AbortSignal} options.signal - Optional AbortSignal to cancel execution
 * @returns {Promise<{ csv: string, summary: Object, rows: Array<Object> }>}
 */
export async function generateGpxOverlapReport(records, options = {}) {
  const {
    minOverlapPct = 30, // Default 30%: focus on Duplicates (>90%) and Major Overlaps (>30%)
    onProgress = null,
    yieldIntervalMs = 12,
    signal = null
  } = options

  const checkCancelled = () => {
    if (signal && signal.aborted) {
      throw new Error('Overlap report generation was cancelled by the user.')
    }
  }

  const totalPolygonsChecked = records.length
  const preparedItems = []

  let lastYieldTime = typeof performance !== 'undefined' ? performance.now() : Date.now()

  // STAGE 1: Fast Build & Attribute Preparation (0% -> 40%)
  for (let idx = 0; idx < records.length; idx++) {
    checkCancelled()
    const record = records[idx]
    const name = record.name || `Track_${idx + 1}`
    const isEnclosed = record.isEnclosed !== false
    const points = record.points || []

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
    if (now - lastYieldTime > yieldIntervalMs) {
      if (onProgress) {
        const prepPct = Math.round((idx / records.length) * 40)
        onProgress({
          stage: 'preparing',
          stageMessage: `Validating polygons: ${idx + 1} / ${records.length}`,
          percent: prepPct,
          current: idx + 1,
          total: records.length,
          polygonsCount: preparedItems.length,
          candidatePairsCount: 0,
          matchesCount: 0
        })
      }
      await new Promise(resolve => setTimeout(resolve, 0))
      lastYieldTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
    }

    if (!isEnclosed || points.length < 3) {
      continue
    }

    const { polygon, error } = buildTurfPolygonFromPoints(points, name)
    if (!polygon) {
      console.warn(`[GPX Overlap] Skipped "${name}": ${error || 'Invalid geometry'}`)
      continue
    }

    let areaSqM = 0
    try {
      areaSqM = turf.area(polygon)
    } catch (e) {
      continue
    }

    if (!areaSqM || areaSqM <= 0) continue

    const bbox = turf.bbox(polygon)
    const bboxW = bbox[2] - bbox[0]
    const bboxH = bbox[3] - bbox[1]
    const bboxArea = Math.max(1e-10, bboxW * bboxH)
    const areaHa = areaSqM / 10000

    let center = record.center
    if (!center || isNaN(center.lat) || isNaN(center.lng)) {
      if (points.length > 0) {
        center = {
          lat: points.reduce((s, p) => s + (Array.isArray(p) ? p[0] : p.lat || 0), 0) / points.length,
          lng: points.reduce((s, p) => s + (Array.isArray(p) ? p[1] : p.lng || 0), 0) / points.length
        }
      }
    }

    preparedItems.push({
      original: record,
      name,
      location: record.location || '',
      commodity: record.commodity || '',
      farmerName: record.farmerName || '',
      polygon,
      bbox,
      bboxW,
      bboxH,
      bboxArea,
      areaSqM,
      areaHa,
      center,
      geometryRepaired: false,
      isRepairedChecked: false
    })
  }

  checkCancelled()

  const n = preparedItems.length
  if (n < 2) {
    return {
      csv: '',
      summary: {
        totalPolygonsChecked,
        validPolygonsCompared: n,
        candidatePairsChecked: 0,
        totalOverlappingPairs: 0,
        duplicateCount: 0,
        majorOverlapCount: 0,
        minorOverlapCount: 0
      },
      rows: []
    }
  }

  // STAGE 2: Spatial Grid Indexing (40% -> 50%)
  if (onProgress) {
    onProgress({
      stage: 'indexing',
      stageMessage: `Spatial indexing ${n} polygons into grid...`,
      percent: 45,
      current: n,
      total: n,
      polygonsCount: n,
      candidatePairsCount: 0,
      matchesCount: 0
    })
  }
  await new Promise(resolve => setTimeout(resolve, 0))
  lastYieldTime = typeof performance !== 'undefined' ? performance.now() : Date.now()

  let sumW = 0
  let sumH = 0
  for (let i = 0; i < n; i++) {
    sumW += preparedItems[i].bboxW
    sumH += preparedItems[i].bboxH
  }
  const cellW = Math.max(0.0005, (sumW / n) * 2.5)
  const cellH = Math.max(0.0005, (sumH / n) * 2.5)

  const grid = new Map()
  for (let i = 0; i < n; i++) {
    const b = preparedItems[i].bbox
    const minX = Math.floor(b[0] / cellW)
    const maxX = Math.floor(b[2] / cellW)
    const minY = Math.floor(b[1] / cellH)
    const maxY = Math.floor(b[3] / cellH)

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const cellKey = `${x},${y}`
        let list = grid.get(cellKey)
        if (!list) {
          list = []
          grid.set(cellKey, list)
        }
        list.push(i)
      }
    }
  }

  // Deduplicate and filter candidates with BBox Intersection Area Upper Bound
  const seenPairs = new Set()
  const candidatePairs = []

  for (const list of grid.values()) {
    if (list.length < 2) continue
    const len = list.length
    for (let p1 = 0; p1 < len; p1++) {
      const idxA = list[p1]
      for (let p2 = p1 + 1; p2 < len; p2++) {
        const idxB = list[p2]
        const a = idxA < idxB ? idxA : idxB
        const b = idxA < idxB ? idxB : idxA
        const pairKey = `${a},${b}`

        if (seenPairs.has(pairKey)) continue
        seenPairs.add(pairKey)

        const itemA = preparedItems[a]
        const itemB = preparedItems[b]

        // 2D Bounding Box Intersection
        const intMinX = Math.max(itemA.bbox[0], itemB.bbox[0])
        const intMaxX = Math.min(itemA.bbox[2], itemB.bbox[2])
        const intMinY = Math.max(itemA.bbox[1], itemB.bbox[1])
        const intMaxY = Math.min(itemA.bbox[3], itemB.bbox[3])

        if (intMaxX <= intMinX || intMaxY <= intMinY) continue

        // BBox Intersection Area Upper Bound Filter (O(1))
        const bboxIntArea = (intMaxX - intMinX) * (intMaxY - intMinY)
        const maxPossibleOverlapA = (bboxIntArea / itemA.bboxArea) * 100
        const maxPossibleOverlapB = (bboxIntArea / itemB.bboxArea) * 100

        // If even the maximum possible rectangular overlap is less than the threshold, skip immediately!
        if (Math.max(maxPossibleOverlapA, maxPossibleOverlapB) < minOverlapPct) {
          continue
        }

        candidatePairs.push([a, b])
      }
    }
  }

  const totalCandidates = candidatePairs.length
  const overlappingRows = []

  // STAGE 3: Fast Geometric Intersection Evaluation (50% -> 95%)
  for (let cIdx = 0; cIdx < totalCandidates; cIdx++) {
    checkCancelled()
    const [i, j] = candidatePairs[cIdx]
    const itemA = preparedItems[i]
    const itemB = preparedItems[j]

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
    if (now - lastYieldTime > yieldIntervalMs) {
      if (onProgress) {
        const evalPct = totalCandidates > 0 ? 50 + Math.round((cIdx / totalCandidates) * 45) : 95
        onProgress({
          stage: 'comparing',
          stageMessage: `Evaluating candidate pairs: ${cIdx + 1} / ${totalCandidates}`,
          percent: evalPct,
          current: cIdx + 1,
          total: totalCandidates,
          polygonsCount: n,
          candidatePairsCount: totalCandidates,
          matchesCount: overlappingRows.length
        })
      }
      await new Promise(resolve => setTimeout(resolve, 0))
      lastYieldTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
    }

    // Lazy repair if not yet checked
    if (!itemA.isRepairedChecked) {
      const rep = repairPolygonIfNeeded(itemA.polygon, itemA.name)
      itemA.polygon = rep.polygon
      itemA.geometryRepaired = rep.repaired
      itemA.isRepairedChecked = true
    }
    if (!itemB.isRepairedChecked) {
      const rep = repairPolygonIfNeeded(itemB.polygon, itemB.name)
      itemB.polygon = rep.polygon
      itemB.geometryRepaired = rep.repaired
      itemB.isRepairedChecked = true
    }

    // Boolean intersection check
    let intersects = false
    try {
      intersects = turf.booleanIntersects(itemA.polygon, itemB.polygon)
    } catch (err) {
      continue
    }

    if (!intersects) continue

    // Compute intersection geometry
    let intersectionGeom = null
    try {
      intersectionGeom = turf.intersect(turf.featureCollection([itemA.polygon, itemB.polygon]))
    } catch (err) {
      continue
    }

    if (!intersectionGeom) continue

    const intersectionAreaSqM = turf.area(intersectionGeom)
    const intersectionAreaHa = intersectionAreaSqM / 10000

    if (intersectionAreaHa <= 0.000001) continue

    const overlapPctA = itemA.areaSqM > 0 ? Math.min(100, (intersectionAreaSqM / itemA.areaSqM) * 100) : 0
    const overlapPctB = itemB.areaSqM > 0 ? Math.min(100, (intersectionAreaSqM / itemB.areaSqM) * 100) : 0
    const maxOverlap = Math.max(overlapPctA, overlapPctB)

    // Filter by threshold (e.g. >=30% for duplicates & major overlaps)
    if (minOverlapPct > 0 && maxOverlap < minOverlapPct) {
      continue
    }

    let category = 'minor_overlap'
    if (overlapPctA > 90 && overlapPctB > 90) {
      category = 'duplicate'
    } else if (overlapPctA > 30 || overlapPctB > 30) {
      category = 'major_overlap'
    }

    let centerDistanceM = ''
    if (itemA.center && itemB.center && !isNaN(itemA.center.lat) && !isNaN(itemB.center.lat)) {
      try {
        const ptA = turf.point([Number(itemA.center.lng), Number(itemA.center.lat)])
        const ptB = turf.point([Number(itemB.center.lng), Number(itemB.center.lat)])
        centerDistanceM = Number(turf.distance(ptA, ptB, { units: 'meters' })).toFixed(2)
      } catch (e) {
        centerDistanceM = ''
      }
    }

    overlappingRows.push({
      name_a: itemA.name,
      name_b: itemB.name,
      location_a: itemA.location,
      location_b: itemB.location,
      commodity_a: itemA.commodity,
      commodity_b: itemB.commodity,
      farmer_a: itemA.farmerName || '',
      farmer_b: itemB.farmerName || '',
      area_ha_a: Number(itemA.areaHa.toFixed(4)),
      area_ha_b: Number(itemB.areaHa.toFixed(4)),
      intersection_area_ha: Number(intersectionAreaHa.toFixed(4)),
      overlap_pct_of_a: Number(overlapPctA.toFixed(2)),
      overlap_pct_of_b: Number(overlapPctB.toFixed(2)),
      overlap_category: category,
      center_distance_m: centerDistanceM !== '' ? Number(centerDistanceM) : '',
      geometry_repaired_a: itemA.geometryRepaired,
      geometry_repaired_b: itemB.geometryRepaired
    })
  }

  // Sort rows by overlap_pct_of_a descending
  overlappingRows.sort((a, b) => b.overlap_pct_of_a - a.overlap_pct_of_a)

  const summary = {
    totalPolygonsChecked,
    validPolygonsCompared: n,
    candidatePairsChecked: totalCandidates,
    totalOverlappingPairs: overlappingRows.length,
    duplicateCount: overlappingRows.filter(r => r.overlap_category === 'duplicate').length,
    majorOverlapCount: overlappingRows.filter(r => r.overlap_category === 'major_overlap').length,
    minorOverlapCount: overlappingRows.filter(r => r.overlap_category === 'minor_overlap').length
  }

  // STAGE 4: Build CSV string
  if (onProgress) {
    onProgress({
      stage: 'compiling',
      stageMessage: 'Compiling CSV export file...',
      percent: 100,
      current: totalCandidates,
      total: totalCandidates,
      polygonsCount: n,
      candidatePairsCount: totalCandidates,
      matchesCount: overlappingRows.length
    })
  }

  const headers = [
    'name_a',
    'name_b',
    'location_a',
    'location_b',
    'commodity_a',
    'commodity_b',
    'farmer_a',
    'farmer_b',
    'area_ha_a',
    'area_ha_b',
    'intersection_area_ha',
    'overlap_pct_of_a',
    'overlap_pct_of_b',
    'overlap_category',
    'center_distance_m',
    'geometry_repaired_a',
    'geometry_repaired_b'
  ]

  const csvLines = [headers.map(escapeCsvCell).join(',')]
  for (const row of overlappingRows) {
    const line = headers.map(h => escapeCsvCell(row[h])).join(',')
    csvLines.push(line)
  }

  const csv = csvLines.join('\r\n')

  return {
    csv,
    summary,
    rows: overlappingRows
  }
}
