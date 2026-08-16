<template>
  <div class="farm-gis-page">
    <!-- Top Header -->
    <header class="gis-header">
      <div class="header-left">
        <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Farm Area GIS' }]" />
      </div>

      <div class="header-actions">
        <div class="coord-pill" title="Current map center or cursor">
          <Location20 class="coord-icon" />
          <span>{{ currentCoordinates }}</span>
        </div>
        <div class="date-pill">
          <Calendar20 class="date-icon" />
          <span>{{ currentDate }}</span>
        </div>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="gis-workspace">
      <!-- Sidebar Controls -->
      <aside class="gis-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <button 
          type="button" 
          class="sidebar-toggle-btn" 
          :title="sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
          @click="toggleSidebar"
        >
          <ChevronLeft20 class="toggle-icon" :class="{ rotated: sidebarCollapsed }" />
        </button>

        <div v-show="!sidebarCollapsed" class="sidebar-scroll">
          <!-- 1. Search Farm Areas -->
          <section class="panel-section">
            <div class="section-title">
              <span class="icon-label"><Search20 class="section-icon" /> Search Farm Areas</span>
            </div>
            <div class="search-input-group">
              <input
                v-model="searchQuery"
                type="text"
                class="field-control-sm"
                placeholder="Search by farmer name, location or crop..."
                @keyup.enter="searchFarm"
              />
              <button type="button" class="btn btn-primary btn-sm" @click="searchFarm">
                <Search20 class="btn-icon" />
                <span>Search</span>
              </button>
            </div>

            <!-- Search Results List -->
            <div v-if="searchResults.length > 0" class="search-results-list">
              <div
                v-for="(result, index) in searchResults"
                :key="(result.type || 'x') + '_' + index"
                class="result-item-card"
                :class="{ 'result-gpx-card': result.type === 'gpx' }"
                @click="flyToResult(result)"
              >
                <div v-if="result.type === 'gpx'">
                  <div class="result-header">
                    <span class="result-name truncate"><Document20 class="item-inline-icon" /> {{ result.data.name }}</span>
                    <span class="badge badge-success">{{ fmt4(result.data.areaHectares) }} ha</span>
                  </div>
                  <div class="result-meta">
                    <UserProfile20 class="item-inline-icon" /> <strong>{{ result.derivedName || result.data.name }}</strong>
                  </div>
                  <div class="result-coords font-mono">
                    <Location20 class="item-inline-icon" /> {{ result.data.center.lat.toFixed(5) }}, {{ result.data.center.lng.toFixed(5) }}
                  </div>
                  <div class="result-actions-row">
                    <button type="button" class="btn btn-sm btn-secondary" @click.stop="openSearchInfo(result)">
                      <Document20 class="btn-icon" /> Details
                    </button>
                    <button type="button" class="btn btn-sm btn-primary" @click.stop="flyToGPX(result.data)">
                      <Location20 class="btn-icon" /> Locate
                    </button>
                  </div>
                </div>

                <div v-else>
                  <div class="result-header">
                    <span class="result-name truncate"><UserProfile20 class="item-inline-icon" /> {{ result.data.name }}</span>
                    <span class="badge badge-success">{{ fmt4(result.data.area) }} ha</span>
                  </div>
                  <div class="result-meta"><Location20 class="item-inline-icon" /> {{ result.data.location || 'Alcala, Cagayan' }}</div>
                  <div v-if="result.data.commodity" class="result-meta">
                    {{ result.data.commodity }}
                  </div>
                  <div class="result-actions-row">
                    <button type="button" class="btn btn-sm btn-secondary" @click.stop="openSearchInfo(result)">
                      <Document20 class="btn-icon" /> Details
                    </button>
                    <button type="button" class="btn btn-sm btn-primary" @click.stop="flyToResult(result)">
                      <Location20 class="btn-icon" /> Locate
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="searchQuery" class="no-search-results">
              No matching farm areas or GPX tracks found for "{{ searchQuery }}".
            </div>
          </section>

          <!-- 2. Batch GPX Upload Section -->
          <section class="panel-section">
            <div class="section-head">
              <div class="section-title">
                <span class="icon-label"><Upload20 class="section-icon" /> Batch GPX Upload</span>
              </div>
              <button 
                type="button" 
                class="btn-text-toggle" 
                @click="uploadPanelCollapsed = !uploadPanelCollapsed"
              >
                {{ uploadPanelCollapsed ? 'Show ▼' : 'Hide ▲' }}
              </button>
            </div>

            <div v-show="!uploadPanelCollapsed">
              <div 
                class="dropzone"
                :class="{ 'drag-over': isDragOver }"
                @drop.prevent="handleDrop"
                @dragover.prevent="isDragOver = true"
                @dragleave="isDragOver = false"
                @click="triggerFileInput"
              >
                <input
                  id="gpxUploadInput"
                  ref="gpxFileInput"
                  type="file"
                  accept=".gpx"
                  multiple
                  class="hidden-file-input"
                  @change="handleFileUpload"
                />
                <div class="dropzone-content">
                  <Upload20 class="upload-icon" />
                  <div class="upload-title">Drag & drop or click to upload</div>
                  <div class="upload-hint">Upload multiple .gpx track files at once</div>
                </div>
              </div>

              <!-- Upload Progress Bars -->
              <div v-if="uploadProgress.length > 0" class="upload-progress-container">
                <div v-for="(prog, idx) in uploadProgress" :key="idx" class="progress-row">
                  <div class="progress-info">
                    <span class="prog-name truncate">{{ prog.name }}</span>
                    <span class="prog-status" :class="prog.status">
                      <CheckmarkFilled20 v-if="prog.status === 'done'" class="text-success" />
                      <ErrorFilled20 v-else-if="prog.status === 'error'" class="text-danger" />
                      <Time20 v-else />
                    </span>
                  </div>
                  <div class="progress-bar-track">
                    <div class="progress-bar-fill" :style="{ width: prog.percent + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- Uploaded Files List -->
              <div v-if="uploadedFiles.length > 0" class="uploaded-files-block">
                <div class="files-header-row">
                  <span class="sub-section-title"><Document20 class="section-icon" /> Uploaded Files ({{ uploadedFiles.length }})</span>
                  <div class="bulk-btns">
                    <button type="button" class="btn btn-sm btn-secondary" @click="showAllFiles" title="Show all on map">
                      <View20 class="btn-icon" /> All
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary" @click="hideAllFiles" title="Hide all from map">
                      <ViewOff20 class="btn-icon" /> Hide
                    </button>
                    <button type="button" class="btn btn-sm btn-danger" @click="removeAllFiles" title="Clear list">
                      <TrashCan16 />
                    </button>
                  </div>
                </div>

                <div class="gpx-file-cards-list">
                  <div
                    v-for="(file, index) in uploadedFiles"
                    :key="index"
                    class="gpx-file-item"
                    :class="{ hidden: !file.visible }"
                  >
                    <div class="gpx-file-top">
                      <span class="gpx-name truncate" :title="file.name">
                        <span class="gpx-color-dot" :style="{ backgroundColor: file.color }"></span>
                        {{ file.name }}
                      </span>
                      <span class="badge badge-neutral">{{ file.pointCount }} pts</span>
                    </div>

                    <div class="gpx-meta-row font-mono">
                      <span><Location20 class="item-inline-icon" /> {{ file.center.lat.toFixed(4) }}, {{ file.center.lng.toFixed(4) }}</span>
                      <span>{{ file.areaHectares.toFixed(4) }} ha</span>
                    </div>

                    <div class="gpx-actions-row">
                      <span class="method-tag" :class="{ enclosed: file.isEnclosed }">
                        {{ file.isEnclosed ? 'Enclosed Track' : 'Convex Hull' }}
                      </span>
                      <div class="btn-group-right">
                        <button type="button" class="btn btn-sm btn-primary" title="Zoom to track" @click="fitToFile(index)">
                          <Location20 class="btn-icon" />
                        </button>
                        <button 
                          type="button" 
                          class="btn btn-sm btn-secondary" 
                          :title="file.visible ? 'Hide from map' : 'Show on map'" 
                          @click="toggleFileVisibility(index)"
                        >
                          <View20 v-if="file.visible" class="btn-icon" />
                          <ViewOff20 v-else class="btn-icon" />
                        </button>
                        <button type="button" class="btn btn-sm btn-danger" title="Remove from list" @click="removeFile(index)">
                          <TrashCan16 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Register Farmer Section -->
          <section class="panel-section">
            <div class="section-head">
              <div class="section-title">
                <span class="icon-label"><UserProfile20 class="section-icon" /> Register Farmer</span>
              </div>
              <button 
                type="button" 
                class="btn-text-toggle" 
                @click="registerPanelCollapsed = !registerPanelCollapsed"
              >
                {{ registerPanelCollapsed ? 'Show ▼' : 'Hide ▲' }}
              </button>
            </div>

            <div v-show="!registerPanelCollapsed" class="register-form-wrap">
              <!-- Auto-fill from GPX dropdown -->
              <div v-if="uploadedFiles.length > 0" class="autofill-accordion">
                <div class="autofill-accordion-header" @click="autofillExpanded = !autofillExpanded">
                  <span><Document20 class="item-inline-icon" /> Auto-fill from GPX Track ({{ uploadedFiles.length }})</span>
                  <span class="chevron">{{ autofillExpanded ? '▲' : '▼' }}</span>
                </div>
                <div v-show="autofillExpanded" class="autofill-list">
                  <div 
                    v-for="(file, idx) in uploadedFiles" 
                    :key="idx" 
                    class="autofill-item-row"
                  >
                    <div class="autofill-info" @click="autoFillFromGPX(idx)">
                      <span class="autofill-file-name truncate">{{ file.name }}</span>
                      <span class="autofill-derived-name"><UserProfile20 class="item-inline-icon" /> {{ deriveNameFromGPX(file.name) }}</span>
                    </div>
                    <span class="badge badge-success">{{ file.areaHectares.toFixed(4) }} ha</span>
                    <button 
                      type="button" 
                      class="btn btn-sm btn-primary" 
                      title="Quick register this farmer directly from GPX"
                      @click="quickRegisterFromGPX(idx)"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>

              <!-- Form Inputs -->
              <div class="form-row-sm">
                <label class="field-label-sm">Farmer Name *</label>
                <input v-model="newFarmer.name" type="text" placeholder="e.g. JUAN DELA CRUZ" class="field-control-sm" />
              </div>

              <div class="form-row-sm">
                <label class="field-label-sm">Farm Location / Barangay</label>
                <input v-model="newFarmer.location" type="text" placeholder="e.g. TUPANG, ALCALA" class="field-control-sm" />
              </div>

              <div class="form-row-sm">
                <label class="field-label-sm">Commodity</label>
                <select v-model="newFarmer.commodity" class="field-control-sm">
                  <option value="Rice">Rice</option>
                  <option value="Corn">Corn</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Tobacco">Tobacco</option>
                  <option value="Mixed">Mixed Crops</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="form-row-sm">
                <label class="field-label-sm">Area (hectares) *</label>
                <div class="input-with-unit">
                  <input 
                    v-model="newFarmer.area" 
                    type="number" 
                    placeholder="e.g. 1.2500" 
                    step="0.0001" 
                    class="field-control-sm" 
                  />
                  <span class="unit-text">ha</span>
                </div>
                <div v-if="autoPopulatedArea" class="autofill-notice">
                  <CheckmarkFilled20 class="item-inline-icon text-success" /> Auto-filled from track ({{ autoPopulatedArea.toFixed(4) }} ha)
                </div>
              </div>

              <div class="form-row-sm">
                <label class="field-label-sm">Coordinates (optional Lat,Lng)</label>
                <input v-model="newFarmer.coords" type="text" placeholder="e.g. 17.9021,121.6560" class="field-control-sm font-mono" />
              </div>

              <button type="button" class="btn btn-primary btn-block btn-sm" @click="registerFarmer">
                <Add20 class="btn-icon" />
                <span>Register Farmer</span>
              </button>
            </div>
          </section>

          <!-- 4. Registered Farmers List -->
          <section class="panel-section">
            <div class="section-head">
              <div class="section-title">
                <span class="icon-label"><UserProfile20 class="section-icon" /> Farmers ({{ farmers.length }})</span>
              </div>
            </div>

            <!-- Commodity Filter Dropdown -->
            <div class="filter-row-sm">
              <label class="field-label-sm" for="filterCommoditySelect">Filter Commodity:</label>
              <select id="filterCommoditySelect" v-model="commodityFilter" class="field-control-sm">
                <option value="All">All Commodities</option>
                <option value="Rice">Rice</option>
                <option value="Corn">Corn</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Tobacco">Tobacco</option>
                <option value="Mixed">Mixed Crops</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="farmers-list-container">
              <div 
                v-for="(farmer, index) in filteredFarmers" 
                :key="farmer.name + index" 
                class="farmer-card-item"
              >
                <div class="farmer-card-header">
                  <strong class="farmer-title truncate">{{ farmer.name }}</strong>
                  <span class="badge badge-success">{{ fmt4(farmer.area) }} ha</span>
                </div>
                <div class="farmer-card-location">
                  <Location20 class="item-inline-icon" /> {{ farmer.location || 'Alcala, Cagayan' }}
                </div>
                <div class="farmer-badges-row">
                  <span class="commodity-tag" :class="'commodity-' + (farmer.commodity || 'other').toLowerCase()">
                    {{ farmer.commodity || '—' }}
                  </span>
                  <span class="badge badge-neutral">
                    {{ farmer.parcels ? farmer.parcels.length : 1 }} parcel(s)
                  </span>
                </div>
                <div class="farmer-card-actions">
                  <button type="button" class="btn btn-sm btn-primary" title="Fly to farmer" @click="locateFarmer(farmers.indexOf(farmer))">
                    <Location20 class="btn-icon" /> Locate
                  </button>
                  <button type="button" class="btn btn-sm btn-secondary" title="Edit farmer parcels" @click="editFarmer(farmers.indexOf(farmer))">
                    <Edit20 class="btn-icon" /> Edit
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" title="Delete farmer" @click="removeFarmer(farmers.indexOf(farmer))">
                    <TrashCan16 />
                  </button>
                </div>
              </div>

              <div v-if="filteredFarmers.length === 0" class="no-search-results">
                {{ farmers.length === 0 ? 'No farmers registered yet.' : 'No farmers match the selected commodity filter.' }}
              </div>
            </div>
          </section>

          <!-- 5. Data Export Section -->
          <section class="panel-section">
            <div class="section-title">
              <span class="icon-label"><DocumentExport20 class="section-icon" /> Data Export</span>
            </div>
            <div class="export-btn-group">
              <button type="button" class="btn btn-secondary btn-sm btn-block" @click="exportFarmersCSV">
                <DocumentExport20 class="btn-icon" />
                <span>Export Farmers (CSV)</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm btn-block" @click="exportFarmersJSON">
                <DocumentExport20 class="btn-icon" />
                <span>Export Farmers (JSON)</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm btn-block" :disabled="uploadedFiles.length === 0" @click="exportGPX">
                <Earth20 class="btn-icon" />
                <span>Export All GPX Tracks ({{ uploadedFiles.length }})</span>
              </button>
            </div>
          </section>

          <!-- <footer class="sidebar-footer">
            <span>Farm Area GIS · Alcala, Cagayan · ABE MIS</span>
          </footer> -->
        </div>
      </aside>

      <!-- Map Canvas Area -->
      <main class="gis-map-area">
        <div ref="mapContainer" class="map-canvas"></div>

        <!-- Floating Map Tool Controls -->
        <div class="map-floating-controls">
          <button type="button" class="map-tool-btn" title="Reset View to Alcala" @click="resetView">
            <Home20 />
          </button>
          <button 
            type="button" 
            class="map-tool-btn" 
            :class="{ active: drawMode }" 
            :title="drawMode ? 'Drawing mode active - click on map' : 'Draw farm area polygon'" 
            @click="toggleDrawMode"
          >
            <Edit20 />
          </button>
          <button type="button" class="map-tool-btn" :title="'Base layer: ' + currentLayer" @click="toggleLayer">
            <Map20 />
          </button>
          <button type="button" class="map-tool-btn" title="Extra tile layers (Voyager, Positron, Topo)" @click="cycleExtraLayers">
            <Earth20 />
          </button>
          <button type="button" class="map-tool-btn" title="Measure area of drawn points" @click="measureArea">
            <Location20 />
          </button>
          <button type="button" class="map-tool-btn" title="Clear drawn points and lines" @click="clearDrawnMarkers">
            <Reset20 />
          </button>
          <button 
            type="button" 
            class="map-tool-btn" 
            :class="{ active: heatmapVisible }" 
            title="Toggle Density Heatmap" 
            @click="toggleHeatmap"
          >
            <View20 />
          </button>
        </div>

        <!-- Bottom Map Status Bar -->
        <div class="map-status-pill">
          <span>Zoom: {{ currentZoom }}</span>
          <span><Location20 class="item-inline-icon" /> {{ centerLat.toFixed(4) }}, {{ centerLng.toFixed(4) }}</span>
          <span><UserProfile20 class="item-inline-icon" /> {{ farmers.length }} farmers</span>
          <span><Document20 class="item-inline-icon" /> {{ uploadedFiles.length }} GPX</span>
          <span v-if="drawMode" class="draw-indicator">
            <Edit20 class="item-inline-icon" /> Draw mode ON — click map
          </span>
        </div>
      </main>
    </div>

    <!-- Bottom App Status Bar -->
    <!-- <footer class="app-status-bar">
      <span>FarmArea GIS - Alcala · Municipal Agriculture Office</span>
      <span class="status-msg" :class="'msg-' + statusType">{{ statusMessage }}</span>
    </footer> -->

    <!-- Search Info / Attribute Table Modal -->
    <div v-if="searchInfoItem" class="modal-overlay" @click.self="closeSearchInfo">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title"><Document20 class="modal-title-icon" /> Attribute Info</h3>
          <button type="button" class="btn-close-modal" @click="closeSearchInfo">✕</button>
        </div>

        <!-- GPX Attribute Table -->
        <div v-if="searchInfoItem.type === 'gpx'" class="attr-table-wrap">
          <table class="attr-table">
            <tbody>
              <tr><th>File Name</th><td>{{ searchInfoItem.data.name }}</td></tr>
              <tr><th>Derived Farmer</th><td>{{ searchInfoItem.derivedName || searchInfoItem.data.name }}</td></tr>
              <tr><th>Center Lat</th><td class="font-mono">{{ searchInfoItem.data.center.lat.toFixed(6) }}</td></tr>
              <tr><th>Center Lng</th><td class="font-mono">{{ searchInfoItem.data.center.lng.toFixed(6) }}</td></tr>
              <tr><th>Area (ha)</th><td class="font-mono">{{ fmt4(searchInfoItem.data.areaHectares) }} ha</td></tr>
              <tr><th>Area (km²)</th><td class="font-mono">{{ fmt4(searchInfoItem.data.areaKm2) }} km²</td></tr>
              <tr>
                <th>Track Geometry</th>
                <td>
                  <span class="badge" :class="searchInfoItem.data.isEnclosed ? 'badge-success' : 'badge-neutral'">
                    {{ searchInfoItem.data.isEnclosed ? 'Enclosed Track' : 'Convex Hull' }}
                  </span>
                </td>
              </tr>
              <tr><th>Point Count</th><td>{{ searchInfoItem.data.pointCount }} coordinates</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Farmer Attribute Table -->
        <div v-else class="attr-table-wrap">
          <table class="attr-table">
            <tbody>
              <tr><th>Name</th><td><strong>{{ searchInfoItem.data.name }}</strong></td></tr>
              <tr><th>Location</th><td>{{ searchInfoItem.data.location || 'Alcala, Cagayan' }}</td></tr>
              <tr>
                <th>Commodity</th>
                <td>{{ searchInfoItem.data.commodity || '—' }}</td>
              </tr>
              <tr><th>Total Area</th><td class="font-mono">{{ fmt4(searchInfoItem.data.area) }} ha</td></tr>
              <tr><th>Total Parcels</th><td>{{ searchInfoItem.data.parcels ? searchInfoItem.data.parcels.length : 1 }} parcel(s)</td></tr>
              <tr v-if="searchInfoItem.data.parcels && searchInfoItem.data.parcels.length > 0">
                <td colspan="2">
                  <div class="parcel-subtable">
                    <div v-for="(p, i) in searchInfoItem.data.parcels" :key="i" class="parcel-sub-row font-mono">
                      <strong>#{{ i + 1 }}</strong> · {{ fmt4(p.area) }} ha · {{ p.coords || 'no coords' }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary btn-sm" @click="flyToResult(searchInfoItem)">
            <Location20 class="btn-icon" /> Zoom on Map
          </button>
          <button type="button" class="btn btn-secondary btn-sm" @click="closeSearchInfo">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Duplicate GPX Confirmation Modal -->
    <div v-if="pendingDuplicateFile" class="modal-overlay" @click.self="confirmDuplicateUpload(false)">
      <div class="modal-dialog modal-dialog-sm">
        <div class="modal-header">
          <h3 class="modal-title text-warning"><WarningFilled20 class="modal-title-icon" /> Duplicate GPX Detected</h3>
        </div>
        <p class="modal-desc">
          The file <strong>{{ pendingDuplicateFile.name }}</strong> has coordinates that closely match an already uploaded GPX track.
        </p>
        <p class="modal-sub">
          Do you still want to import this duplicate track?
        </p>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary btn-sm" @click="confirmDuplicateUpload(true)">
            Yes, Upload Anyway
          </button>
          <button type="button" class="btn btn-danger btn-sm" @click="confirmDuplicateUpload(false)">
            Skip File
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Farmer Modal -->
    <div v-if="editingFarmer" class="modal-overlay" @click.self="editingFarmer = null">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title"><Edit20 class="modal-title-icon" /> Edit Farmer Profile</h3>
          <button type="button" class="btn-close-modal" @click="editingFarmer = null">✕</button>
        </div>

        <div class="edit-form-body">
          <div class="form-row-sm">
            <label class="field-label-sm">Farmer Name *</label>
            <input v-model="editingFarmer.name" type="text" class="field-control-sm" />
          </div>

          <div class="form-row-sm">
            <label class="field-label-sm">Location</label>
            <input v-model="editingFarmer.location" type="text" class="field-control-sm" />
          </div>

          <div class="form-row-sm">
            <label class="field-label-sm">Commodity</label>
            <select v-model="editingFarmer.commodity" class="field-control-sm">
              <option value="Rice">Rice</option>
              <option value="Corn">Corn</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Tobacco">Tobacco</option>
              <option value="Mixed">Mixed Crops</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Multi-Parcel Management -->
          <div class="parcels-editor-section">
            <div class="section-head">
              <label class="field-label-sm">Parcels ({{ editingFarmer.parcels ? editingFarmer.parcels.length : 0 }})</label>
              <button type="button" class="btn btn-sm btn-secondary" @click="addParcel(editingFarmer)">
                <Add20 class="btn-icon" /> Add Parcel
              </button>
            </div>

            <div class="parcels-editor-list">
              <div v-for="(parcel, pIdx) in editingFarmer.parcels" :key="pIdx" class="parcel-edit-item">
                <div class="parcel-edit-head">
                  <span>Parcel #{{ pIdx + 1 }}</span>
                  <button type="button" class="btn-remove-parcel" title="Remove Parcel" @click="removeParcel(editingFarmer, pIdx)">
                    <TrashCan16 />
                  </button>
                </div>
                <div class="parcel-edit-inputs">
                  <div>
                    <label class="field-label-xs">Area (ha):</label>
                    <input v-model.number="parcel.area" type="number" step="0.0001" class="field-control-sm" placeholder="0.00" />
                  </div>
                  <div>
                    <label class="field-label-xs">Coordinates (Lat,Lng):</label>
                    <input v-model="parcel.coords" type="text" class="field-control-sm font-mono" placeholder="Lat,Lng" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary btn-sm" @click="saveFarmerEdit">
            Save Changes
          </button>
          <button type="button" class="btn btn-secondary btn-sm" @click="editingFarmer = null">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import {
  Map20,
  Location20,
  Calendar20,
  Search20,
  Upload20,
  TrashCan16,
  Add20,
  DocumentExport20,
  Earth20,
  ChevronLeft20,
  Document20,
  UserProfile20,
  View20,
  ViewOff20,
  Edit20,
  Home20,
  Reset20,
  CheckmarkFilled20,
  ErrorFilled20,
  Time20,
  WarningFilled20,
} from '@carbon/icons-vue'
import { useToast } from '@/composables/useToast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const { success, warning, error, info } = useToast()
const { confirm } = useConfirmDialog()

// State
const mapContainer = ref(null)
let map = null

const sidebarCollapsed = ref(false)
const uploadPanelCollapsed = ref(false)
const registerPanelCollapsed = ref(false)
const autofillExpanded = ref(false)

const currentCoordinates = ref('17.9021°N, 121.6560°E')
const currentZoom = ref(13)
const centerLat = ref(17.9021)
const centerLng = ref(121.6560)

const currentDate = ref(new Date().toLocaleDateString('en-PH', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}))

const searchQuery = ref('')
const searchResults = ref([])
const searchInfoItem = ref(null)

const isDragOver = ref(false)
const gpxFileInput = ref(null)
const uploadedFiles = ref([])
const uploadProgress = ref([])
const pendingDuplicateFile = ref(null)

const farmers = ref([])
const newFarmer = ref({ name: '', location: '', area: '', coords: '', commodity: 'Rice' })
const autoPopulatedArea = ref(null)
const commodityFilter = ref('All')

const editingFarmer = ref(null)
const editingIndex = ref(-1)

const drawMode = ref(false)
const heatmapVisible = ref(false)
let heatmapLayer = null

const tempDrawPoints = ref([])
const drawnMarkers = []
const drawnLines = []
const farmerMarkers = []

const baseLayers = {}
const currentLayer = ref('terrain')

const statusMessage = ref('Ready')
const statusType = ref('info')

const ALCALA_CENTER = [17.9021, 121.6560]
const STORAGE_KEY_FARMERS = 'farm_area_gis_farmers'

// Computed
const filteredFarmers = computed(() => {
  return commodityFilter.value === 'All'
    ? farmers.value
    : farmers.value.filter(f => f.commodity === commodityFilter.value)
})

const layerIcon = computed(() => {
  const icons = {
    terrain: '🏔️',
    satellite: '🛰️',
    topo: '⛰️',
    dark: '🌙',
    'cartodb-voyager': '🗺️',
    'cartodb-positron': '☀️',
    'esri-topo': '🗻'
  }
  return icons[currentLayer.value] || '🗺️'
})

const extraLayerIcon = computed(() => {
  return ['cartodb-voyager', 'cartodb-positron', 'esri-topo'].includes(currentLayer.value) ? '🔵' : '⚪'
})

// Map Initialization
function initMap() {
  if (!mapContainer.value || map) return

  map = L.map(mapContainer.value, {
    center: ALCALA_CENTER,
    zoom: 13,
    zoomControl: true,
    attributionControl: true
  })

  const terrain = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  })

  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri',
    maxZoom: 19
  })

  const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenTopoMap contributors',
    maxZoom: 17
  })

  const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB',
    maxZoom: 19
  })

  const cartodbVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB, © OpenStreetMap',
    maxZoom: 19
  })

  const cartodbPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB, © OpenStreetMap',
    maxZoom: 19
  })

  const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri',
    maxZoom: 18
  })

  baseLayers.terrain = terrain
  baseLayers.satellite = satellite
  baseLayers.topo = topo
  baseLayers.dark = dark
  baseLayers.cartodbVoyager = cartodbVoyager
  baseLayers.cartodbPositron = cartodbPositron
  baseLayers.esriTopo = esriTopo

  terrain.addTo(map)

  map.on('zoomend', () => {
    currentZoom.value = map.getZoom()
  })

  map.on('moveend', () => {
    const c = map.getCenter()
    centerLat.value = c.lat
    centerLng.value = c.lng
    currentCoordinates.value = `${c.lat.toFixed(4)}°N, ${c.lng.toFixed(4)}°E`
  })

  map.on('click', (e) => {
    if (drawMode.value) {
      tempDrawPoints.value.push(e.latlng)
      addDrawMarker(e.latlng)
      if (tempDrawPoints.value.length > 1) {
        const prev = tempDrawPoints.value[tempDrawPoints.value.length - 2]
        const line = L.polyline([prev, e.latlng], {
          color: '#FF9800', weight: 2, dashArray: '5,10', opacity: 0.85
        }).addTo(map)
        drawnLines.push(line)
      }
      setStatus(`Point ${tempDrawPoints.value.length} added at ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`, 'info')
    }
  })
}

// Marker Handling
function addFarmerMarker(farmer, lat, lng, parcelIndex = 0) {
  if (!map) return
  const isPrimary = parcelIndex === 0
  const parcelColors = ['#2e7d32', '#1e88e5', '#f9a825', '#8e24aa', '#e53935', '#00acc1']
  const color = parcelColors[parcelIndex % parcelColors.length]
  const icon = L.divIcon({
    className: 'farmer-marker-icon',
    html: `<div style="background:${color}; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; color:white; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3);">${parcelIndex + 1}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  })
  const marker = L.marker([lat, lng], { icon }).addTo(map)
  marker._farmerRef = farmer
  marker._parcelIndex = parcelIndex

  let parcelsHtml = ''
  if (farmer.parcels && farmer.parcels.length > 0) {
    parcelsHtml = '<div style="margin-top:8px; border-top:1px solid #eee; padding-top:6px; font-size:12px;"><strong>Parcels:</strong><div style="margin-top:4px;">'
    farmer.parcels.forEach((p, i) => {
      const pColor = parcelColors[i % parcelColors.length]
      const active = i === parcelIndex ? 'font-weight:bold;' : ''
      parcelsHtml += `<div style="margin:2px 0; font-size:11.5px; ${active}">`
      parcelsHtml += `<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${pColor};color:white;font-size:10px;text-align:center;line-height:16px;margin-right:4px;">${i + 1}</span> `
      parcelsHtml += `${(p.area != null ? Number(p.area).toFixed(4) : '—')} ha — ${p.coords || 'no coords'}`
      if (i === parcelIndex) parcelsHtml += ' ◀'
      parcelsHtml += '</div>'
    })
    parcelsHtml += '</div></div>'
  }

  const totalArea = farmer.parcels ? farmer.parcels.reduce((s, p) => s + (p.area || 0), 0) : farmer.area || 0
  marker.bindPopup(`
    <div style="min-width:240px; font-family: inherit; font-size: 13px;">
      <h3 style="margin:0 0 6px; color:#2e7d32; font-size:15px;">${escapeHtml(farmer.name)}</h3>
      <p style="margin:2px 0;font-size:12px;color:#444;"><strong>Location:</strong> ${escapeHtml(farmer.location || 'Alcala')} · ${escapeHtml(farmer.commodity || '—')}</p>
      <p style="margin:2px 0;font-size:12px;color:#222;"><strong>Total Area:</strong> ${totalArea.toFixed(4)} ha (${farmer.parcels ? farmer.parcels.length : 1} parcel(s))</p>
      ${parcelsHtml}
      <div style="margin-top:6px; padding-top:6px; border-top:1px solid #eee;">
        <small style="color:#777;">Parcel #${parcelIndex + 1} — ${lat.toFixed(5)}, ${lng.toFixed(5)}</small>
      </div>
    </div>
  `)
  farmerMarkers.push({ marker, farmer })
}

function removeFarmerMarker(farmer) {
  for (let i = farmerMarkers.length - 1; i >= 0; i--) {
    if (farmerMarkers[i].farmer === farmer) {
      if (map) map.removeLayer(farmerMarkers[i].marker)
      farmerMarkers.splice(i, 1)
    }
  }
}

// Sample Data & Storage
function loadSampleData() {
  const saved = localStorage.getItem(STORAGE_KEY_FARMERS)
  if (saved) {
    try {
      farmers.value = JSON.parse(saved)
    } catch (e) {
      farmers.value = []
    }
  }

  if (!farmers.value || farmers.value.length === 0) {
    farmers.value = [
      { name: 'JUAN DELA CRUZ', location: 'ALCALA, CAGAYAN', commodity: 'Rice', parcels: [{ area: 12.5, coords: '17.9021,121.6560' }, { area: 5.3, coords: '17.9050,121.6600' }] },
      { name: 'MARIA SANTOS', location: 'ALCALA, CAGAYAN', commodity: 'Corn', parcels: [{ area: 8.3, coords: '17.9100,121.6450' }] },
      { name: 'PEDRO REYES', location: 'GATTARAN, CAGAYAN', commodity: 'Rice', parcels: [{ area: 15.7, coords: '18.0265,121.6484' }, { area: 3.2, coords: '18.0300,121.6500' }] },
      { name: 'ANA GARCIA', location: 'LAL-LO, CAGAYAN', commodity: 'Vegetables', parcels: [{ area: 6.4, coords: '18.2167,121.6500' }] },
      { name: 'ROBERTO LIM', location: 'BUGUEY, CAGAYAN', commodity: 'Corn', parcels: [{ area: 9.8, coords: '18.2833,121.8167' }, { area: 2.1, coords: '18.2900,121.8100' }, { area: 4.5, coords: '18.2750,121.8200' }] },
      { name: 'LUISA MENDOZA', location: 'CAMALANIUGAN, CAGAYAN', commodity: 'Fruits', parcels: [{ area: 4.2, coords: '18.2500,121.6833' }] },
      { name: 'RICARDO AQUINO', location: 'APARRI, CAGAYAN', commodity: 'Rice', parcels: [{ area: 11.3, coords: '18.3500,121.6167' }, { area: 6.8, coords: '18.3550,121.6200' }] },
      { name: 'ELENA TORRES', location: 'ENRILE, CAGAYAN', commodity: 'Tobacco', parcels: [{ area: 7.6, coords: '17.5667,121.6500' }] },
    ]
  }

  farmers.value.forEach(f => {
    if (!f.parcels) {
      f.parcels = []
      if (f.coords && f.area) f.parcels.push({ area: f.area, coords: f.coords })
    }
    f.area = f.parcels.reduce((sum, p) => sum + (p.area || 0), 0)
    f.parcels.forEach((p, idx) => {
      if (p.coords) {
        const [lat, lng] = p.coords.split(',').map(Number)
        if (!isNaN(lat) && !isNaN(lng)) {
          addFarmerMarker(f, lat, lng, idx)
        }
      }
    })
  })
}

function persistFarmers() {
  try {
    localStorage.setItem(STORAGE_KEY_FARMERS, JSON.stringify(farmers.value))
  } catch (e) {}
}

// Search
function searchFarm() {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) {
    searchResults.value = []
    searchInfoItem.value = null
    return
  }

  const farmerMatches = farmers.value
    .filter(f => (f.name || '').toLowerCase().includes(q) ||
                 (f.location || '').toLowerCase().includes(q) ||
                 (f.commodity || '').toLowerCase().includes(q))
    .map(f => ({ type: 'farmer', data: f, label: f.name }))

  const gpxMatches = uploadedFiles.value
    .filter(g => {
      const derived = deriveNameFromGPX(g.name)
      return (g.name || '').toLowerCase().includes(q) || derived.toLowerCase().includes(q)
    })
    .map(g => ({
      type: 'gpx',
      data: g,
      label: deriveNameFromGPX(g.name) || g.name,
      derivedName: deriveNameFromGPX(g.name)
    }))

  searchResults.value = [...farmerMatches, ...gpxMatches]
  setStatus(
    `Found ${searchResults.value.length} match(es) — ${farmerMatches.length} farmer(s), ${gpxMatches.length} GPX file(s)`,
    searchResults.value.length > 0 ? 'success' : 'warning'
  )

  if (searchResults.value.length > 0) {
    openSearchInfo(searchResults.value[0])
  }
}

function openSearchInfo(item) {
  searchInfoItem.value = item
}

function closeSearchInfo() {
  searchInfoItem.value = null
}

function flyToResult(result) {
  if (!result || !map) return
  if (result.type === 'gpx' && result.data) {
    flyToGPX(result.data)
    return
  }
  const farmer = result.data || result
  const firstParcel = farmer.parcels && farmer.parcels.length > 0 ? farmer.parcels[0] : null
  const coords = firstParcel && firstParcel.coords ? firstParcel.coords : farmer.coords
  if (coords) {
    const [lat, lng] = coords.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 16, { duration: 1.2 })
      setStatus(`Navigating to ${farmer.name}'s farm parcel`, 'success')
    }
  }
}

function flyToGPX(gpxFile) {
  if (!gpxFile || !gpxFile.center || !map) return
  map.flyTo([gpxFile.center.lat, gpxFile.center.lng], 16, { duration: 1.2 })
  setStatus(`🎯 Zoomed to GPX track ${gpxFile.name}`, 'success')
}

// GPX Upload & Duplicate Detection
function triggerFileInput() {
  gpxFileInput.value?.click()
}

function handleFileUpload(e) {
  const files = Array.from(e.target.files || []).filter(f => f.name.toLowerCase().endsWith('.gpx'))
  if (files.length === 0) {
    warning('Please select valid .gpx files.')
    return
  }
  processBatchFiles(files)
  e.target.value = ''
}

function handleDrop(e) {
  isDragOver.value = false
  const files = Array.from(e.dataTransfer?.files || []).filter(f => f.name.toLowerCase().endsWith('.gpx'))
  if (files.length === 0) {
    warning('Please drop valid .gpx files.')
    return
  }
  processBatchFiles(files)
}

function checkDuplicateGPX(newPoints) {
  const newCenterLat = newPoints.reduce((s, p) => s + p[0], 0) / newPoints.length
  const newCenterLng = newPoints.reduce((s, p) => s + p[1], 0) / newPoints.length
  const newFirst = newPoints[0]
  const newLast = newPoints[newPoints.length - 1]

  for (const existing of uploadedFiles.value) {
    const ec = existing.center
    const centerDist = haversineDistance(newCenterLat, newCenterLng, ec.lat, ec.lng)
    if (centerDist > 0.1) continue

    if (existing.points && existing.points.length > 1 && newPoints.length > 1) {
      const ef = existing.points[0]
      const el = existing.points[existing.points.length - 1]
      const fDist = haversineDistance(newPoints[0][0], newPoints[0][1], ef[0], ef[1])
      const lDist = haversineDistance(newLast[0], newLast[1], el[0], el[1])
      if (fDist < 0.05 || lDist < 0.05) {
        return existing
      }
    }
  }
  return null
}

function confirmDuplicateUpload(proceed) {
  if (proceed && pendingDuplicateFile.value) {
    const p = pendingDuplicateFile.value
    const parsed = parseGPX(p.name, p.content)
    if (parsed) {
      const progIdx = uploadProgress.value.findIndex(x => x.name === p.name)
      if (progIdx !== -1) {
        uploadProgress.value[progIdx].percent = 100
        uploadProgress.value[progIdx].status = 'done'
      }
      autoRegisterFromGPX(p.name)
      success(`Imported duplicate track: ${p.name}`)
    }
  } else if (pendingDuplicateFile.value) {
    const p = pendingDuplicateFile.value
    const progIdx = uploadProgress.value.findIndex(x => x.name === p.name)
    if (progIdx !== -1) uploadProgress.value.splice(progIdx, 1)
    info(`Skipped duplicate ${p.name}`)
  }
  pendingDuplicateFile.value = null
}

async function processBatchFiles(files) {
  setStatus(`Processing ${files.length} GPX file(s)...`, 'info')
  uploadProgress.value = files.map(f => ({
    name: f.name,
    status: 'pending',
    percent: 0
  }))

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const prog = uploadProgress.value[i]
    try {
      prog.status = 'processing'
      prog.percent = 30
      const content = await readFileAsync(file)
      prog.percent = 50

      const parser = new DOMParser()
      const xml = parser.parseFromString(content, 'text/xml')
      const trkpts = xml.querySelectorAll('trkpt')
      const rtepts = xml.querySelectorAll('rtept')
      const waypoints = xml.querySelectorAll('wpt')
      const tempPoints = []
      const nodes = trkpts.length > 0 ? trkpts : (rtepts.length > 0 ? rtepts : waypoints)
      nodes.forEach(pt => {
        const lat = parseFloat(pt.getAttribute('lat'))
        const lng = parseFloat(pt.getAttribute('lon'))
        if (!isNaN(lat) && !isNaN(lng)) tempPoints.push([lat, lng])
      })

      if (tempPoints.length > 0) {
        const duplicate = checkDuplicateGPX(tempPoints)
        if (duplicate) {
          prog.status = 'pending'
          prog.percent = 0
          pendingDuplicateFile.value = { name: file.name, content: content }
          warning(`Duplicate detected: "${file.name}" matches "${duplicate.name}"`)
          continue
        }
      }

      prog.percent = 70
      const result = parseGPX(file.name, content)
      if (result) {
        prog.percent = 90
        autoFillFromGPX(uploadedFiles.value.length - 1)
        autoRegisterFromGPX(file.name)
        prog.percent = 100
        prog.status = 'done'
      } else {
        prog.status = 'error'
        prog.percent = 100
      }
    } catch (err) {
      prog.status = 'error'
      prog.percent = 100
      console.error('GPX parse error:', err)
    }
    await new Promise(r => setTimeout(r, 150))
  }

  const successCount = uploadProgress.value.filter(p => p.status === 'done').length
  success(`Batch upload completed: ${successCount}/${files.length} processed`)
  setTimeout(() => {
    if (!pendingDuplicateFile.value) uploadProgress.value = []
  }, 3500)
}

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function parseGPX(fileName, gpxContent) {
  try {
    const parser = new DOMParser()
    const xml = parser.parseFromString(gpxContent, 'text/xml')

    const trkpts = xml.querySelectorAll('trkpt')
    const rtepts = xml.querySelectorAll('rtept')
    const waypoints = xml.querySelectorAll('wpt')

    const points = []
    const collect = (nodes) => {
      nodes.forEach(pt => {
        const lat = parseFloat(pt.getAttribute('lat'))
        const lng = parseFloat(pt.getAttribute('lon'))
        if (!isNaN(lat) && !isNaN(lng)) points.push([lat, lng])
      })
    }

    if (trkpts.length > 0) collect(trkpts)
    else if (rtepts.length > 0) collect(rtepts)
    else collect(waypoints)

    if (points.length === 0) return null

    const centerLatVal = points.reduce((s, p) => s + p[0], 0) / points.length
    const centerLngVal = points.reduce((s, p) => s + p[1], 0) / points.length

    const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B']
    const color = colors[uploadedFiles.value.length % colors.length]

    const gpxLayer = L.polyline(points, {
      color: color,
      weight: 3,
      opacity: 0.85
    }).addTo(map)

    let startMarker = null
    let endMarker = null
    if (points.length > 1) {
      const startIcon = L.divIcon({
        className: 'track-marker',
        html: `<div style="background:#4CAF50;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [12, 12], iconAnchor: [6, 6]
      })
      const endIcon = L.divIcon({
        className: 'track-marker',
        html: `<div style="background:#F44336;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [12, 12], iconAnchor: [6, 6]
      })
      startMarker = L.marker(points[0], { icon: startIcon }).addTo(map)
      endMarker = L.marker(points[points.length - 1], { icon: endIcon }).addTo(map)
    }

    let areaKm2 = 0
    let areaMethod = 'convex-hull'
    const isEnclosed = isTrackEnclosed(points, 0.05)
    if (isEnclosed) {
      areaKm2 = calculatePolygonArea(points)
      areaMethod = 'polygon'
    } else {
      const hull = convexHull(points)
      areaKm2 = calculatePolygonArea(hull)
      areaMethod = 'convex-hull'
    }
    const areaHectares = areaKm2 * 100

    uploadedFiles.value.push({
      name: fileName,
      layer: gpxLayer,
      startMarker,
      endMarker,
      center: { lat: centerLatVal, lng: centerLngVal },
      pointCount: points.length,
      visible: true,
      points,
      color,
      areaKm2,
      areaHectares,
      areaMethod,
      isEnclosed
    })

    map.fitBounds(gpxLayer.getBounds(), { padding: [50, 50] })
    return true
  } catch (err) {
    console.error('parseGPX error:', err)
    return null
  }
}

// Geometric Math
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function calculatePolygonArea(latlngs) {
  const n = latlngs.length
  if (n < 3) return 0
  const getLat = p => typeof p === 'object' && p.lat !== undefined ? p.lat : p[0]
  const getLng = p => typeof p === 'object' && p.lng !== undefined ? p.lng : p[1]
  let sumLat = 0
  for (const p of latlngs) sumLat += getLat(p)
  const avgLat = sumLat / n

  let areaDeg2 = 0
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    areaDeg2 += getLng(latlngs[i]) * getLat(latlngs[j])
    areaDeg2 -= getLng(latlngs[j]) * getLat(latlngs[i])
  }
  const kmPerDeg = 111.32
  return Math.abs(areaDeg2) / 2 * kmPerDeg * kmPerDeg * Math.cos(avgLat * Math.PI / 180)
}

function isTrackEnclosed(points, thresholdKm) {
  if (points.length < 3) return false
  const first = points[0]
  const last = points[points.length - 1]
  return haversineDistance(first[0], first[1], last[0], last[1]) <= thresholdKm
}

function convexHull(points) {
  if (points.length <= 3) return [...points]
  const sorted = [...points].sort((a, b) => a[1] - b[1] || a[0] - b[0])
  const cross = (o, a, b) => (a[1] - o[1]) * (b[0] - o[0]) - (a[0] - o[0]) * (b[1] - o[1])

  const lower = []
  for (const pt of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) {
      lower.pop()
    }
    lower.push(pt)
  }

  const upper = []
  for (const pt of sorted.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) {
      upper.pop()
    }
    upper.push(pt)
  }

  return lower.slice(0, -1).concat(upper.slice(0, -1))
}

// File List Controls
function toggleFileVisibility(index) {
  const file = uploadedFiles.value[index]
  file.visible = !file.visible
  if (!map) return
  if (file.visible) {
    file.layer.addTo(map)
    if (file.startMarker) file.startMarker.addTo(map)
    if (file.endMarker) file.endMarker.addTo(map)
  } else {
    map.removeLayer(file.layer)
    if (file.startMarker) map.removeLayer(file.startMarker)
    if (file.endMarker) map.removeLayer(file.endMarker)
  }
}

function fitToFile(index) {
  const file = uploadedFiles.value[index]
  if (file.layer && map) {
    map.fitBounds(file.layer.getBounds(), { padding: [60, 60] })
  }
}

function removeFile(index) {
  const file = uploadedFiles.value[index]
  uploadedFiles.value.splice(index, 1)
  info(`Removed ${file.name} from list (track remains on map)`)
}

function showAllFiles() {
  if (!map) return
  uploadedFiles.value.forEach(f => {
    f.visible = true
    f.layer.addTo(map)
    if (f.startMarker) f.startMarker.addTo(map)
    if (f.endMarker) f.endMarker.addTo(map)
  })
  success('All GPX tracks visible')
}

function hideAllFiles() {
  if (!map) return
  uploadedFiles.value.forEach(f => {
    f.visible = false
    map.removeLayer(f.layer)
    if (f.startMarker) map.removeLayer(f.startMarker)
    if (f.endMarker) map.removeLayer(f.endMarker)
  })
  info('All GPX tracks hidden')
}

function removeAllFiles() {
  uploadedFiles.value = []
  info('Cleared GPX list')
}

// Farmer Registration & Autofill
function deriveNameFromGPX(fileName) {
  let name = (fileName || '').replace(/\.gpx$/i, '')
  name = name.replace(/[_\-.]+/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase()

  const stopWords = new Set([
    'FARM','FARMS','FARMLAND','AREA','LOT','PARCEL','RICE','CORN','PALAY','MAIS',
    'TRACK','TRK','GPX','GPS','FIELD','LAND','PROPERTY','SURVEY','BOUNDARY','PLOT',
    'TRACING','SKETCH','MAP','AGRI','AGRICULTURAL','CULTIVATED',
    'TOBACCO','VEGETABLE','VEGETABLES','FRUIT','FRUITS','MIXED','ONION','ONIONS',
    'GARLIC','PEPPER','EGGPLANT','TOMATO','BANANA','BANANAS','MANGO','MANGOES','CASSAVA',
    'ALCALA','CAGAYAN','GATTARAN','LALLO','LAL-LO','BUGUEY','CAMALANIUGAN','APARRI',
    'ENRILE','TUGUEGARAO','SOLANA','AMULUNG','BAGGAO','PEÑABLANCA','PHILIPPINES',
    'BARANGAY','BRGY','PUROK','SITIO','MUNICIPALITY','PROVINCE','VILLAGE',
    'SAMPLE','TEST','DEMO','NEW','DRAFT','FINAL','COPY','BACKUP','MY','DOC','FILE','DATA'
  ])

  const words = name.split(' ')
    .map(w => w.replace(/\d+/g, ''))
    .filter(w => !stopWords.has(w) && w.length > 0)

  const cleaned = words.join(' ')
  if (cleaned) return cleaned

  const noDigits = name.replace(/\d+/g, '').replace(/\s+/g, ' ').trim()
  return noDigits || 'UNKNOWN FARMER'
}

function autoFillFromGPX(fileIndex) {
  const file = uploadedFiles.value[fileIndex]
  if (!file) return

  const derived = deriveNameFromGPX(file.name)
  newFarmer.value.name = derived
  newFarmer.value.area = file.areaHectares.toFixed(4)
  autoPopulatedArea.value = file.areaHectares
  newFarmer.value.coords = `${file.center.lat.toFixed(6)},${file.center.lng.toFixed(6)}`

  setStatus(`Auto-filled "${derived}" (${file.areaHectares.toFixed(4)} ha) from ${file.name}`, 'success')
}

function quickRegisterFromGPX(fileIndex) {
  autoFillFromGPX(fileIndex)
  nextTick(() => {
    registerFarmer()
  })
}

function autoRegisterFromGPX(fileName) {
  const file = uploadedFiles.value.find(f => f.name === fileName)
  if (!file) return null
  const derived = deriveNameFromGPX(file.name)
  const coords = `${file.center.lat.toFixed(6)},${file.center.lng.toFixed(6)}`
  const farmer = {
    name: derived,
    location: 'GPS UPLOAD',
    commodity: 'Rice',
    parcels: [{ area: file.areaHectares, coords }],
    area: file.areaHectares
  }
  farmers.value.push(farmer)
  persistFarmers()
  addFarmerMarker(farmer, file.center.lat, file.center.lng, 0)
  return farmer
}

function registerFarmer() {
  if (!newFarmer.value.name || !newFarmer.value.area) {
    warning('Please provide at least a Farmer Name and Farm Area.')
    return
  }
  const area = parseFloat(newFarmer.value.area)
  const coords = (newFarmer.value.coords || '').trim()
  const farmer = {
    name: newFarmer.value.name.trim().toUpperCase(),
    location: (newFarmer.value.location || 'ALCALA, CAGAYAN').trim().toUpperCase(),
    commodity: newFarmer.value.commodity || 'Rice',
    parcels: []
  }
  if (area > 0) {
    farmer.parcels.push({ area, coords })
  }
  farmer.area = farmer.parcels.reduce((sum, p) => sum + (p.area || 0), 0)
  farmers.value.push(farmer)
  persistFarmers()

  if (coords) {
    const [lat, lng] = coords.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      addFarmerMarker(farmer, lat, lng, 0)
    }
  }

  newFarmer.value = { name: '', location: '', area: '', coords: '', commodity: 'Rice' }
  autoPopulatedArea.value = null
  success(`Farmer "${farmer.name}" registered successfully!`)
}

async function removeFarmer(index) {
  const farmer = farmers.value[index]
  const confirmed = await confirm('Delete Farmer', `Are you sure you want to delete "${farmer.name}"?`, 'Delete')
  if (!confirmed) return

  farmers.value.splice(index, 1)
  persistFarmers()
  removeFarmerMarker(farmer)
  info(`Removed farmer "${farmer.name}"`)
}

function locateFarmer(index) {
  const farmer = farmers.value[index]
  const firstParcel = farmer.parcels && farmer.parcels.length > 0 ? farmer.parcels[0] : null
  const coords = firstParcel && firstParcel.coords ? firstParcel.coords : farmer.coords
  if (coords && map) {
    const [lat, lng] = coords.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 16, { duration: 1.2 })
      setStatus(`Locating ${farmer.name}`, 'info')
      return
    }
  }
  warning(`No valid coordinates found for ${farmer.name}`)
}

function editFarmer(index) {
  const clone = { ...farmers.value[index] }
  clone.parcels = (farmers.value[index].parcels || []).map(p => ({ ...p }))
  editingFarmer.value = clone
  editingIndex.value = index
}

function addParcel(farmer) {
  if (!farmer.parcels) farmer.parcels = []
  farmer.parcels.push({ area: 0, coords: '' })
}

function removeParcel(farmer, pIdx) {
  if (!farmer.parcels || farmer.parcels.length <= 1) {
    warning('A farmer must have at least one parcel.')
    return
  }
  farmer.parcels.splice(pIdx, 1)
}

function saveFarmerEdit() {
  if (editingIndex.value >= 0) {
    const oldFarmer = farmers.value[editingIndex.value]
    removeFarmerMarker(oldFarmer)

    const updated = {
      ...editingFarmer.value,
      name: (editingFarmer.value.name || '').trim().toUpperCase(),
      location: (editingFarmer.value.location || '').trim().toUpperCase()
    }
    if (updated.parcels && updated.parcels.length > 0) {
      updated.area = updated.parcels.reduce((sum, p) => sum + (p.area || 0), 0)
    }
    farmers.value[editingIndex.value] = updated
    persistFarmers()

    if (updated.parcels) {
      updated.parcels.forEach((p, idx) => {
        if (p.coords) {
          const [lat, lng] = p.coords.split(',').map(Number)
          if (!isNaN(lat) && !isNaN(lng)) {
            addFarmerMarker(updated, lat, lng, idx)
          }
        }
      })
    }
    success(`Updated farmer "${updated.name}"`)
  }
  editingFarmer.value = null
  editingIndex.value = -1
}

// Drawing & Measurements
function toggleDrawMode() {
  drawMode.value = !drawMode.value
  if (mapContainer.value) {
    mapContainer.value.style.cursor = drawMode.value ? 'crosshair' : ''
  }
  if (drawMode.value) {
    tempDrawPoints.value = []
    setStatus('✏️ Draw mode ON — click on the map to add polygon boundary points', 'info')
  } else {
    setStatus('Draw mode OFF', 'info')
  }
}

function addDrawMarker(latlng) {
  if (!map) return
  const icon = L.divIcon({
    className: 'draw-marker-icon',
    html: `<div style="background:#FF9800;width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [10, 10], iconAnchor: [5, 5]
  })
  const marker = L.marker(latlng, { icon }).addTo(map)
  drawnMarkers.push(marker)
}

function clearDrawnMarkers() {
  if (!map) return
  drawnMarkers.forEach(m => map.removeLayer(m))
  drawnLines.forEach(l => map.removeLayer(l))
  drawnMarkers.length = 0
  drawnLines.length = 0
  tempDrawPoints.value = []
  setStatus('🧹 Drawings and measurements cleared', 'info')
}

function measureArea() {
  if (tempDrawPoints.value.length < 3) {
    warning('Need at least 3 points on the map to measure a polygon area.')
    return
  }
  const polygon = L.polygon(tempDrawPoints.value, {
    color: '#2196F3', fillColor: '#2196F3', fillOpacity: 0.25, weight: 2
  }).addTo(map)
  drawnLines.push(polygon)

  const areaKm2 = calculatePolygonArea(tempDrawPoints.value)
  const areaHa = areaKm2 * 100

  const center = polygon.getBounds().getCenter()
  const labelMarker = L.marker(center, {
    icon: L.divIcon({
      className: 'area-label',
      html: `<div style="background:rgba(33,150,243,0.92);color:white;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);">${areaHa.toFixed(4)} ha</div>`,
      iconSize: [140, 24], iconAnchor: [70, 12]
    })
  }).addTo(map)
  drawnMarkers.push(labelMarker)

  success(`Measured area: ${areaHa.toFixed(4)} ha (${areaKm2.toFixed(4)} km²)`)
}

// Heatmap
function toggleHeatmap() {
  heatmapVisible.value = !heatmapVisible.value
  if (!map) return
  if (heatmapVisible.value) {
    createHeatmap()
    info('🔥 Density heatmap enabled')
  } else {
    if (heatmapLayer) {
      map.removeLayer(heatmapLayer)
      heatmapLayer = null
    }
    info('Heatmap hidden')
  }
}

function createHeatmap() {
  if (!map) return
  const heatPoints = []
  uploadedFiles.value.forEach(file => {
    file.points.forEach(pt => heatPoints.push(pt))
  })
  farmers.value.forEach(f => {
    if (f.parcels) {
      f.parcels.forEach(p => {
        if (p.coords) {
          const [lat, lng] = p.coords.split(',').map(Number)
          if (!isNaN(lat) && !isNaN(lng)) heatPoints.push([lat, lng])
        }
      })
    }
  })

  if (heatmapLayer) map.removeLayer(heatmapLayer)
  heatmapLayer = L.layerGroup()
  heatPoints.forEach(pt => {
    L.circle(pt, {
      radius: 220,
      color: '#FF5722',
      fillColor: '#FF5722',
      fillOpacity: 0.18,
      weight: 0
    }).addTo(heatmapLayer)
  })
  heatmapLayer.addTo(map)
}

// Map Layer & View Switchers
function resetView() {
  if (map) {
    map.flyTo(ALCALA_CENTER, 13, { duration: 1.2 })
    setStatus('View reset to Alcala, Cagayan', 'info')
  }
}

function toggleLayer() {
  const layers = ['terrain', 'satellite', 'topo', 'dark']
  const idx = layers.indexOf(currentLayer.value)
  const next = layers[(idx + 1) % layers.length]
  currentLayer.value = next
  switchToLayer(next)
}

function cycleExtraLayers() {
  const layers = ['cartodb-voyager', 'cartodb-positron', 'esri-topo']
  const idx = layers.indexOf(currentLayer.value)
  const next = idx === -1 ? 'cartodb-voyager' : layers[(idx + 1) % layers.length]
  currentLayer.value = next
  switchToLayer(next)
}

function switchToLayer(layerName) {
  if (!map) return
  Object.values(baseLayers).forEach(l => {
    if (map.hasLayer(l)) map.removeLayer(l)
  })
  const mapKey = {
    terrain: 'terrain',
    satellite: 'satellite',
    topo: 'topo',
    dark: 'dark',
    'cartodb-voyager': 'cartodbVoyager',
    'cartodb-positron': 'cartodbPositron',
    'esri-topo': 'esriTopo'
  }
  const selected = baseLayers[mapKey[layerName]]
  if (selected) {
    selected.addTo(map)
    setStatus(`Switched to ${layerName} layer`, 'info')
  }
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
  nextTick(() => {
    if (map) map.invalidateSize()
  })
}

// Data Exports
function exportFarmersCSV() {
  if (farmers.value.length === 0) {
    warning('No farmers to export.')
    return
  }
  const esc = (val) => {
    const s = val === null || val === undefined ? '' : String(val)
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }
  const header = ['Farmer Name', 'Farm Location', 'Commodity', 'Parcel #', 'Area (ha)', 'Coordinates']
  const rows = []
  farmers.value.forEach(f => {
    const parcels = f.parcels && f.parcels.length > 0 ? f.parcels : [{ area: f.area || '', coords: f.coords || '' }]
    parcels.forEach((p, idx) => {
      rows.push([
        f.name || '',
        f.location || '',
        f.commodity || '',
        idx + 1,
        (p.area != null ? Number(p.area).toFixed(4) : ''),
        p.coords || ''
      ].map(esc))
    })
  })
  const csv = [header.map(esc).join(','), ...rows.map(r => r.join(','))].join('\r\n')
  downloadFile('\uFEFF' + csv, `farmers_alcala_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;')
  success(`Exported ${farmers.value.length} farmer(s) to CSV`)
}

function exportFarmersJSON() {
  const json = JSON.stringify(farmers.value, null, 2)
  downloadFile(json, `farmers_alcala_${new Date().toISOString().slice(0, 10)}.json`, 'application/json')
  success('Exported farmers to JSON')
}

function exportGPX() {
  if (uploadedFiles.value.length === 0) {
    warning('No GPX tracks available to export.')
    return
  }
  uploadedFiles.value.forEach(file => {
    let gpx = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="FarmArea GIS Alcala">\n  <trk>\n    <name>${file.name}</name>\n    <trkseg>`
    file.points.forEach(pt => {
      gpx += `\n      <trkpt lat="${pt[0]}" lon="${pt[1]}"></trkpt>`
    })
    gpx += `\n    </trkseg>\n  </trk>\n</gpx>`
    downloadFile(gpx, `export_${file.name}`, 'application/gpx+xml')
  })
  success(`Exported ${uploadedFiles.value.length} GPX files`)
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Helpers
function commodityIcon(commodity) {
  switch (commodity) {
    case 'Rice': return '🌾'
    case 'Corn': return '🌽'
    case 'Vegetables': return '🥬'
    case 'Fruits': return '🍌'
    case 'Tobacco': return '🍂'
    case 'Mixed': return '🌾🌽'
    default: return '📦'
  }
}

function fmt4(n) {
  if (n === null || n === undefined || n === '') return '—'
  const num = Number(n)
  return isFinite(num) ? num.toFixed(4) : '—'
}

function setStatus(msg, type = 'info') {
  statusMessage.value = msg
  statusType.value = type
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

onMounted(() => {
  initMap()
  loadSampleData()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.farm-gis-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}

/* Header */
.gis-header {
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
  gap: 0.65rem;
}

.coord-pill,
.date-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-family: var(--font-mono, monospace);
  background: var(--bg-muted);
  border: 1px solid var(--border);
  padding: 0.35rem 0.65rem;
  border-radius: 20px;
  color: var(--text-secondary);
}

.coord-icon,
.date-icon {
  color: var(--brand-600);
}

/* Workspace */
.gis-workspace {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* Sidebar */
.gis-sidebar {
  width: 380px;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 5;
  transition: width 200ms ease;
  position: relative;
}

.gis-sidebar.collapsed {
  width: 36px;
  min-width: 36px;
}

.sidebar-toggle-btn {
  position: absolute;
  top: 10px;
  right: -14px;
  z-index: 20;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 160ms ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.panel-section {
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

.item-inline-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}

.btn-text-toggle {
  background: transparent;
  border: none;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--brand-600);
  cursor: pointer;
  padding: 0;
}

/* Search */
.search-input-group {
  display: flex;
  gap: 0.4rem;
}

.search-results-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.65rem;
  max-height: 260px;
  overflow-y: auto;
}

.result-item-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.75rem;
  cursor: pointer;
  transition: all 160ms ease;
}

.result-item-card:hover {
  border-color: var(--brand-600);
  background: var(--brand-50);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.result-name {
  font-size: 0.84rem;
  font-weight: 750;
  color: var(--heading);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.result-meta {
  font-size: 0.74rem;
  color: var(--text-secondary);
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.result-coords {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.result-actions-row {
  display: flex;
  gap: 0.35rem;
  margin-top: 0.4rem;
}

.result-actions-row .btn {
  min-height: 28px;
  padding: 0.2rem 0.55rem;
  font-size: 0.75rem;
}

.no-search-results {
  padding: 0.75rem;
  text-align: center;
  font-size: 0.78rem;
  color: var(--text-muted);
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
}

.dropzone:hover,
.dropzone.drag-over {
  border-color: var(--brand-600);
  background: var(--brand-50);
}

.hidden-file-input { display: none; }

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.upload-icon {
  width: 24px;
  height: 24px;
  color: var(--brand-600);
}

.upload-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text);
}

.upload-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* Progress */
.upload-progress-container {
  margin-top: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.progress-row {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.4rem 0.6rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 3px;
}

.progress-bar-track {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--brand-600);
  transition: width 150ms ease;
}

/* Uploaded Files */
.uploaded-files-block {
  margin-top: 0.75rem;
}

.files-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.sub-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.bulk-btns {
  display: flex;
  gap: 0.25rem;
}

.gpx-file-cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-height: 220px;
  overflow-y: auto;
}

.gpx-file-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.65rem;
}

.gpx-file-item.hidden {
  opacity: 0.6;
}

.gpx-file-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.gpx-name {
  font-size: 0.82rem;
  font-weight: 750;
  color: var(--heading);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.gpx-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.gpx-meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.gpx-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.35rem;
}

.method-tag {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--bg-muted);
  color: var(--text-secondary);
}

.method-tag.enclosed {
  background: #e8f5e9;
  color: #2e7d32;
}

.btn-group-right {
  display: flex;
  gap: 0.25rem;
}

/* Autofill Accordion */
.autofill-accordion {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.autofill-accordion-header {
  padding: 0.45rem 0.65rem;
  background: var(--bg-muted);
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--heading);
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.autofill-list {
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-height: 180px;
  overflow-y: auto;
}

.autofill-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding: 0.35rem 0.5rem;
  background: var(--bg);
  border-radius: var(--radius-sm);
}

.autofill-info {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.autofill-file-name {
  display: block;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--heading);
}

.autofill-derived-name {
  display: block;
  font-size: 0.7rem;
  color: var(--text-secondary);
}

/* Forms */
.form-row-sm {
  margin-bottom: 0.55rem;
}

.field-label-sm {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.2rem;
}

.field-label-xs {
  display: block;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.15rem;
}

.field-control-sm {
  width: 100%;
  min-height: 32px;
  font-size: 0.82rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  color: var(--text);
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.unit-text {
  font-size: 0.74rem;
  color: var(--text-muted);
}

.autofill-notice {
  font-size: 0.7rem;
  color: #2e7d32;
  font-weight: 700;
  margin-top: 2px;
}

/* Farmers List */
.filter-row-sm {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.55rem;
}

.filter-row-sm .field-label-sm {
  margin-bottom: 0;
  white-space: nowrap;
}

.farmers-list-container {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-height: 280px;
  overflow-y: auto;
}

.farmer-card-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.65rem;
}

.farmer-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.farmer-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--heading);
}

.farmer-card-location {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.farmer-badges-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.3rem;
}

.commodity-tag {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--bg-muted);
}

.farmer-card-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.4rem;
}

.farmer-card-actions .btn {
  min-height: 26px;
  padding: 0.18rem 0.5rem;
  font-size: 0.73rem;
  line-height: 1.15;
  border-radius: 4px;
}

.farmer-card-actions .btn .btn-icon,
.farmer-card-actions .btn svg {
  width: 13px;
  height: 13px;
}

.export-btn-group {
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
.gis-map-area {
  flex: 1;
  position: relative;
  background: var(--bg-subtle, #e5e9ec);
  overflow: hidden;
}

.map-canvas {
  width: 100%;
  height: 100%;
}

.map-floating-controls {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 400;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.map-tool-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  color: var(--text);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 160ms ease;
}

.map-tool-btn:hover {
  background: var(--brand-50);
  border-color: var(--brand-600);
  transform: translateY(-1px);
}

.map-tool-btn.active {
  background: #f9a825;
  color: #1a1a2e;
  border-color: #e09618;
}

.map-status-pill {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 400;
  background: var(--bg-elevated);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: 0.85rem;
  pointer-events: none;
  white-space: nowrap;
  max-width: 95%;
}

.map-status-pill span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.map-status-pill .item-inline-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  margin-right: 0;
}

.draw-indicator {
  color: #e65100;
  font-weight: 750;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

/* App Status Bar */
.app-status-bar {
  height: 28px;
  background: var(--bg-elevated);
  border-top: 1px solid var(--border);
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--text-muted);
  flex-shrink: 0;
  z-index: 10;
}

.status-msg {
  font-weight: 700;
}
.msg-success { color: #2e7d32; }
.msg-warning { color: #e65100; }
.msg-info { color: var(--text-secondary); }

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-dialog {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-dialog-sm {
  max-width: 380px;
  padding: 1.25rem;
}

.modal-header {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--heading);
  margin: 0;
}

.text-warning { color: #e65100; }

.modal-desc {
  font-size: 0.84rem;
  line-height: 1.5;
  margin: 0.75rem 0 0.25rem;
  color: var(--text);
}

.modal-sub {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin: 0 0 1rem;
}

.btn-close-modal {
  background: transparent;
  border: none;
  font-size: 14px;
  color: var(--text-muted);
  cursor: pointer;
}

.attr-table-wrap {
  padding: 1rem 1.25rem;
  max-height: 320px;
  overflow-y: auto;
}

.attr-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.attr-table th {
  width: 38%;
  text-align: left;
  padding: 0.35rem 0.5rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}

.attr-table td {
  padding: 0.35rem 0.5rem;
  color: var(--heading);
  border-bottom: 1px solid var(--border);
}

.parcel-subtable {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.parcel-sub-row {
  font-size: 0.74rem;
  color: var(--text-secondary);
}

.modal-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background: var(--bg-muted);
}

.edit-form-body {
  padding: 1rem 1.25rem;
  max-height: 380px;
  overflow-y: auto;
}

.parcels-editor-section {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--border);
}

.parcels-editor-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.parcel-edit-item {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.65rem;
}

.parcel-edit-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.74rem;
  font-weight: 750;
  margin-bottom: 0.35rem;
}

.btn-remove-parcel {
  background: transparent;
  border: none;
  color: var(--danger-strong);
  cursor: pointer;
  padding: 0;
}

.parcel-edit-inputs {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 0.4rem;
}

.font-mono { font-family: var(--font-mono, monospace); }
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-icon { width: 16px; height: 16px; }

@media (max-width: 860px) {
  .gis-workspace {
    flex-direction: column;
  }
  .gis-sidebar {
    width: 100%;
    height: 320px;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
</style>
