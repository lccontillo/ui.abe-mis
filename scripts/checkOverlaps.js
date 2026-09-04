#!/usr/bin/env node

/**
 * CLI Script: Generate a CSV Report of Overlapping GPX Field Polygons
 *
 * Usage:
 *   node scripts/checkOverlaps.js [input_json_file] [output_csv_file] [--min-overlap-pct=0]
 *
 * Defaults:
 *   input_json_file: fields.json
 *   output_csv_file: overlap_report.csv
 */

import fs from 'fs'
import path from 'path'
import { generateGpxOverlapReport } from '../src/utils/gpxOverlapService.js'

async function main() {
  const args = process.argv.slice(2)
  let inputFile = 'fields.json'
  let outputFile = 'overlap_report.csv'
  let minOverlapPct = 0

  for (const arg of args) {
    if (arg.startsWith('--min-overlap-pct=')) {
      minOverlapPct = parseFloat(arg.split('=')[1]) || 0
    } else if (!arg.startsWith('--')) {
      if (inputFile === 'fields.json' && !args.includes(inputFile)) {
        inputFile = arg
      } else {
        outputFile = arg
      }
    }
  }

  // Check input file
  const inputResolved = path.resolve(process.cwd(), inputFile)
  if (!fs.existsSync(inputResolved)) {
    console.error(`Error: Input file "${inputResolved}" not found.`)
    process.exit(1)
  }

  console.log(`Loading records from ${inputResolved}...`)
  let rawData
  try {
    rawData = fs.readFileSync(inputResolved, 'utf-8')
  } catch (err) {
    console.error(`Error reading "${inputResolved}":`, err.message)
    process.exit(1)
  }

  let records
  try {
    records = JSON.parse(rawData)
    if (!Array.isArray(records)) {
      if (records && Array.isArray(records.features)) {
        // Handle GeoJSON feature collection
        records = records.features.map(f => ({
          name: f.properties?.name || 'Feature',
          points: f.geometry?.coordinates?.[0]?.map(c => [c[1], c[0]]) || [],
          location: f.properties?.location || '',
          commodity: f.properties?.commodity || '',
          farmerName: f.properties?.farmerName || '',
          isEnclosed: true
        }))
      } else {
        console.error('Error: JSON file must contain an array of records.')
        process.exit(1)
      }
    }
  } catch (err) {
    console.error('Error parsing JSON:', err.message)
    process.exit(1)
  }

  console.log(`Analyzing ${records.length} records for geometric overlaps...`)

  const { csv, summary } = await generateGpxOverlapReport(records, {
    minOverlapPct,
    onProgress: ({ stageMessage, percent, matchesCount }) => {
      process.stdout.write(`\rProgress: ${percent}% | ${stageMessage} | Overlaps: ${matchesCount}`)
    }
  })

  console.log('\n')

  const outputResolved = path.resolve(process.cwd(), outputFile)
  try {
    fs.writeFileSync(outputResolved, '\uFEFF' + csv, 'utf-8')
    console.log(`Report successfully written to: ${outputResolved}`)
  } catch (err) {
    console.error(`Error writing CSV to "${outputResolved}":`, err.message)
    process.exit(1)
  }

  // Summary output
  console.log('\n================ OVERLAP REPORT SUMMARY ================')
  console.log(`Total Polygons Checked:     ${summary.totalPolygonsChecked}`)
  console.log(`Valid Polygons Compared:    ${summary.validPolygonsCompared}`)
  console.log(`Total Overlapping Pairs:    ${summary.totalOverlappingPairs}`)
  console.log(`  - Duplicate (>90% both):   ${summary.duplicateCount}`)
  console.log(`  - Major Overlap (>30%):    ${summary.majorOverlapCount}`)
  console.log(`  - Minor Overlap (<=30%):   ${summary.minorOverlapCount}`)
  console.log('========================================================\n')
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
