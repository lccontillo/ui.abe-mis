<template>
  <div class="network-plan-page">
    <!-- Top Bar -->
    <header class="plan-header">
      <div class="header-left">
        <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'FMR Network Plan' }]" />
      </div>

      <div class="header-actions">
        <div class="coord-pill" :title="'Map coordinate cursor'">
          <Location20 class="coord-icon" />
          <span>{{ currentCoordinates }}</span>
        </div>
        <button 
          v-if="analysisResult" 
          type="button" 
          class="btn btn-secondary btn-sm"
          @click="toggleResultsPanel"
        >
          <ChartCombo20 class="btn-icon" />
          <span>{{ isResultsOpen ? 'Hide Results' : 'View Results' }}</span>
        </button>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="plan-workspace">
      <!-- Left Sidebar Panel -->
      <aside class="plan-sidebar" :class="{ collapsed: isSidebarCollapsed }">
        <div class="sidebar-scroll">
          <!-- Road Network Upload Section -->
          <section class="config-section">
            <div class="section-head">
              <div class="section-title">
                <span class="icon-label"><Road20 class="section-icon" /> Road Network</span>
              </div>
              <span class="badge badge-neutral" id="statRoadFeatures">
                {{ roadFeaturesCount > 0 ? `${roadFeaturesCount} feat.` : '—' }}
              </span>
            </div>

            <div 
              class="dropzone"
              :class="{ 'has-file': roadData, 'drag-over': isDraggingRoad }"
              @dragover.prevent="isDraggingRoad = true"
              @dragleave="isDraggingRoad = false"
              @drop.prevent="handleRoadDrop"
              @click="triggerRoadFileInput"
            >
              <input 
                type="file" 
                ref="roadFileInput" 
                class="hidden-file-input" 
                accept=".kml,.kmz,.geojson,.json"
                @change="handleRoadFileSelect" 
              />
              <div v-if="!roadData" class="dropzone-empty">
                <Upload20 class="upload-icon" />
                <div class="upload-title">Upload KML / GeoJSON</div>
                <div class="upload-subtitle">Road line(s) · Drag & drop or click</div>
              </div>
              <div v-else class="dropzone-filled" @click.stop>
                <div class="file-info-row">
                  <span class="file-name truncate">{{ roadFileName }}</span>
                  <span class="badge badge-success">{{ roadLineCount }} road(s)</span>
                </div>
                <div class="file-meta">{{ roadFeaturesCount }} total features</div>
                <button type="button" class="btn-remove" @click.stop="clearRoad">
                  <TrashCan16 /> Remove
                </button>
              </div>
            </div>
          </section>

          <!-- Land Use Map Upload Section -->
          <section class="config-section">
            <div class="section-head">
              <div class="section-title">
                <span class="icon-label"><Map20 class="section-icon" /> Land Use Map</span>
              </div>
              <div class="section-badges">
                <span class="badge badge-neutral">
                  {{ landUsePolyCount > 0 ? `${landUsePolyCount} poly.` : '—' }}
                </span>
                <span v-if="isLandUsePersisted" class="badge badge-info" title="Persisted in browser storage">
                  Saved
                </span>
              </div>
            </div>

            <div 
              class="dropzone"
              :class="{ 'has-file': landUseData, 'drag-over': isDraggingLandUse }"
              @dragover.prevent="isDraggingLandUse = true"
              @dragleave="isDraggingLandUse = false"
              @drop.prevent="handleLandUseDrop"
              @click="triggerLandUseFileInput"
            >
              <input 
                type="file" 
                ref="landUseFileInput" 
                class="hidden-file-input" 
                accept=".kml,.kmz,.geojson,.json"
                @change="handleLandUseFileSelect" 
              />
              <div v-if="!landUseData" class="dropzone-empty">
                <Upload20 class="upload-icon" />
                <div class="upload-title">Upload KML / GeoJSON</div>
                <div class="upload-subtitle">Land use polygons · Drag & drop or click</div>
              </div>
              <div v-else class="dropzone-filled" @click.stop>
                <div class="file-info-row">
                  <span class="file-name truncate">{{ landUseFileName }}</span>
                  <span class="badge badge-success">{{ landUsePolyCount }} polygon(s)</span>
                </div>
                <div class="file-meta">{{ landUseFeaturesCount }} total features</div>
                <button type="button" class="btn-remove" @click.stop="clearLandUse">
                  <TrashCan16 /> Remove
                </button>
              </div>
            </div>
            <p class="section-hint">
              Upload once — safely saved across analyses until removed.
            </p>

            <!-- Land Use Field Selector -->
            <div v-if="landUseFields.length > 0" class="field-select-group">
              <label for="lu-field-select" class="field-label-sm">Land Use Category Field</label>
              <select 
                id="lu-field-select" 
                v-model="selectedLandUseField" 
                class="field-control-sm"
                @change="onLandUseFieldChange"
              >
                <option v-for="field in landUseFields" :key="field" :value="field">
                  {{ field }}
                </option>
              </select>
            </div>
          </section>

          <!-- Quick Stats Section -->
          <section class="config-section">
            <div class="section-title"><ChartCombo20 class="section-icon" /> Quick Metrics</div>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-card-label">Road Length</span>
                <span class="stat-card-value">{{ roadLengthFormatted }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-label">Buffer Area</span>
                <span class="stat-card-value">{{ bufferAreaFormatted }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-label">Buffer Distance</span>
                <span class="stat-card-value">{{ bufferDistance }} m</span>
              </div>
            </div>
          </section>

          <!-- Parameters & Actions -->
          <section class="config-section">
            <div class="section-title"><Settings20 class="section-icon" /> Analysis Parameters</div>
            
            <div class="param-row">
              <label class="param-label" for="buffer-input">Buffer Distance (per side)</label>
              <div class="input-with-unit">
                <input 
                  id="buffer-input" 
                  v-model.number="bufferDistance" 
                  type="number" 
                  min="50" 
                  max="5000" 
                  step="50" 
                  class="field-control-sm" 
                />
                <span class="unit-text">meters</span>
              </div>
            </div>

            <div class="param-row">
              <label class="param-label" for="road-type-select">Road Type & Standard Cost</label>
              <select id="road-type-select" v-model="selectedRoadType" class="field-control-sm">
                <option value="concrete">Concrete Road — ₱12M / km</option>
                <option value="asphalt">Asphalt Road — ₱9M / km</option>
                <option value="gravel">Gravel Road — ₱4M / km</option>
              </select>
            </div>

            <div class="param-row">
              <label class="param-label" for="farm-size-input">Avg. Farm Size per Farmer</label>
              <div class="input-with-unit">
                <input 
                  id="farm-size-input" 
                  v-model.number="avgFarmSize" 
                  type="number" 
                  min="0.05" 
                  max="10" 
                  step="0.05" 
                  class="field-control-sm" 
                />
                <span class="unit-text">ha</span>
              </div>
            </div>

            <div class="action-buttons-group">
              <button 
                type="button" 
                class="btn btn-primary btn-block" 
                :disabled="!roadData || isProcessing"
                @click="generateBuffer"
              >
                <Renew20 class="btn-icon" />
                <span>{{ isBuffering ? 'Generating Buffer...' : 'Generate Buffer' }}</span>
              </button>

              <button 
                type="button" 
                class="btn btn-accent btn-block" 
                :disabled="!roadData || !landUseData || !bufferData || isProcessing"
                @click="runAnalysis"
              >
                <Analytics20 class="btn-icon" />
                <span>{{ isAnalyzing ? 'Running Analysis...' : 'Run Spatial Analysis' }}</span>
              </button>

              <button 
                type="button" 
                class="btn btn-secondary btn-block" 
                :disabled="isProcessing"
                @click="clearAll"
              >
                <Reset20 class="btn-icon" />
                <span>Clear Workspace</span>
              </button>
            </div>
          </section>

          <!-- Proposal Save Section -->
          <section class="config-section">
            <div class="section-title"><Save20 class="section-icon" /> Save Proposal</div>
            <div class="proposal-inputs">
              <input 
                v-model.trim="proposalName" 
                type="text" 
                placeholder="Proposal name (e.g. Brgy. Centro FMR) *" 
                class="field-control-sm" 
              />
              <input 
                v-model.trim="proposalDesc" 
                type="text" 
                placeholder="Description / Remarks (optional)" 
                class="field-control-sm" 
              />
              <select v-model="proposalStatus" class="field-control-sm">
                <option value="Draft">Draft</option>
                <option value="For Review">For Review</option>
                <option value="Approved">Approved</option>
                <option value="Funded">Funded</option>
                <option value="Completed">Completed</option>
              </select>
              <button 
                type="button" 
                class="btn btn-primary btn-block btn-sm" 
                :disabled="!proposalName || !analysisResult"
                @click="saveProposal"
              >
                <Save20 class="btn-icon" />
                <span>Save to Repository</span>
              </button>
            </div>
          </section>

          <!-- Export Section -->
          <section class="config-section">
            <div class="section-title"><DocumentExport20 class="section-icon" /> Export Data</div>
            <div class="export-buttons">
              <button 
                type="button" 
                class="btn btn-secondary btn-sm btn-block" 
                :disabled="!analysisResult"
                @click="exportCSV"
              >
                <DocumentExport20 class="btn-icon" />
                <span>Export CSV Report</span>
              </button>
              <button 
                type="button" 
                class="btn btn-secondary btn-sm btn-block" 
                :disabled="!roadData && !bufferData && !intersectionData"
                @click="exportGeoJSON"
              >
                <Earth20 class="btn-icon" />
                <span>Export GeoJSON Layers</span>
              </button>
            </div>
          </section>

          <!-- Saved Proposals Quick Dropdown -->
          <section class="config-section">
            <div class="section-title"><Document20 class="section-icon" /> Saved Proposals ({{ proposals.length }})</div>
            <select 
              v-model="selectedProposalId" 
              class="field-control-sm"
              @change="onSelectProposal"
            >
              <option value="">— Load a saved proposal —</option>
              <option v-for="prop in proposals" :key="prop.id" :value="prop.id">
                {{ prop.name }} ({{ formatDate(prop.createdAt) }})
              </option>
            </select>
          </section>

          <!-- <footer class="sidebar-footer">
            <span>FMR Network Plan v1.0 · ABE Alcala MIS</span>
          </footer> -->
        </div>
      </aside>

      <!-- Map Container -->
      <main class="map-view-area">
        <div ref="mapContainer" class="map-canvas"></div>

        <!-- Empty State Overlay -->
        <div v-if="!roadData && !landUseData" class="map-empty-overlay">
          <div class="empty-card">
            <Map20 class="empty-icon" />
            <h3 class="empty-title">Ready for Spatial Analysis</h3>
            <p class="empty-desc">
              Upload a <strong>Road Network</strong> and <strong>Land Use Map</strong> from the sidebar to generate buffer influence zones and calculate agricultural benefits.
            </p>
          </div>
        </div>

        <!-- Diagnostic Alert (when buffer and land use do not overlap) -->
        <div v-if="diagnosticInfo" class="diagnostic-banner">
          <div class="diagnostic-content">
            <WarningAlt20 class="diag-icon" />
            <div>
              <strong>No Spatial Overlap Detected:</strong> 
              The {{ diagnosticInfo.bufferHa.toFixed(1) }} ha road buffer does not intersect with the uploaded land use polygons.
              <span v-if="diagnosticInfo.gapKm"> Estimated distance between centers: ~{{ diagnosticInfo.gapKm.toFixed(1) }} km.</span>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-secondary" @click="diagnosticInfo = null">Dismiss</button>
        </div>

        <!-- Processing Loader Overlay -->
        <div v-if="isProcessing" class="map-loader-overlay">
          <div class="loader-content">
            <div class="loader-spinner"></div>
            <span>{{ loadingMessage }}</span>
          </div>
        </div>

        <!-- Map Watermark -->
        <div class="map-watermark-pill">
          Farm-to-Market Road Network Plan · Alcala, Cagayan
        </div>
      </main>

      <!-- Results Drawer / Slide-up Panel -->
      <div class="results-drawer" :class="{ open: isResultsOpen }">
        <div class="drawer-header" @click="toggleResultsPanel">
          <div class="dh-title-group">
            <ChartCombo20 class="dh-icon" />
            <span class="dh-title">Analysis & Evaluation Results</span>
            <span v-if="analysisResult" class="badge badge-success">
              {{ (analysisResult.totalAreaSqm / 10000).toFixed(2) }} ha influenced
            </span>
          </div>
          <div class="dh-toggle-action">
            <span class="dh-hint">{{ isResultsOpen ? 'Collapse' : 'Expand Results' }}</span>
            <ChevronUp20 class="dh-arrow" :class="{ rotated: isResultsOpen }" />
          </div>
        </div>

        <div v-if="isResultsOpen" class="drawer-body">
          <nav class="drawer-tabs" aria-label="Results navigation">
            <button 
              type="button" 
              class="tab-btn" 
              :class="{ active: activeTab === 'summary' }"
              @click="activeTab = 'summary'"
            >
              Executive Summary
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              :class="{ active: activeTab === 'table' }"
              @click="activeTab = 'table'"
            >
              Land Use Breakdown
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              :class="{ active: activeTab === 'charts' }"
              @click="activeTab = 'charts'"
            >
              Visual Charts
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              :class="{ active: activeTab === 'report' }"
              @click="activeTab = 'report'"
            >
              Project Assessment
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              :class="{ active: activeTab === 'repository' }"
              @click="activeTab = 'repository'"
            >
              Proposals ({{ proposals.length }})
            </button>
          </nav>

          <div class="drawer-content-pane">
            <!-- Summary Tab -->
            <div v-if="activeTab === 'summary'" class="tab-pane">
              <div v-if="!analysisResult" class="no-result-text">
                Run a spatial analysis to view influence metrics and summary calculations.
              </div>
              <div v-else class="summary-grid">
                <div class="kpi-card">
                  <span class="kpi-label">Total Influence Area</span>
                  <span class="kpi-value">{{ (analysisResult.totalAreaSqm / 10000).toFixed(2) }} ha</span>
                  <span class="kpi-sub">Clipped within road buffer</span>
                </div>
                <div class="kpi-card">
                  <span class="kpi-label">Road Length</span>
                  <span class="kpi-value">{{ analysisResult.roadLength }} km</span>
                  <span class="kpi-sub">{{ selectedRoadTypeLabel }}</span>
                </div>
                <div class="kpi-card">
                  <span class="kpi-label">Land Use Categories</span>
                  <span class="kpi-value">{{ Object.keys(analysisResult.areaByType).length }} types</span>
                  <span class="kpi-sub">Field: {{ selectedLandUseField }}</span>
                </div>
                <div class="kpi-card">
                  <span class="kpi-label">Land Use Intensity</span>
                  <span class="kpi-value">{{ landUseIntensity }} ha/km</span>
                  <span class="kpi-sub">Hectares served per kilometer</span>
                </div>
              </div>
            </div>

            <!-- Table Tab -->
            <div v-if="activeTab === 'table'" class="tab-pane">
              <div v-if="!analysisResult" class="no-result-text">
                Run an analysis to inspect detailed land use area distributions.
              </div>
              <div v-else class="table-responsive">
                <table class="results-table">
                  <thead>
                    <tr>
                      <th style="width: 45px;">#</th>
                      <th>Land Use Category</th>
                      <th class="text-right">Area (ha)</th>
                      <th class="text-right">Area (m²)</th>
                      <th class="text-right">% of Influence Buffer</th>
                      <th class="text-right">% of Clipped Area</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in tableData" :key="item.type">
                      <td>{{ idx + 1 }}</td>
                      <td>
                        <span class="lu-swatch" :style="{ backgroundColor: getCategoryColor(item.type) }"></span>
                        <strong>{{ item.type }}</strong>
                      </td>
                      <td class="text-right font-mono">{{ item.ha.toFixed(4) }}</td>
                      <td class="text-right font-mono">{{ item.sqm.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</td>
                      <td class="text-right font-mono">{{ item.pctOfBuffer.toFixed(2) }}%</td>
                      <td class="text-right font-mono">{{ item.pctOfClipped.toFixed(1) }}%</td>
                    </tr>
                    <tr class="total-row">
                      <td colspan="2"><strong>Total Clipped Land Use Area</strong></td>
                      <td class="text-right font-mono"><strong>{{ (analysisResult.totalAreaSqm / 10000).toFixed(4) }}</strong></td>
                      <td class="text-right font-mono"><strong>{{ analysisResult.totalAreaSqm.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</strong></td>
                      <td class="text-right font-mono"><strong>{{ totalBufferPct }}%</strong></td>
                      <td class="text-right font-mono"><strong>100.0%</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Charts Tab -->
            <div v-if="activeTab === 'charts'" class="tab-pane">
              <div v-if="!analysisResult" class="no-result-text">
                Visual charts will appear here after running an analysis.
              </div>
              <div v-else class="charts-grid">
                <div class="chart-box">
                  <h4 class="chart-title">Land Use Distribution (Hectares)</h4>
                  <div class="canvas-wrapper">
                    <canvas ref="pieCanvas"></canvas>
                  </div>
                </div>
                <div class="chart-box">
                  <h4 class="chart-title">Area by Land Use Category</h4>
                  <div class="canvas-wrapper">
                    <canvas ref="barCanvas"></canvas>
                  </div>
                </div>
              </div>
            </div>

            <!-- Report Tab -->
            <div v-if="activeTab === 'report'" class="tab-pane">
              <div v-if="!analysisResult" class="no-result-text">
                Run an analysis to generate an automated project assessment and investment report.
              </div>
              <div v-else class="report-container">
                <div class="report-cards-grid">
                  <div class="rep-card border-red">
                    <span class="rep-label">Road Length</span>
                    <span class="rep-value">{{ analysisResult.roadLength }} km</span>
                  </div>
                  <div class="rep-card border-green">
                    <span class="rep-label">Influence Area</span>
                    <span class="rep-value">{{ (analysisResult.totalAreaSqm / 10000).toFixed(2) }} ha</span>
                  </div>
                  <div class="rep-card border-yellow">
                    <span class="rep-label">Estimated Project Cost</span>
                    <span class="rep-value">{{ formatCurrency(costEstimate.totalCost) }}</span>
                  </div>
                  <div class="rep-card border-blue">
                    <span class="rep-label">Est. Farmer Beneficiaries</span>
                    <span class="rep-value">{{ beneficiariesCount > 0 ? beneficiariesCount.toLocaleString() + ' farmers' : '—' }}</span>
                  </div>
                </div>

                <div class="report-details-grid">
                  <div class="panel-section">
                    <h4 class="panel-title"><Document20 class="panel-icon" /> Executive Narrative</h4>
                    <div class="narrative-content">
                      <p>
                        The proposed <strong>{{ costEstimate.roadType }}</strong> spans a length of 
                        <strong>{{ analysisResult.roadLength }} km</strong> in Alcala, Cagayan with an influence zone of 
                        <strong>{{ bufferDistance }} meters</strong> per side.
                      </p>
                      <p>
                        A total of <strong>{{ (analysisResult.totalAreaSqm / 10000).toFixed(2) }} hectares</strong> of land 
                        is directly served by the corridor, including <strong>{{ agriMetrics.areaHa.toFixed(2) }} hectares</strong> 
                        of prime agricultural farmland.
                      </p>
                      <p>
                        Based on an average farm size of <strong>{{ avgFarmSize }} ha/farmer</strong>, an estimated 
                        <strong>{{ agriMetrics.beneficiaries.toLocaleString() }} farming families</strong> will benefit from reduced transport costs and enhanced farm-to-market access.
                      </p>
                    </div>
                  </div>

                  <div class="panel-section">
                    <h4 class="panel-title"><ChartCombo20 class="panel-icon" /> Investment & Economic Feasibility</h4>
                    <table class="cost-table">
                      <tbody>
                        <tr>
                          <td>Standard Cost per km</td>
                          <td class="text-right font-mono">{{ formatCurrency(costEstimate.costPerKm) }}/km</td>
                        </tr>
                        <tr>
                          <td>Total Estimated Investment</td>
                          <td class="text-right font-mono highlight-cost">{{ formatCurrency(costEstimate.totalCost) }}</td>
                        </tr>
                        <tr>
                          <td>Cost per Hectare Served</td>
                          <td class="text-right font-mono">{{ costPerHectare }}</td>
                        </tr>
                        <tr>
                          <td>Cost per Beneficiary Farmer</td>
                          <td class="text-right font-mono">{{ costPerBeneficiary }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Repository Tab -->
            <div v-if="activeTab === 'repository'" class="tab-pane">
              <div v-if="proposals.length === 0" class="no-result-text">
                No saved proposals yet. You can save your current analysis results using the "Save Proposal" section in the sidebar.
              </div>
              <div v-else class="proposals-list">
                <div v-for="prop in proposals" :key="prop.id" class="proposal-card">
                  <div class="prop-icon"><Document20 /></div>
                  <div class="prop-info">
                    <div class="prop-title-row">
                      <strong class="prop-name">{{ prop.name }}</strong>
                      <span class="status-pill" :class="getStatusClass(prop.status)">{{ prop.status || 'Draft' }}</span>
                    </div>
                    <p v-if="prop.description" class="prop-desc">{{ prop.description }}</p>
                    <div class="prop-meta-row">
                      <span>{{ formatDate(prop.createdAt) }}</span>
                      <span>·</span>
                      <span>{{ prop.stats?.roadLength || '—' }}</span>
                      <span>·</span>
                      <span>{{ prop.stats?.totalLandUseArea ? `${prop.stats.totalLandUseArea.toFixed(2)} ha` : '—' }}</span>
                      <span v-if="prop.cost?.totalCost">· {{ formatCurrency(prop.cost.totalCost) }}</span>
                      <span v-if="prop.stats?.estimatedBeneficiaries">· {{ prop.stats.estimatedBeneficiaries }} farmers</span>
                    </div>
                  </div>
                  <div class="prop-actions">
                    <button type="button" class="btn btn-sm btn-primary" @click="loadProposal(prop.id)">
                      Load
                    </button>
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteProposal(prop.id)">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import {
  Road20,
  Map20,
  Location20,
  Upload20,
  TrashCan16,
  Renew20,
  Analytics20,
  Reset20,
  Save20,
  DocumentExport20,
  Earth20,
  ChartCombo20,
  ChevronUp20,
  WarningAlt20,
  Document20,
  Settings20,
} from '@carbon/icons-vue'
import { useToast } from '@/composables/useToast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import * as turf from '@turf/turf'
import { Chart, registerables } from 'chart.js'
import proj4 from 'proj4'
import alcalaBoundaryRaw from '@/assets/AlcalaBoundary.json'

// Register UTM Zone 51N projection (EPSG:32651)
proj4.defs('EPSG:32651', '+proj=utm +zone=51 +datum=WGS84 +units=m +no_defs')

// Convert Alcala boundary coordinates from EPSG:32651 to standard WGS84 [lng, lat]
function convertUtmCoords(coords) {
  if (typeof coords[0] === 'number') {
    return proj4('EPSG:32651', 'EPSG:4326', coords)
  }
  return coords.map(convertUtmCoords)
}

const alcalaBoundaryGeoJson = {
  ...alcalaBoundaryRaw,
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
  features: (alcalaBoundaryRaw.features || []).map(f => ({
    ...f,
    geometry: {
      ...f.geometry,
      coordinates: convertUtmCoords(f.geometry.coordinates)
    }
  }))
}

Chart.register(...registerables)

const { toast, success, warning, error, info } = useToast()
const { confirm } = useConfirmDialog()

// Coordinates and State
const currentCoordinates = ref('Click map for coordinates')
const mapContainer = ref(null)
let map = null

const isSidebarCollapsed = ref(false)
const isResultsOpen = ref(false)
const activeTab = ref('summary')

const isProcessing = ref(false)
const isBuffering = ref(false)
const isAnalyzing = ref(false)
const loadingMessage = ref('Processing...')

const isDraggingRoad = ref(false)
const isDraggingLandUse = ref(false)

const roadFileInput = ref(null)
const landUseFileInput = ref(null)

const roadFileName = ref('')
const landUseFileName = ref('')
const isLandUsePersisted = ref(false)

const bufferDistance = ref(500)
const selectedRoadType = ref('concrete')
const avgFarmSize = ref(0.50)

const proposalName = ref('')
const proposalDesc = ref('')
const proposalStatus = ref('Draft')
const selectedProposalId = ref('')

const roadData = ref(null)
const landUseData = ref(null)
const bufferData = ref(null)
const intersectionData = ref(null)
const analysisResult = ref(null)

const landUseFields = ref([])
const selectedLandUseField = ref('')

const proposals = ref([])
const diagnosticInfo = ref(null)

const pieCanvas = ref(null)
const barCanvas = ref(null)
let pieChartInstance = null
let barChartInstance = null

// Layers map
const mapLayers = {
  boundary: null,
  road: null,
  landuse: null,
  buffer: null,
  intersection: null,
  legend: null,
}

const ALCALA_CENTER = [17.9028, 121.6562]
const STORAGE_KEY_PROPOSALS = 'fmr_alcala_proposals'
const STORAGE_KEY_LANDUSE = 'fmr_alcala_landuse'
const STORAGE_KEY_FILENAME = 'fmr_alcala_landuse_name'
const IDB_DB_NAME = 'fmr_alcala_db'
const IDB_STORE_NAME = 'landuse_store'

const ROAD_COST_CONFIG = {
  concrete: { label: 'Concrete Road', costPerKm: 12000000 },
  asphalt: { label: 'Asphalt Road', costPerKm: 9000000 },
  gravel: { label: 'Gravel Road', costPerKm: 4000000 },
}

const COLOR_PALETTE = [
  '#2e7d32', '#1e88e5', '#f9a825', '#8e24aa', '#e53935',
  '#00acc1', '#fb8c00', '#3949ab', '#c0ca33', '#795548',
  '#00897b', '#e91e63', '#7cb342', '#5e35b1', '#00bcd4',
  '#fbc02d', '#546e7a', '#ad1457', '#689f38', '#1565c0',
]

// Computed Metrics
const roadFeaturesCount = computed(() => roadData.value?.features?.length || 0)
const roadLineCount = computed(() => {
  if (!roadData.value) return 0
  return roadData.value.features.filter(f =>
    f.geometry?.type === 'LineString' || f.geometry?.type === 'MultiLineString'
  ).length
})

const landUseFeaturesCount = computed(() => landUseData.value?.features?.length || 0)
const landUsePolyCount = computed(() => {
  if (!landUseData.value) return 0
  return landUseData.value.features.filter(f =>
    f.geometry?.type === 'Polygon' || f.geometry?.type === 'MultiPolygon'
  ).length
})

const roadLengthKm = computed(() => {
  if (!roadData.value) return 0
  let total = 0
  roadData.value.features.forEach(f => {
    if (f.geometry?.type === 'LineString' || f.geometry?.type === 'MultiLineString') {
      total += turf.length(f, { units: 'kilometers' })
    }
  })
  return total
})

const roadLengthFormatted = computed(() => {
  return roadLengthKm.value > 0 ? `${roadLengthKm.value.toFixed(2)} km` : '—'
})

const bufferAreaHa = computed(() => {
  if (!bufferData.value) return 0
  let total = 0
  bufferData.value.features.forEach(f => {
    total += turf.area(f)
  })
  return total / 10000
})

const bufferAreaFormatted = computed(() => {
  return bufferAreaHa.value > 0 ? `${bufferAreaHa.value.toFixed(2)} ha` : '—'
})

const selectedRoadTypeLabel = computed(() => {
  return ROAD_COST_CONFIG[selectedRoadType.value]?.label || 'Concrete Road'
})

const costEstimate = computed(() => {
  const costPerKm = ROAD_COST_CONFIG[selectedRoadType.value]?.costPerKm || 12000000
  const len = roadLengthKm.value
  return {
    roadType: selectedRoadTypeLabel.value,
    costPerKm,
    lengthKm: len,
    totalCost: len * costPerKm,
  }
})

const agriMetrics = computed(() => {
  if (!analysisResult.value?.areaByType) return { areaHa: 0, beneficiaries: 0 }
  const agriKeywords = ['agricultur', 'rice', 'corn', 'crop', 'vegetable', 'farm', 'agri', 'palay', 'maize']
  let agriSqm = 0
  Object.entries(analysisResult.value.areaByType).forEach(([type, sqm]) => {
    const lower = type.toLowerCase()
    if (agriKeywords.some(k => lower.includes(k))) {
      agriSqm += sqm
    }
  })
  const areaHa = agriSqm / 10000
  const farmSize = avgFarmSize.value > 0 ? avgFarmSize.value : 0.5
  const beneficiaries = Math.round(areaHa / farmSize)
  return { areaHa, beneficiaries, farmSize }
})

const beneficiariesCount = computed(() => agriMetrics.value.beneficiaries)

const landUseIntensity = computed(() => {
  if (!analysisResult.value || roadLengthKm.value <= 0) return '—'
  const totalHa = analysisResult.value.totalAreaSqm / 10000
  return (totalHa / roadLengthKm.value).toFixed(2)
})

const costPerHectare = computed(() => {
  if (!analysisResult.value || analysisResult.value.totalAreaSqm <= 0) return '—'
  const totalHa = analysisResult.value.totalAreaSqm / 10000
  return formatCurrency(Math.round(costEstimate.value.totalCost / totalHa)) + ' / ha'
})

const costPerBeneficiary = computed(() => {
  if (beneficiariesCount.value <= 0) return '—'
  return formatCurrency(Math.round(costEstimate.value.totalCost / beneficiariesCount.value)) + ' / farmer'
})

const tableData = computed(() => {
  if (!analysisResult.value?.areaByType) return []
  const { areaByType, totalAreaSqm, bufferAreaSqm = 0 } = analysisResult.value
  return Object.entries(areaByType)
    .sort((a, b) => b[1] - a[1])
    .map(([type, sqm]) => {
      const ha = sqm / 10000
      const pctOfBuffer = bufferAreaSqm > 0 ? (sqm / bufferAreaSqm) * 100 : 0
      const pctOfClipped = totalAreaSqm > 0 ? (sqm / totalAreaSqm) * 100 : 0
      return { type, sqm, ha, pctOfBuffer, pctOfClipped }
    })
})

const totalBufferPct = computed(() => {
  if (!analysisResult.value || !analysisResult.value.bufferAreaSqm) return '0.00'
  return ((analysisResult.value.totalAreaSqm / analysisResult.value.bufferAreaSqm) * 100).toFixed(2)
})

// IndexedDB Helper
const openIDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'))
    }
    const req = indexedDB.open(IDB_DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

const setIDB = async (key, val) => {
  const db = await openIDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite')
    tx.objectStore(IDB_STORE_NAME).put(val, key)
    tx.oncomplete = () => { db.close(); resolve(); }
    tx.onerror = () => { db.close(); reject(tx.error); }
  })
}

const getIDB = async (key) => {
  const db = await openIDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readonly')
    const req = tx.objectStore(IDB_STORE_NAME).get(key)
    req.onsuccess = () => { db.close(); resolve(req.result); }
    req.onerror = () => { db.close(); reject(req.error); }
  })
}

const deleteIDB = async (key) => {
  const db = await openIDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite')
    tx.objectStore(IDB_STORE_NAME).delete(key)
    tx.oncomplete = () => { db.close(); resolve(); }
    tx.onerror = () => { db.close(); reject(tx.error); }
  })
}

// KML Parser
function parseKML(text) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/xml')
  const err = doc.querySelector('parsererror')
  if (err) throw new Error('Invalid KML XML structure')

  const placemarks = doc.querySelectorAll('Placemark')
  if (!placemarks.length) throw new Error('No Placemarks found in KML')

  const features = []
  placemarks.forEach(pm => {
    const name = (pm.querySelector('name')?.textContent || '').trim()
    const desc = (pm.querySelector('description')?.textContent || '').trim()
    const props = { name, description: desc }

    const extData = pm.querySelector('ExtendedData')
    if (extData) {
      extData.querySelectorAll('Data').forEach(d => {
        const key = d.getAttribute('name')
        const val = d.querySelector('value')?.textContent
        if (key && val) props[key] = val
      })
      extData.querySelectorAll('SchemaData > SimpleData').forEach(d => {
        const key = d.getAttribute('name')
        if (key && d.textContent) props[key] = d.textContent
      })
    }

    const processed = processKMLGeometry(pm, props)
    if (processed) {
      if (Array.isArray(processed)) {
        processed.forEach(f => features.push(f))
      } else {
        features.push(processed)
      }
    }
  })

  return { type: 'FeatureCollection', features }
}

function processKMLGeometry(node, props) {
  const geomTypes = ['Point', 'LineString', 'Polygon', 'MultiGeometry', 'MultiPoint', 'MultiLineString', 'MultiPolygon']
  for (const type of geomTypes) {
    const el = node.querySelector(`:scope > ${type}`)
    if (!el) continue

    if (type === 'MultiGeometry') {
      const children = []
      el.childNodes.forEach(child => {
        if (child.nodeType === 1) {
          const coords = readCoords(child, child.tagName)
          if (coords) {
            children.push({
              type: 'Feature',
              properties: { ...props },
              geometry: {
                type: child.tagName === 'LineString' ? 'LineString' : child.tagName === 'Polygon' ? 'Polygon' : child.tagName,
                coordinates: coords,
              }
            })
          }
        }
      })
      return children.length ? children : null
    }

    const coords = readCoords(el, type)
    if (!coords) continue

    return {
      type: 'Feature',
      properties: { ...props },
      geometry: {
        type: type === 'LineString' ? 'LineString' : type === 'Polygon' ? 'Polygon' : type,
        coordinates: coords,
      }
    }
  }
  return null
}

function readCoords(el, type) {
  if (type === 'Point') {
    const c = el.querySelector('coordinates')?.textContent
    return c ? parseCoord(c.trim()) : null
  }
  if (type === 'LineString') {
    const c = el.querySelector('coordinates')?.textContent
    return c ? parseCoordList(c.trim()) : null
  }
  if (type === 'Polygon') {
    const rings = el.querySelectorAll('LinearRing')
    if (!rings.length) return null
    const result = []
    rings.forEach(ring => {
      const c = ring.querySelector('coordinates')?.textContent
      if (c) result.push(parseCoordList(c.trim()))
    })
    return result.length ? result : null
  }
  if (type === 'MultiLineString') {
    const lines = el.querySelectorAll('LineString')
    if (!lines.length) return null
    const result = []
    lines.forEach(line => {
      const c = line.querySelector('coordinates')?.textContent
      if (c) result.push(parseCoordList(c.trim()))
    })
    return result.length ? result : null
  }
  if (type === 'MultiPolygon') {
    const polys = el.querySelectorAll('Polygon')
    if (!polys.length) return null
    const result = []
    polys.forEach(poly => {
      const rings = poly.querySelectorAll('LinearRing')
      const polyCoords = []
      rings.forEach(ring => {
        const c = ring.querySelector('coordinates')?.textContent
        if (c) polyCoords.push(parseCoordList(c.trim()))
      })
      if (polyCoords.length) result.push(polyCoords)
    })
    return result.length ? result : null
  }
  return null
}

function parseCoord(text) {
  const parts = text.split(',').map(Number)
  return parts.length >= 2 ? [parts[0], parts[1]] : null
}

function parseCoordList(text) {
  return text.split(/\s+/)
    .filter(s => s.length > 0)
    .map(p => {
      const parts = p.split(',').map(Number)
      return parts.length >= 2 ? [parts[0], parts[1]] : null
    })
    .filter(c => c !== null)
}

function parseGeoJSON(text) {
  const data = JSON.parse(text)
  if (data.type === 'FeatureCollection') return data
  if (data.type === 'Feature') return { type: 'FeatureCollection', features: [data] }
  if (data.type === 'GeometryCollection' || data.type === 'Geometry') {
    return { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: data }] }
  }
  throw new Error('Unrecognized GeoJSON structure: ' + data.type)
}

// Boundary Layer Adder
function addBoundaryLayer() {
  if (!map) return
  if (mapLayers.boundary) {
    if (map.hasLayer(mapLayers.boundary)) map.removeLayer(mapLayers.boundary)
    mapLayers.boundary = null
  }

  mapLayers.boundary = L.geoJSON(alcalaBoundaryGeoJson, {
    style: () => ({
      color: '#15803d',
      weight: 1.8,
      opacity: 0.85,
      dashArray: '4, 4',
      fill: false,
      fillOpacity: 0
    }),
    onEachFeature: (feature, layer) => {
      const props = feature.properties || {}
      const bgyName = props.ADM4_EN || 'Barangay'
      const areaHa = props.Shape_Area ? (props.Shape_Area / 10000).toFixed(2) : '—'

      layer.bindTooltip(`
        <div style="font-weight:650;font-size:12px;color:#14532d;line-height:1.3;">
          🏛️ Brgy. ${escapeHtml(bgyName)}
        </div>
        <div style="font-size:10.5px;color:#4b5563;margin-top:2px;">
          Area: ${areaHa} ha
        </div>
      `, {
        sticky: true,
        direction: 'top',
        className: 'boundary-map-tooltip'
      })

      layer.on('mouseover', () => {
        layer.setStyle({
          color: '#047857',
          weight: 2.5,
          opacity: 1,
          dashArray: '',
          fill: false,
          fillOpacity: 0
        })
      })

      layer.on('mouseout', () => {
        layer.setStyle({
          color: '#15803d',
          weight: 1.8,
          opacity: 0.85,
          dashArray: '4, 4',
          fill: false,
          fillOpacity: 0
        })
      })
    }
  }).addTo(map)
}

// Map Initialization
function initMap() {
  if (map || !mapContainer.value) return

  map = L.map(mapContainer.value, {
    center: ALCALA_CENTER,
    zoom: 13,
    zoomControl: true,
    attributionControl: true,
  })

  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  const satLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: '&copy; Esri World Imagery',
      maxZoom: 19,
    }
  )

  const baseMaps = {
    'Street Map': osmLayer,
    'Satellite View': satLayer,
  }

  // Add Alcala Boundary as default layer
  addBoundaryLayer()

  const overlays = {
    'Alcala Boundary': mapLayers.boundary,
  }

  L.control.layers(baseMaps, overlays, { position: 'topright' }).addTo(map)
  L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map)

  try {
    if (mapLayers.boundary) {
      map.fitBounds(mapLayers.boundary.getBounds(), { padding: [20, 20] })
    }
  } catch (e) {}

  map.on('click', e => {
    const lat = e.latlng.lat.toFixed(5)
    const lng = e.latlng.lng.toFixed(5)
    currentCoordinates.value = `${lat}°N, ${lng}°E`
  })
}

// Category field detection
function detectLandUseFields(geojson) {
  const fieldSet = new Set()
  geojson.features.forEach(f => {
    if (f.properties) Object.keys(f.properties).forEach(k => fieldSet.add(k))
  })
  const allFields = ['name', 'description', ...Array.from(fieldSet).filter(f => !['name', 'description'].includes(f))]
  landUseFields.value = allFields

  const norm = n => String(n).toLowerCase().replace(/[_\s\-.,]/g, '')
  const scoreField = name => {
    const n = norm(name)
    let s = 0
    if (n.includes('landclass') || n.includes('landcover')) s += 100
    else if (n.includes('land') && (n.includes('use') || n.includes('cover') || n.includes('class') || n.includes('type'))) s += 80
    else if (n === 'lu' || n === 'class' || n === 'type' || n === 'category' || n === 'kind') s += 25
    else if (n.includes('class') || n.includes('type') || n.includes('use') || n.includes('cover') || n.includes('category')) s += 5
    if (n.length <= 18) s += 2
    return s
  }

  let selected = allFields[0]
  let best = -1
  allFields.forEach((f, i) => {
    if (['name', 'description'].includes(f)) return
    const s = scoreField(f) - i * 0.001
    if (s > best) {
      best = s
      selected = f
    }
  })

  // Verify non-empty
  let nonEmpty = 0
  geojson.features.forEach(feat => {
    const v = feat.properties?.[selected]
    if (v !== undefined && v !== null && String(v).trim() !== '') nonEmpty++
  })
  if (nonEmpty === 0) {
    for (const f of allFields) {
      if (['name', 'description'].includes(f)) continue
      let count = 0
      geojson.features.forEach(feat => {
        if (feat.properties?.[f] !== undefined && String(feat.properties?.[f]).trim() !== '') count++
      })
      if (count > 0) {
        selected = f
        break
      }
    }
  }

  selectedLandUseField.value = selected || 'name'
}

function getCategoryColor(type) {
  if (!type) return COLOR_PALETTE[0]
  let hash = 0
  for (let i = 0; i < String(type).length; i++) {
    hash = (hash << 5) - hash + String(type).charCodeAt(i)
    hash |= 0
  }
  const idx = Math.abs(hash) % COLOR_PALETTE.length
  return COLOR_PALETTE[idx]
}

function getLandUseCategory(feature) {
  if (!feature || !feature.properties) return 'Unknown'
  const props = feature.properties
  const f = selectedLandUseField.value
  if (f && props[f] !== undefined && props[f] !== null && String(props[f]).trim() !== '') {
    return String(props[f]).trim()
  }
  for (const k of Object.keys(props)) {
    if (k.toLowerCase().includes('class') || k.toLowerCase().includes('use') || k.toLowerCase().includes('type')) {
      if (props[k]) return String(props[k]).trim()
    }
  }
  return props.name || 'Unknown'
}

// Layer Adders
function addRoadLayer(geojson) {
  if (!map) return
  if (mapLayers.road) map.removeLayer(mapLayers.road)

  mapLayers.road = L.geoJSON(geojson, {
    style: { color: '#e53935', weight: 3.5, opacity: 0.9 },
    onEachFeature: (f, layer) => {
      const name = f.properties?.name || 'Road Corridor'
      layer.bindPopup(`<div style="font-family: inherit; font-size: 13px;"><b>🛣️ ${escapeHtml(name)}</b></div>`)
    }
  }).addTo(map)

  try {
    map.fitBounds(mapLayers.road.getBounds().pad(0.15))
  } catch (e) {}
  updateLegend()
}

function addLandUseLayer(geojson) {
  if (!map) return
  if (mapLayers.landuse) map.removeLayer(mapLayers.landuse)

  mapLayers.landuse = L.geoJSON(geojson, {
    style: f => {
      const cat = getLandUseCategory(f)
      const color = getCategoryColor(cat)
      return {
        color: color,
        weight: 1.2,
        opacity: 0.75,
        fillColor: color,
        fillOpacity: 0.25,
      }
    },
    onEachFeature: (f, layer) => {
      const cat = getLandUseCategory(f)
      const areaHa = turf.area(f) / 10000
      const props = f.properties || {}
      
      const propRows = Object.entries(props)
        .filter(([k, v]) => !['name', 'description'].includes(k) && v !== null && v !== undefined && String(v).trim() !== '')
        .slice(0, 6)
        .map(([k, v]) => `<div style="font-size:11px;color:#555;"><b style="color:#222;">${escapeHtml(k)}:</b> ${escapeHtml(String(v))}</div>`)
        .join('')

      layer.bindPopup(`
        <div style="min-width: 200px; font-family: inherit; font-size: 13px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #1a5e2a; font-weight: 700;">Land Classification</div>
          <div style="font-size: 15px; font-weight: 700; margin: 2px 0 4px;">${escapeHtml(cat)}</div>
          <div style="color: #444; margin-bottom: 6px;">📐 <strong>${areaHa.toFixed(2)} ha</strong> total area</div>
          ${propRows ? `<div style="border-top: 1px dashed #ddd; padding-top: 4px;">${propRows}</div>` : ''}
        </div>
      `)

      layer.on('mouseover', () => layer.setStyle({ weight: 2.5, fillOpacity: 0.45 }))
      layer.on('mouseout', () => {
        const c = getCategoryColor(getLandUseCategory(f.feature || f))
        layer.setStyle({ color: c, weight: 1.2, opacity: 0.75, fillColor: c, fillOpacity: 0.25 })
      })
    }
  }).addTo(map)

  fitAllData()
  updateLegend()
}

function addBufferLayer(geojson) {
  if (!map) return
  if (mapLayers.buffer) map.removeLayer(mapLayers.buffer)

  mapLayers.buffer = L.geoJSON(geojson, {
    style: {
      color: '#1a5e2a',
      weight: 2,
      opacity: 0.8,
      fillColor: '#2e7d32',
      fillOpacity: 0.15,
    },
    onEachFeature: (f, layer) => {
      const area = turf.area(f) / 10000
      layer.bindPopup(`<b>${bufferDistance.value}m Road Influence Buffer</b><br>Influence Area: ${area.toFixed(2)} ha`)
    }
  }).addTo(map)

  updateLegend()
}

function addIntersectionLayer(geojson) {
  if (!map) return
  if (mapLayers.intersection) map.removeLayer(mapLayers.intersection)
  if (!geojson.features?.length) return

  mapLayers.intersection = L.geoJSON(geojson, {
    style: f => {
      const cat = f.properties?.[selectedLandUseField.value] || 'Unknown'
      const color = getCategoryColor(cat)
      return {
        color: color,
        weight: 1.5,
        opacity: 0.9,
        fillColor: color,
        fillOpacity: 0.6,
      }
    },
    onEachFeature: (f, layer) => {
      const cat = f.properties?.[selectedLandUseField.value] || 'Unknown'
      const area = (f.properties?._area_ha || (turf.area(f) / 10000))
      layer.bindPopup(`<b>${escapeHtml(cat)}</b><br>Clipped Area: ${area.toFixed(2)} ha`)
    }
  }).addTo(map)
}

function updateLegend() {
  if (!map) return
  if (mapLayers.legend) map.removeControl(mapLayers.legend)

  const items = []
  if (roadData.value) {
    items.push({ type: 'line', color: '#e53935', label: 'Road Corridor' })
  }
  if (bufferData.value) {
    items.push({ type: 'fill', color: '#2e7d32', border: '#1a5e2a', alpha: 0.25, label: `${bufferDistance.value}m Influence Buffer` })
  }

  if (analysisResult.value?.areaByType) {
    const sorted = Object.entries(analysisResult.value.areaByType).sort((a, b) => b[1] - a[1])
    sorted.forEach(([type]) => {
      items.push({
        type: 'fill',
        color: getCategoryColor(type),
        alpha: 0.6,
        label: `${type} (clipped)`,
      })
    })
  } else if (landUseData.value) {
    items.push({ type: 'fill', color: '#90a4ae', border: '#455a64', alpha: 0.3, label: 'Land Use Polygons (full)' })
  }

  if (!items.length) return

  mapLayers.legend = L.control({ position: 'topleft' })
  mapLayers.legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'map-legend-box')
    div.style.cssText = 'background: var(--bg-elevated, #ffffff); color: var(--text, #111); padding: 8px 12px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); font-size: 11px; line-height: 1.5; max-height: 220px; overflow-y: auto; min-width: 160px; border: 1px solid var(--border, #ddd);'
    let html = '<div style="font-weight:700; margin-bottom:4px; text-transform:uppercase; color: var(--brand-600, #2e7d32);">Map Legend</div>'
    items.forEach(it => {
      let swatch = ''
      if (it.type === 'line') {
        swatch = `<span style="display:inline-block;width:18px;height:3px;background:${it.color};vertical-align:middle;margin-right:6px;border-radius:2px;"></span>`
      } else {
        const border = it.border ? `border:1px solid ${it.border};` : ''
        swatch = `<span style="display:inline-block;width:12px;height:12px;background:${it.color};${border}opacity:${it.alpha || 0.6};vertical-align:middle;margin-right:6px;border-radius:2px;"></span>`
      }
      html += `<div style="margin:2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${swatch}${escapeHtml(it.label)}</div>`
    })
    div.innerHTML = html
    return div
  }
  mapLayers.legend.addTo(map)
}

function fitAllData() {
  if (!map) return
  const bounds = []
  if (mapLayers.landuse) {
    try { bounds.push(mapLayers.landuse.getBounds()) } catch (e) {}
  }
  if (mapLayers.road) {
    try { bounds.push(mapLayers.road.getBounds()) } catch (e) {}
  }
  if (mapLayers.buffer) {
    try { bounds.push(mapLayers.buffer.getBounds()) } catch (e) {}
  }
  if (!bounds.length) {
    if (mapLayers.boundary) {
      try { map.fitBounds(mapLayers.boundary.getBounds(), { padding: [20, 20] }) } catch (e) {}
    }
    return
  }
  try {
    let combined = bounds[0]
    for (let i = 1; i < bounds.length; i++) combined.extend(bounds[i])
    map.fitBounds(combined.pad(0.12))
  } catch (e) {}
}

// File Upload Handlers
function triggerRoadFileInput() {
  roadFileInput.value?.click()
}

function triggerLandUseFileInput() {
  landUseFileInput.value?.click()
}

async function handleRoadFileSelect(e) {
  const file = e.target.files?.[0]
  if (file) await loadRoadFile(file)
}

async function handleRoadDrop(e) {
  isDraggingRoad.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) await loadRoadFile(file)
}

async function loadRoadFile(file) {
  isProcessing.value = true
  loadingMessage.value = 'Parsing road network...'
  try {
    const text = await file.text()
    let geojson
    if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
      geojson = parseGeoJSON(text)
    } else {
      geojson = parseKML(text)
    }
    roadData.value = geojson
    roadFileName.value = file.name
    addRoadLayer(geojson)
    info(`Road network loaded: ${geojson.features.length} feature(s)`)
  } catch (err) {
    error(`Error parsing road network: ${err.message}`)
  } finally {
    isProcessing.value = false
  }
}

async function handleLandUseFileSelect(e) {
  const file = e.target.files?.[0]
  if (file) await loadLandUseFile(file)
}

async function handleLandUseDrop(e) {
  isDraggingLandUse.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) await loadLandUseFile(file)
}

async function loadLandUseFile(file) {
  isProcessing.value = true
  loadingMessage.value = 'Parsing and indexing land use map...'
  try {
    const text = await file.text()
    let geojson
    if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
      geojson = parseGeoJSON(text)
    } else {
      geojson = parseKML(text)
    }
    landUseData.value = geojson
    landUseFileName.value = file.name
    detectLandUseFields(geojson)
    addLandUseLayer(geojson)

    // Persist
    await persistLandUse(geojson, file.name)
    success(`Land use map loaded: ${geojson.features.length} polygon(s)`)
  } catch (err) {
    error(`Error parsing land use map: ${err.message}`)
  } finally {
    isProcessing.value = false
  }
}

async function persistLandUse(geojson, name) {
  try {
    const json = JSON.stringify(geojson)
    localStorage.setItem(STORAGE_KEY_LANDUSE, json)
    localStorage.setItem(STORAGE_KEY_FILENAME, name || 'land use')
    isLandUsePersisted.value = true
    return
  } catch (e) {}

  try {
    await setIDB(STORAGE_KEY_LANDUSE, geojson)
    await setIDB(STORAGE_KEY_FILENAME, name || 'land use')
    isLandUsePersisted.value = true
  } catch (e) {
    isLandUsePersisted.value = false
  }
}

async function loadPersistedLandUse() {
  let geojson = null
  let name = 'Land Use Map'

  try {
    const raw = localStorage.getItem(STORAGE_KEY_LANDUSE)
    if (raw) {
      geojson = JSON.parse(raw)
      name = localStorage.getItem(STORAGE_KEY_FILENAME) || 'Land Use Map'
    }
  } catch (e) {}

  if (!geojson) {
    try {
      geojson = await getIDB(STORAGE_KEY_LANDUSE)
      const storedName = await getIDB(STORAGE_KEY_FILENAME)
      if (storedName) name = storedName
    } catch (e) {}
  }

  if (geojson && geojson.features) {
    landUseData.value = geojson
    landUseFileName.value = name + ' (Saved)'
    isLandUsePersisted.value = true
    detectLandUseFields(geojson)
    addLandUseLayer(geojson)
  }
}

function onLandUseFieldChange() {
  if (landUseData.value) {
    addLandUseLayer(landUseData.value)
    if (analysisResult.value && bufferData.value) {
      computeAnalysis()
    }
  }
}

function clearRoad() {
  if (mapLayers.road) { map.removeLayer(mapLayers.road); mapLayers.road = null; }
  if (mapLayers.buffer) { map.removeLayer(mapLayers.buffer); mapLayers.buffer = null; }
  if (mapLayers.intersection) { map.removeLayer(mapLayers.intersection); mapLayers.intersection = null; }
  roadData.value = null
  bufferData.value = null
  intersectionData.value = null
  analysisResult.value = null
  roadFileName.value = ''
  if (roadFileInput.value) roadFileInput.value.value = ''
  updateLegend()
  info('Road network removed')
}

async function clearLandUse() {
  if (mapLayers.landuse) { map.removeLayer(mapLayers.landuse); mapLayers.landuse = null; }
  if (mapLayers.intersection) { map.removeLayer(mapLayers.intersection); mapLayers.intersection = null; }
  landUseData.value = null
  intersectionData.value = null
  analysisResult.value = null
  landUseFileName.value = ''
  landUseFields.value = []
  selectedLandUseField.value = ''
  isLandUsePersisted.value = false
  if (landUseFileInput.value) landUseFileInput.value.value = ''

  try {
    localStorage.removeItem(STORAGE_KEY_LANDUSE)
    localStorage.removeItem(STORAGE_KEY_FILENAME)
    await deleteIDB(STORAGE_KEY_LANDUSE)
    await deleteIDB(STORAGE_KEY_FILENAME)
  } catch (e) {}

  updateLegend()
  info('Land use map cleared from workspace and storage')
}

function clearAll() {
  clearRoad()
  isResultsOpen.value = false
  diagnosticInfo.value = null
  if (map) {
    if (mapLayers.landuse) {
      try { map.fitBounds(mapLayers.landuse.getBounds().pad(0.15)) } catch (e) { map.setView(ALCALA_CENTER, 14) }
    } else {
      map.setView(ALCALA_CENTER, 14)
    }
  }
  info('Workspace reset')
}

// Spatial Analysis Actions
async function generateBuffer() {
  if (!roadData.value) {
    warning('Please upload a road network first.')
    return
  }

  isProcessing.value = true
  isBuffering.value = true
  loadingMessage.value = `Computing ${bufferDistance.value}m buffer...`

  await nextTick()
  setTimeout(() => {
    try {
      const distKm = bufferDistance.value / 1000
      const buffers = []
      roadData.value.features.forEach(f => {
        if (f.geometry?.type === 'LineString' || f.geometry?.type === 'MultiLineString') {
          const buf = turf.buffer(f, distKm, { units: 'kilometers' })
          if (buf) buffers.push(buf)
        }
      })

      if (!buffers.length) {
        throw new Error('No valid road lines found to buffer.')
      }

      let merged = null
      if (buffers.length === 1) {
        merged = buffers[0]
      } else {
        try {
          merged = turf.union(turf.featureCollection(buffers))
        } catch (e) {
          merged = turf.featureCollection(buffers)
        }
      }

      if (merged.type === 'Feature') {
        merged = turf.featureCollection([merged])
      } else if (merged.type !== 'FeatureCollection') {
        merged = turf.featureCollection(merged.features || [merged])
      }

      bufferData.value = merged
      addBufferLayer(merged)
      success(`Buffer generated: ${bufferDistance.value}m influence area on each side`)
    } catch (err) {
      error(`Buffer error: ${err.message}`)
    } finally {
      isProcessing.value = false
      isBuffering.value = false
    }
  }, 40)
}

async function runAnalysis() {
  if (!roadData.value || !landUseData.value || !bufferData.value) {
    warning('Please ensure Road Network, Land Use Map, and Buffer are all loaded.')
    return
  }

  isProcessing.value = true
  isAnalyzing.value = true
  loadingMessage.value = 'Calculating spatial intersections & agricultural impact...'

  await nextTick()
  setTimeout(() => {
    try {
      computeAnalysis()
    } catch (err) {
      error(`Analysis error: ${err.message}`)
    } finally {
      isProcessing.value = false
      isAnalyzing.value = false
    }
  }, 50)
}

function computeAnalysis() {
  const buffer = bufferData.value
  const landuse = landUseData.value
  const field = selectedLandUseField.value

  let mergedBuffer = null
  if (buffer.features.length === 1) {
    mergedBuffer = buffer.features[0]
  } else if (buffer.features.length > 1) {
    try {
      mergedBuffer = turf.union(turf.featureCollection(buffer.features))
    } catch (e) {
      mergedBuffer = null
    }
  }

  const bufFeatures = mergedBuffer ? [mergedBuffer] : buffer.features
  const intersections = []
  const areaByType = {}
  let totalClippedArea = 0
  let hasOverlap = false

  landuse.features.forEach(f => {
    if (!f.geometry || (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon')) return

    const polyFeat = turf.feature(f.geometry)
    let clipped = null

    for (const bf of bufFeatures) {
      try {
        const inter = turf.intersect(turf.featureCollection([polyFeat, bf]))
        if (inter) {
          if (!clipped) {
            clipped = inter
          } else {
            clipped = turf.union(turf.featureCollection([clipped, inter])) || clipped
          }
        }
      } catch (e) {}
    }

    if (!clipped) return
    hasOverlap = true

    const sqm = turf.area(clipped)
    if (sqm < 0.01) return
    totalClippedArea += sqm

    const luType = (() => {
      const v = f.properties?.[field]
      if (v != null && String(v).trim()) return String(v).trim()
      const fb = getLandUseCategory(f)
      return fb || 'Untyped'
    })()

    clipped.properties = {
      ...f.properties,
      [field]: luType,
      _area_sqm: sqm,
      _area_ha: sqm / 10000,
    }

    intersections.push(clipped)
    areaByType[luType] = (areaByType[luType] || 0) + sqm
  })

  let bufferAreaSqm = 0
  try {
    bufferAreaSqm = mergedBuffer ? turf.area(mergedBuffer) : turf.area(buffer)
  } catch (e) {}

  if (!hasOverlap) {
    let gapKm = null
    try {
      const bBox = turf.bbox(mergedBuffer || buffer)
      const lBox = turf.bbox(landuse)
      const bCenter = [(bBox[0] + bBox[2]) / 2, (bBox[1] + bBox[3]) / 2]
      const lCenter = [(lBox[0] + lBox[2]) / 2, (lBox[1] + lBox[3]) / 2]
      const dx = (bCenter[0] - lCenter[0]) * 111.32 * Math.cos(((bCenter[1] + lCenter[1]) / 2) * (Math.PI / 180))
      const dy = (bCenter[1] - lCenter[1]) * 110.57
      gapKm = Math.sqrt(dx * dx + dy * dy)
    } catch (e) {}

    diagnosticInfo.value = {
      bufferHa: bufferAreaSqm / 10000,
      gapKm,
    }
    warning('No spatial overlap between road buffer and land use polygons. Check coordinate zones or alignment.')
    return
  }

  diagnosticInfo.value = null
  const result = {
    intersections: turf.featureCollection(intersections),
    areaByType,
    totalAreaSqm: totalClippedArea,
    bufferAreaSqm,
    roadLength: roadLengthKm.value.toFixed(2),
    timestamp: new Date().toISOString(),
    landUseField: field,
  }

  analysisResult.value = result
  intersectionData.value = result.intersections
  addIntersectionLayer(result.intersections)
  updateLegend()

  isResultsOpen.value = true
  renderCharts()
  success(`Analysis complete: ${(totalClippedArea / 10000).toFixed(2)} ha classified across ${Object.keys(areaByType).length} land use categories`)
}

// Chart.js Rendering
function renderCharts() {
  if (!analysisResult.value?.areaByType) return
  nextTick(() => {
    const sorted = Object.entries(analysisResult.value.areaByType).sort((a, b) => b[1] - a[1])
    const labels = sorted.map(d => d[0])
    const dataHa = sorted.map(d => d[1] / 10000)
    const colors = labels.map(l => getCategoryColor(l))

    // Pie Chart
    if (pieCanvas.value) {
      if (pieChartInstance) pieChartInstance.destroy()
      pieChartInstance = new Chart(pieCanvas.value, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: dataHa,
            backgroundColor: colors,
            borderWidth: 1.5,
            borderColor: 'var(--bg-elevated, #ffffff)',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { 
                boxWidth: 12, 
                padding: 8, 
                font: { size: 11 },
                color: 'var(--text, #333)'
              }
            },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const total = dataHa.reduce((a, b) => a + b, 0)
                  const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0
                  return ` ${ctx.label}: ${Number(ctx.raw).toFixed(2)} ha (${pct}%)`
                }
              }
            }
          }
        }
      })
    }

    // Bar Chart
    if (barCanvas.value) {
      if (barChartInstance) barChartInstance.destroy()
      barChartInstance = new Chart(barCanvas.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Area (Hectares)',
            data: dataHa,
            backgroundColor: colors,
            borderRadius: 4,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` ${Number(ctx.raw).toFixed(2)} ha`
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              title: { 
                display: true, 
                text: 'Hectares (ha)', 
                font: { size: 11 },
                color: 'var(--text-secondary, #666)'
              },
              ticks: { 
                font: { size: 10 },
                color: 'var(--text-muted, #888)'
              },
              grid: {
                color: 'var(--border, #eee)'
              }
            },
            y: {
              ticks: { 
                font: { size: 10 },
                color: 'var(--text-secondary, #666)'
              },
              grid: {
                display: false
              }
            }
          }
        }
      })
    }
  })
}

// Proposals Repository
function saveProposal() {
  if (!proposalName.value.trim()) {
    warning('Please enter a proposal name.')
    return
  }
  if (!analysisResult.value) {
    warning('Please run a spatial analysis first.')
    return
  }

  const proposal = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: proposalName.value.trim(),
    description: proposalDesc.value.trim(),
    status: proposalStatus.value,
    createdAt: new Date().toISOString(),
    analysis: analysisResult.value,
    data: {
      road: roadData.value,
      landuse: landUseData.value,
      buffer: bufferData.value,
    },
    config: {
      roadType: selectedRoadType.value,
      bufferDist: bufferDistance.value,
      farmSize: avgFarmSize.value,
      landUseField: selectedLandUseField.value,
    },
    cost: costEstimate.value,
    stats: {
      roadLength: roadLengthFormatted.value,
      bufferArea: bufferAreaFormatted.value,
      totalLandUseArea: analysisResult.value.totalAreaSqm / 10000,
      landUseTypes: Object.keys(analysisResult.value.areaByType).length,
      agriculturalAreaHa: agriMetrics.value.areaHa,
      estimatedBeneficiaries: agriMetrics.value.beneficiaries,
    }
  }

  proposals.value.unshift(proposal)
  persistProposals()

  proposalName.value = ''
  proposalDesc.value = ''
  proposalStatus.value = 'Draft'
  success(`Proposal "${proposal.name}" saved to repository!`)
}

function loadProposal(id) {
  const prop = proposals.value.find(p => p.id === id)
  if (!prop) {
    error('Proposal not found.')
    return
  }

  clearRoad()

  if (prop.data?.road) {
    roadData.value = prop.data.road
    roadFileName.value = prop.name + ' (Road)'
    addRoadLayer(prop.data.road)
  }
  if (prop.data?.landuse) {
    landUseData.value = prop.data.landuse
    landUseFileName.value = prop.name + ' (Land Use)'
    if (prop.analysis?.landUseField) {
      selectedLandUseField.value = prop.analysis.landUseField
    }
    addLandUseLayer(prop.data.landuse)
  }
  if (prop.data?.buffer) {
    bufferData.value = prop.data.buffer
    addBufferLayer(prop.data.buffer)
  }
  if (prop.analysis) {
    analysisResult.value = prop.analysis
    if (prop.analysis.intersections) {
      intersectionData.value = prop.analysis.intersections
      addIntersectionLayer(prop.analysis.intersections)
    }
    isResultsOpen.value = true
    renderCharts()
  }

  if (prop.config) {
    selectedRoadType.value = prop.config.roadType || 'concrete'
    bufferDistance.value = prop.config.bufferDist || 500
    avgFarmSize.value = prop.config.farmSize || 0.50
  }

  success(`Loaded proposal: "${prop.name}"`)
}

async function deleteProposal(id) {
  const confirmed = await confirm('Delete Proposal', 'Are you sure you want to delete this proposal permanently?', 'Delete')
  if (!confirmed) return

  proposals.value = proposals.value.filter(p => p.id !== id)
  persistProposals()
  info('Proposal deleted.')
}

function persistProposals() {
  try {
    localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(proposals.value))
  } catch (e) {}
}

function loadStoredProposals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROPOSALS)
    proposals.value = raw ? JSON.parse(raw) : []
  } catch (e) {
    proposals.value = []
  }
}

function onSelectProposal() {
  if (selectedProposalId.value) {
    loadProposal(selectedProposalId.value)
    selectedProposalId.value = ''
  }
}

// Export CSV & GeoJSON
function exportCSV() {
  if (!analysisResult.value) return
  const { areaByType, totalAreaSqm, roadLength, timestamp } = analysisResult.value
  const sorted = Object.entries(areaByType).sort((a, b) => b[1] - a[1])

  let csv = 'FMR Network Plan — Alcala, Cagayan\n'
  csv += `Generated,${new Date(timestamp).toLocaleString('en-PH')}\n`
  csv += `Road Length (km),${roadLength}\n`
  csv += `Total Influence Area (ha),${(totalAreaSqm / 10000).toFixed(4)}\n\n`
  csv += 'Rank,Land Use Category,Area (ha),Area (sqm),Proportion (%)\n'

  sorted.forEach(([type, sqm], i) => {
    const ha = sqm / 10000
    const pct = ((sqm / totalAreaSqm) * 100).toFixed(1)
    csv += `${i + 1},"${type}",${ha.toFixed(4)},${sqm.toFixed(1)},${pct}\n`
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fmr_plan_alcala_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  info('CSV report exported successfully')
}

function exportGeoJSON() {
  if (!roadData.value && !bufferData.value && !intersectionData.value) {
    warning('No spatial features available to export.')
    return
  }

  const exportColl = {
    type: 'FeatureCollection',
    features: []
  }

  if (roadData.value?.features) {
    roadData.value.features.forEach(f => {
      exportColl.features.push({ ...f, properties: { ...f.properties, _layer_role: 'road' } })
    })
  }
  if (bufferData.value?.features) {
    bufferData.value.features.forEach(f => {
      exportColl.features.push({ ...f, properties: { ...f.properties, _layer_role: 'buffer' } })
    })
  }
  if (intersectionData.value?.features) {
    intersectionData.value.features.forEach(f => {
      exportColl.features.push({ ...f, properties: { ...f.properties, _layer_role: 'clipped_landuse' } })
    })
  }

  const json = JSON.stringify(exportColl, null, 2)
  const blob = new Blob([json], { type: 'application/geo+json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fmr_layers_alcala_${new Date().toISOString().slice(0, 10)}.geojson`
  a.click()
  URL.revokeObjectURL(url)
  info('GeoJSON layer dataset exported')
}

// Helpers
function formatCurrency(num) {
  return '₱' + Number(num || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getStatusClass(status) {
  switch (status) {
    case 'Approved':
    case 'Completed': return 'status-green'
    case 'Funded': return 'status-blue'
    case 'For Review': return 'status-orange'
    default: return 'status-gray'
  }
}

function toggleResultsPanel() {
  isResultsOpen.value = !isResultsOpen.value
  if (isResultsOpen.value) {
    renderCharts()
  }
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

watch(activeTab, (tab) => {
  if (tab === 'charts') {
    renderCharts()
  }
})

onMounted(() => {
  initMap()
  loadStoredProposals()
  loadPersistedLandUse()
})

onBeforeUnmount(() => {
  if (pieChartInstance) pieChartInstance.destroy()
  if (barChartInstance) barChartInstance.destroy()
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.network-plan-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}

/* Header */
.plan-header {
  height: 72px;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
  z-index: 10;
}

.page-title-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: 2px;
}

.title-icon-badge {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--brand-50);
  color: var(--brand-600);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--heading);
  line-height: 1.2;
  margin: 0;
}

.page-subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.coord-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-family: var(--font-mono, monospace);
  background: var(--bg-muted);
  border: 1px solid var(--border);
  padding: 0.35rem 0.65rem;
  border-radius: 20px;
  color: var(--text-secondary);
}

.coord-icon {
  color: var(--brand-600);
}

/* Workspace Layout */
.plan-workspace {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* Sidebar */
.plan-sidebar {
  width: 380px;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 5;
  transition: width 200ms ease;
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.config-section {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 0.82rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
}

.section-head .section-title {
  margin-bottom: 0;
}

.icon-label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.section-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}

.panel-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.35rem;
}

.section-badges {
  display: flex;
  gap: 0.35rem;
}

.section-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.4rem;
  line-height: 1.35;
}

/* Dropzone */
.dropzone {
  border: 2px dashed var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  padding: 0.85rem;
  text-align: center;
  cursor: pointer;
  transition: all 180ms ease;
  position: relative;
}

.dropzone:hover,
.dropzone.drag-over {
  border-color: var(--brand-600);
  background: var(--brand-50);
}

.dropzone.has-file {
  border-style: solid;
  border-color: var(--brand-500);
  background: var(--brand-50);
  padding: 0.65rem 0.85rem;
  cursor: default;
}

.hidden-file-input {
  display: none;
}

.dropzone-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.upload-icon {
  color: var(--brand-600);
  width: 24px;
  height: 24px;
}

.upload-title {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--text);
}

.upload-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.dropzone-filled {
  text-align: left;
}

.file-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.file-name {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--heading);
}

.file-meta {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.btn-remove {
  margin-top: 0.4rem;
  background: transparent;
  border: none;
  color: var(--danger-strong);
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  padding: 0;
}

.btn-remove:hover {
  text-decoration: underline;
}

/* Field Select */
.field-select-group {
  margin-top: 0.65rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--border);
}

.field-label-sm {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  margin-bottom: 0.15rem;
}

.field-control-sm,
select.field-control-sm,
input.field-control-sm {
  width: 100%;
  height: 28px !important;
  min-height: 28px !important;
  max-height: 28px !important;
  line-height: 28px;
  font-size: 0.78rem;
  padding: 0 0.55rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  color: var(--text);
  box-sizing: border-box;
}

select.field-control-sm {
  padding-right: 1.2rem;
  cursor: pointer;
}

/* Quick Metrics */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
}

.stat-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.45rem;
  text-align: center;
}

.stat-card-label {
  display: block;
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.stat-card-value {
  display: block;
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--brand-700);
  margin-top: 2px;
}

/* Params & Actions */
.param-row {
  margin-bottom: 0.45rem;
}

.param-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  margin-bottom: 0.15rem;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.unit-text {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.action-buttons-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.55rem;
}

.btn-icon {
  width: 15px;
  height: 15px;
}

.btn-block {
  width: 100%;
}

.btn-sm,
.action-buttons-group .btn,
.proposal-inputs .btn,
.export-buttons .btn {
  height: 28px !important;
  min-height: 28px !important;
  max-height: 28px !important;
  line-height: 28px;
  padding: 0 0.65rem;
  font-size: 0.76rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  box-sizing: border-box;
}

.btn-accent {
  background: #f9a825;
  color: #1a1a2e;
  border: 1px solid #e09618;
}

.btn-accent:hover:not(:disabled) {
  background: #fbc02d;
}

.proposal-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.export-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sidebar-footer {
  text-align: center;
  font-size: 0.7rem;
  color: var(--text-muted);
  padding: 0.5rem 0 0.2rem;
  border-top: 1px solid var(--border);
}

/* Map Area */
.map-view-area {
  flex: 1;
  position: relative;
  background: var(--bg-subtle, #e5e9ec);
  overflow: hidden;
}

.map-canvas {
  width: 100%;
  height: 100%;
}

.map-empty-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 400;
}

.empty-card {
  background: var(--bg-elevated);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-lg);
  padding: 1.5rem 2rem;
  max-width: 420px;
  text-align: center;
  backdrop-filter: blur(8px);
}

.empty-icon {
  width: 42px;
  height: 42px;
  color: var(--brand-600);
  margin-bottom: 0.5rem;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--heading);
  margin-bottom: 0.35rem;
}

.empty-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.diagnostic-banner {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 0.65rem 1rem;
  border-radius: var(--radius-md);
  z-index: 500;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  max-width: 600px;
  box-shadow: var(--shadow-md);
}

.diagnostic-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  line-height: 1.4;
}

.diag-icon {
  flex-shrink: 0;
  color: #d39e00;
}

.map-loader-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  z-index: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-content {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--heading);
}

.loader-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid var(--brand-100);
  border-top-color: var(--brand-600);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.map-watermark-pill {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 400;
  background: var(--bg-elevated);
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.72rem;
  pointer-events: none;
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
}

/* Results Drawer */
.results-drawer {
  position: absolute;
  bottom: 0;
  left: 380px;
  right: 0;
  background: var(--bg-elevated);
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.09);
  z-index: 500;
  display: flex;
  flex-direction: column;
  transition: height 250ms ease;
  height: 46px;
}

.results-drawer.open {
  height: 380px;
}

.drawer-header {
  height: 46px;
  background: var(--bg-muted);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.dh-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dh-icon {
  color: var(--brand-600);
}

.dh-title {
  font-size: 0.88rem;
  font-weight: 750;
  color: var(--heading);
}

.dh-toggle-action {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dh-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.dh-arrow {
  transition: transform 200ms ease;
}

.dh-arrow.rotated {
  transform: rotate(180deg);
}

.drawer-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-tabs {
  display: flex;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  padding: 0 0.5rem;
  flex-shrink: 0;
  overflow-x: auto;
}

.tab-btn {
  padding: 0.55rem 0.95rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 160ms ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--heading);
}

.tab-btn.active {
  color: var(--brand-700);
  border-bottom-color: var(--brand-600);
  background: var(--brand-50);
}

.drawer-content-pane {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
}

.no-result-text {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.88rem;
}

/* Summary Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
}

.kpi-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.kpi-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

.kpi-value {
  display: block;
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--brand-700);
  margin: 4px 0 2px;
}

.kpi-sub {
  display: block;
  font-size: 0.72rem;
  color: var(--text-secondary);
}

/* Results Table */
.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}

.results-table th {
  background: var(--bg-muted);
  color: var(--heading);
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid var(--border);
  font-weight: 750;
  font-size: 0.78rem;
  text-transform: uppercase;
}

.results-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border-light, #eee);
}

.results-table tr:hover td {
  background: var(--brand-50);
}

.total-row td {
  background: var(--brand-50);
  border-top: 2px solid var(--border);
  font-weight: 750;
}

.lu-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 6px;
  vertical-align: middle;
}

.text-right { text-align: right; }
.font-mono { font-family: var(--font-mono, monospace); }

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  height: 100%;
}

.chart-box {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 0.84rem;
  font-weight: 750;
  color: var(--heading);
  margin-bottom: 0.5rem;
  text-align: center;
}

.canvas-wrapper {
  flex: 1;
  min-height: 200px;
  position: relative;
}

/* Report Assessment */
.report-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.rep-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.85rem;
}

.border-red { border-left: 4px solid #e53935; }
.border-green { border-left: 4px solid #2e7d32; }
.border-yellow { border-left: 4px solid #f9a825; }
.border-blue { border-left: 4px solid #1e88e5; }

.rep-label {
  display: block;
  font-size: 0.68rem;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-muted);
}

.rep-value {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--heading);
  margin-top: 2px;
}

.report-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.panel-section {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
}

.panel-title {
  font-size: 0.86rem;
  font-weight: 750;
  color: var(--heading);
  margin-bottom: 0.5rem;
}

.narrative-content p {
  font-size: 0.82rem;
  color: var(--text);
  line-height: 1.55;
  margin-bottom: 0.5rem;
}

.cost-table {
  width: 100%;
  font-size: 0.82rem;
  border-collapse: collapse;
}

.cost-table td {
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--border-light, #eee);
}

.highlight-cost {
  color: var(--brand-700);
  font-weight: 800;
  font-size: 0.95rem;
}

/* Proposals Repository */
.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.proposal-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.prop-icon {
  font-size: 1.5rem;
}

.prop-info {
  flex: 1;
  min-width: 0;
}

.prop-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.prop-name {
  font-size: 0.88rem;
  color: var(--heading);
}

.status-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 10px;
}

.status-green { background: #e8f5e9; color: #2e7d32; }
.status-blue { background: #e3f2fd; color: #1565c0; }
.status-orange { background: #fff3e0; color: #e65100; }
.status-gray { background: #f0f2f5; color: #78909c; }

.prop-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 2px 0 0;
}

.prop-meta-row {
  font-size: 0.72rem;
  color: var(--text-muted);
  display: flex;
  gap: 0.4rem;
  margin-top: 2px;
}

.prop-actions {
  display: flex;
  gap: 0.35rem;
}

@media (max-width: 960px) {
  .plan-workspace {
    flex-direction: column;
  }

  .plan-sidebar {
    width: 100%;
    height: 320px;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .results-drawer {
    left: 0;
  }

  .summary-grid,
  .report-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid,
  .report-details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
