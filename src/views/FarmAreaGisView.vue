<template>
  <div class="farm-gis-page">
    <!-- Top Header -->
    <header class="gis-header">
      <div class="header-left">
        <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Farm Area GIS' }]" />
      </div>

      <div class="header-actions">
        <div class="sync-pill" :class="'sync-' + syncStatus" :title="syncStatusText + (lastSyncTime ? ' (Last synced: ' + lastSyncTime + ')' : '')">
          <CheckmarkFilled20 v-if="syncStatus === 'synced'" class="sync-icon text-success" />
          <Time20 v-else-if="syncStatus === 'syncing'" class="sync-icon text-warning rotating-icon" />
          <WarningFilled20 v-else-if="syncStatus === 'offline'" class="sync-icon text-muted" />
          <ErrorFilled20 v-else-if="syncStatus === 'error'" class="sync-icon text-danger" />
          <Reset20 v-else class="sync-icon text-muted" />
          <span class="sync-label">{{ syncStatusText }}</span>
          <button 
            type="button" 
            class="btn-sync-action" 
            title="Refresh & Pull from Server" 
            :disabled="syncStatus === 'syncing'"
            @click="fetchGisDataFromServer(false)"
          >
            <Reset20 class="btn-sync-icon" :class="{ 'rotating-icon': syncStatus === 'syncing' }" />
          </button>
        </div>
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

            <!-- Location Filter Dropdown -->
            <div class="filter-row-sm location-filter-row" style="margin-top: 10px">
              <label class="field-label-sm" for="searchLocationSelect">
                <Location20 class="item-inline-icon" /> Location:
              </label>
              <select 
                id="searchLocationSelect" 
                v-model="searchLocationFilter" 
                class="field-control-sm"
                @change="searchFarm"
              >
                <option v-for="loc in availableLocations" :key="loc" :value="loc">
                  {{ loc }}
                </option>
              </select>
            </div>

            <!-- Search Results List -->
            <div v-if="searchResults.length > 0" class="search-results-list">
              <div
                v-for="(result, index) in searchResults"
                :key="(result.type || 'x') + '_' + index"
                class="result-item-card"
                :class="{ 'result-gpx-card': result.gpx }"
                @click="flyToResult(result)"
              >
                <div class="result-header">
                  <span class="result-name truncate">
                    <UserProfile20 class="item-inline-icon" /> {{ result.name }}
                  </span>
                  <span class="badge badge-success">{{ fmt4(result.area) }} ha</span>
                </div>
                <div class="result-meta">
                  <Location20 class="item-inline-icon" /> {{ result.location || 'ALCALA, CAGAYAN' }}
                  <span v-if="result.commodity"> · {{ result.commodity }}</span>
                </div>
                <div v-if="result.gpx" class="result-meta font-mono" style="font-size: 11px; color: var(--brand-600, #2e7d32);">
                  <Document20 class="item-inline-icon" /> Track: {{ result.gpx.name }}
                </div>
                <div v-else-if="result.parcels && result.parcels.length > 0 && result.parcels[0].coords" class="result-coords font-mono">
                  <Location20 class="item-inline-icon" /> {{ result.parcels[0].coords }}
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
            <div v-else-if="searchQuery || searchLocationFilter !== 'All'" class="no-search-results">
              No matching farm areas found for "{{ searchQuery || searchLocationFilter }}".
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

            <!-- Location Filter Dropdown -->
            <div class="filter-row-sm" style="margin-top: 0.4rem;">
              <label class="field-label-sm" for="farmerLocationFilterSelect">Filter Location:</label>
              <select id="farmerLocationFilterSelect" v-model="farmerLocationFilter" class="field-control-sm">
                <option v-for="loc in availableLocations" :key="loc" :value="loc">
                  {{ loc === 'All' ? 'All Locations' : loc }}
                </option>
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
                {{ farmers.length === 0 ? 'No farmers registered yet.' : 'No farmers match the selected filters.' }}
              </div>
            </div>
          </section>

          <!-- 5. Cloud Synchronization Section -->
          <section class="panel-section">
            <div class="section-title">
              <span class="icon-label"><Earth20 class="section-icon" /> Cloud Synchronization</span>
            </div>
            <div class="sync-card-block">
              <div class="sync-info-row">
                <div class="sync-status-indicator" :class="'indicator-' + syncStatus">
                  <span class="sync-status-dot"></span>
                  <span class="sync-status-title">{{ syncStatusText }}</span>
                </div>
                <div v-if="lastSyncTime" class="sync-timestamp font-mono">
                  Updated: {{ lastSyncTime }}
                </div>
              </div>
              <div class="sync-actions-grid">
                <button 
                  type="button" 
                  class="btn btn-primary btn-sm" 
                  :disabled="syncStatus === 'syncing'" 
                  title="Upload all local GIS data to server"
                  @click="syncAllToServer(false)"
                >
                  <Upload20 class="btn-icon" />
                  <span>Upload to Server</span>
                </button>
                <button 
                  type="button" 
                  class="btn btn-secondary btn-sm" 
                  :disabled="syncStatus === 'syncing'" 
                  title="Pull latest GIS data from server"
                  @click="fetchGisDataFromServer(false)"
                >
                  <Reset20 class="btn-icon" :class="{ 'rotating-icon': syncStatus === 'syncing' }" />
                  <span>Pull from Server</span>
                </button>
              </div>
            </div>
          </section>

          <!-- 6. Data Export Section -->
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
            :class="{ active: boundaryVisible }" 
            title="Toggle Alcala Boundary Layer" 
            @click="toggleBoundaryLayer"
          >
            <MapBoundary20 />
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
          <span v-if="boundaryVisible" class="boundary-indicator" title="Alcala Municipal Boundary Layer Loaded">
            <MapBoundary20 class="item-inline-icon" /> Boundary Layer Active
          </span>
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
          <div class="modal-title-group">
            <h3 class="modal-title"><Document20 class="modal-title-icon" /> Attribute Info</h3>
            <span v-if="searchResults.length > 1" class="modal-counter-badge">
              Result {{ currentSearchInfoIndex + 1 }} of {{ searchResults.length }}
            </span>
          </div>
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
              <tr v-if="searchInfoItem.gpx || searchInfoItem.data.gpxFile">
                <th>GPX Track</th>
                <td><span class="badge badge-success">{{ (searchInfoItem.gpx || searchInfoItem.data.gpxFile).name }}</span></td>
              </tr>
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

        <div class="modal-footer modal-footer-split">
          <div class="modal-nav-group" v-if="searchResults.length > 1">
            <button 
              type="button" 
              class="btn btn-secondary btn-sm" 
              :disabled="currentSearchInfoIndex <= 0" 
              @click="prevSearchInfo"
            >
              <ChevronLeft20 class="btn-icon" /> Prev
            </button>
            <span class="nav-count-pill">{{ currentSearchInfoIndex + 1 }} / {{ searchResults.length }}</span>
            <button 
              type="button" 
              class="btn btn-secondary btn-sm" 
              :disabled="currentSearchInfoIndex >= searchResults.length - 1" 
              @click="nextSearchInfo"
            >
              Next <ChevronRight20 class="btn-icon" />
            </button>
          </div>
          <div class="modal-action-group">
            <button type="button" class="btn btn-primary btn-sm" @click="flyToResult(searchInfoItem)">
              <Location20 class="btn-icon" /> Zoom on Map
            </button>
            <button type="button" class="btn btn-secondary btn-sm" @click="closeSearchInfo">
              Close
            </button>
          </div>
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
          The file <strong>{{ pendingDuplicateFile.name }}</strong> has coordinates that closely match an already uploaded GPX track<span v-if="pendingDuplicateFile.duplicateName"> (<strong>{{ pendingDuplicateFile.duplicateName }}</strong>)</span>.
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, markRaw } from 'vue'
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
  ChevronRight20,
  Document20,
  UserProfile20,
  View20,
  ViewOff20,
  Edit20,
  Home20,
  Reset20,
  MapBoundary20,
  CheckmarkFilled20,
  ErrorFilled20,
  Time20,
  WarningFilled20,
} from '@carbon/icons-vue'
import { useToast } from '@/composables/useToast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { downloadZip } from 'client-zip'
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

const { success, warning, error, info } = useToast()
const { confirm } = useConfirmDialog()

// State
const mapContainer = ref(null)
let map = null
let farmerLayerGroup = null
let gpxTracksLayerGroup = null
let drawnLayerGroup = null

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
const searchLocationFilter = ref('All')
const searchResults = ref([])
const searchInfoItem = ref(null)

const availableLocations = computed(() => {
  const locSet = new Set()
  farmers.value.forEach(f => {
    if (f.location) locSet.add(f.location.trim().toUpperCase())
  })
  uploadedFiles.value.forEach(g => {
    const loc = deriveLocationFromGPX(g.name)
    if (loc) locSet.add(loc.trim().toUpperCase())
  })
  const defaultLocs = [
    'ALCALA, CAGAYAN',
    'ENRILE, CAGAYAN',
    'GATTARAN, CAGAYAN',
    'LAL-LO, CAGAYAN',
    'BUGUEY, CAGAYAN',
    'CAMALANIUGAN, CAGAYAN',
    'APARRI, CAGAYAN'
  ]
  defaultLocs.forEach(l => locSet.add(l))
  return ['All', ...Array.from(locSet).sort()]
})

const isDragOver = ref(false)
const gpxFileInput = ref(null)
const uploadedFiles = ref([])
const uploadProgress = ref([])
const pendingDuplicateFile = ref(null)

const farmers = ref([])
const newFarmer = ref({ name: '', location: '', area: '', coords: '', commodity: 'Rice' })
const autoPopulatedArea = ref(null)
const commodityFilter = ref('All')
const farmerLocationFilter = ref('All')

const editingFarmer = ref(null)
const editingIndex = ref(-1)

const drawMode = ref(false)
const heatmapVisible = ref(false)
let heatmapLayer = null

const boundaryVisible = ref(true)
let boundaryLayer = null

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
const STORAGE_KEY_GPX_TRACKS = 'farm_area_gis_gpx_tracks'

const API_BASE = import.meta.env.VITE_API_ENDPOINT || 'https://api-abealcala.duckdns.org'
const syncStatus = ref('idle') // 'idle' | 'syncing' | 'synced' | 'offline' | 'error'
const syncStatusText = ref('Cloud Sync Ready')
const lastSyncTime = ref(null)
let saveDebounceTimer = null

// Computed
const filteredFarmers = computed(() => {
  return farmers.value.filter(f => {
    const matchCommodity = commodityFilter.value === 'All' || f.commodity === commodityFilter.value
    const fLoc = (f.location || 'ALCALA, CAGAYAN').trim().toUpperCase()
    const targetLoc = farmerLocationFilter.value
    const matchLocation = targetLoc === 'All' || fLoc === targetLoc || fLoc.includes(targetLoc.replace(', CAGAYAN', '').trim())
    return matchCommodity && matchLocation
  })
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
  if (!mapContainer.value) return
  if (map) {
    map.remove()
    map = null
  }

  map = L.map(mapContainer.value, {
    center: ALCALA_CENTER,
    zoom: 13,
    zoomControl: true,
    attributionControl: true
  })

  // Layer groups for clean multi-user sync and zero zoom drift
  farmerLayerGroup = L.layerGroup().addTo(map)
  gpxTracksLayerGroup = L.layerGroup().addTo(map)
  drawnLayerGroup = L.layerGroup().addTo(map)

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

  // Initialize and display Alcala boundary layer as default layer
  initBoundaryLayer()

  try {
    if (boundaryLayer && map.hasLayer(boundaryLayer)) {
      map.fitBounds(boundaryLayer.getBounds(), { padding: [20, 20] })
    }
  } catch (e) {
    console.warn('Could not fit bounds to boundary:', e)
  }

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
  if (!map || !farmerLayerGroup) return
  const isPrimary = parcelIndex === 0
  const parcelColors = ['#2e7d32', '#1e88e5', '#f9a825', '#8e24aa', '#e53935', '#00acc1']
  const color = parcelColors[parcelIndex % parcelColors.length]
  const icon = L.divIcon({
    className: 'custom-farmer-marker',
    html: `<div style="box-sizing:border-box; width:28px; height:28px; border-radius:50%; background:${color}; border:2px solid #ffffff; box-shadow:0 2px 6px rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; color:#ffffff; line-height:1; user-select:none;">${parcelIndex + 1}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  })
  const marker = L.marker([lat, lng], { icon })
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
  farmerLayerGroup.addLayer(marker)
  farmerMarkers.push({ marker: markRaw(marker), farmer })
}

function removeFarmerMarker(farmer) {
  for (let i = farmerMarkers.length - 1; i >= 0; i--) {
    const fm = farmerMarkers[i]
    if (fm.farmer === farmer || (fm.farmer && fm.farmer.name && farmer && farmer.name && fm.farmer.name.toUpperCase() === farmer.name.toUpperCase())) {
      if (farmerLayerGroup && fm.marker) {
        farmerLayerGroup.removeLayer(fm.marker)
      } else if (map && fm.marker) {
        map.removeLayer(fm.marker)
      }
      farmerMarkers.splice(i, 1)
    }
  }
}

function clearAllFarmerMarkers() {
  if (farmerLayerGroup) {
    farmerLayerGroup.clearLayers()
  } else if (map) {
    for (let i = farmerMarkers.length - 1; i >= 0; i--) {
      if (farmerMarkers[i].marker) {
        map.removeLayer(farmerMarkers[i].marker)
      }
    }
  }
  farmerMarkers.length = 0
}

function renderFarmersData(farmersList) {
  clearAllFarmerMarkers()
  farmers.value = Array.isArray(farmersList) ? farmersList : []
  farmers.value.forEach(f => {
    if (!f.parcels) {
      f.parcels = []
      if (f.coords && f.area) f.parcels.push({ area: Number(f.area), coords: String(f.coords) })
    }
    f.area = f.parcels.reduce((sum, p) => sum + (Number(p.area) || 0), 0)
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
    farmers.value = []
  }

  farmers.value.forEach(f => {
    if (!f.parcels) {
      f.parcels = []
      if (f.coords && f.area) f.parcels.push({ area: Number(f.area), coords: String(f.coords) })
    }
    f.area = f.parcels.reduce((sum, p) => sum + (Number(p.area) || 0), 0)
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
    const toSave = farmers.value.map(f => {
      const parcels = (f.parcels && f.parcels.length > 0)
        ? f.parcels.map(p => ({
            area: Number(Number(p.area || 0).toFixed(4)),
            coords: String(p.coords || '').trim()
          }))
        : (f.coords && f.area
            ? [{ area: Number(Number(f.area).toFixed(4)), coords: String(f.coords).trim() }]
            : [])
      return {
        name: (f.name || '').trim().toUpperCase(),
        location: (f.location || 'ALCALA, CAGAYAN').trim().toUpperCase(),
        commodity: f.commodity || 'Rice',
        parcels
      }
    })
    localStorage.setItem(STORAGE_KEY_FARMERS, JSON.stringify(toSave))
    queueServerSync()
  } catch (e) {
    console.error('Error persisting farmers to localStorage:', e)
  }
}

// Search
function searchFarm() {
  const q = searchQuery.value.toLowerCase().trim()
  const loc = searchLocationFilter.value

  if (!q && loc === 'All') {
    searchResults.value = []
    searchInfoItem.value = null
    return
  }

  const unifiedMap = new Map()

  // 1. Process farmers
  farmers.value.forEach(f => {
    const name = (f.name || '').trim().toUpperCase()
    const location = (f.location || 'ALCALA, CAGAYAN').trim().toUpperCase()
    const commodity = f.commodity || 'Rice'

    if (loc !== 'All' && !location.includes(loc.replace(', CAGAYAN', '').trim()) && location !== loc) {
      return
    }

    if (q) {
      const matchName = name.toLowerCase().includes(q)
      const matchLoc = location.toLowerCase().includes(q)
      const matchCrop = commodity.toLowerCase().includes(q)
      if (!matchName && !matchLoc && !matchCrop) return
    }

    const matchingGpx = uploadedFiles.value.find(g => {
      const gName = deriveNameFromGPX(g.name).toUpperCase()
      return gName === name || g.name.toUpperCase().includes(name)
    })

    const totalArea = f.parcels ? f.parcels.reduce((s, p) => s + (Number(p.area) || 0), 0) : Number(f.area || 0)

    unifiedMap.set(name, {
      type: 'farmer',
      name,
      location,
      commodity,
      derivedName: name,
      area: totalArea,
      parcels: f.parcels || [],
      data: {
        ...f,
        area: totalArea,
        gpxFile: matchingGpx || null
      },
      gpx: matchingGpx || null,
      label: name
    })
  })

  // 2. Process uploaded GPX files that might not be in unifiedMap yet
  uploadedFiles.value.forEach(g => {
    const derived = deriveNameFromGPX(g.name).trim().toUpperCase()
    if (unifiedMap.has(derived)) {
      const existing = unifiedMap.get(derived)
      if (!existing.gpx) {
        existing.gpx = g
        existing.data.gpxFile = g
      }
      return
    }

    const location = deriveLocationFromGPX(g.name).trim().toUpperCase()
    const commodity = deriveCommodityFromGPX(g.name)

    if (loc !== 'All' && !location.includes(loc.replace(', CAGAYAN', '').trim()) && location !== loc) {
      return
    }

    if (q) {
      const matchName = (g.name || '').toLowerCase().includes(q) || derived.toLowerCase().includes(q)
      const matchLoc = location.toLowerCase().includes(q)
      const matchCrop = commodity.toLowerCase().includes(q)
      if (!matchName && !matchLoc && !matchCrop) return
    }

    unifiedMap.set(derived, {
      type: 'gpx',
      name: derived || g.name,
      derivedName: derived,
      location,
      commodity,
      area: g.areaHectares,
      parcels: [{ area: g.areaHectares, coords: `${g.center.lat.toFixed(5)},${g.center.lng.toFixed(5)}` }],
      data: {
        ...g,
        location,
        commodity
      },
      gpx: g,
      label: derived || g.name
    })
  })

  searchResults.value = Array.from(unifiedMap.values())
  setStatus(
    `Found ${searchResults.value.length} unique farm area(s)${loc !== 'All' ? ` in ${loc}` : ''}`,
    searchResults.value.length > 0 ? 'success' : 'warning'
  )

  if (searchResults.value.length > 0) {
    openSearchInfo(searchResults.value[0])
  } else {
    searchInfoItem.value = null
  }
}

const currentSearchInfoIndex = computed(() => {
  if (!searchInfoItem.value || searchResults.value.length === 0) return 0
  const idx = searchResults.value.findIndex(item => item === searchInfoItem.value || (item.name && searchInfoItem.value.name && item.name.toUpperCase() === searchInfoItem.value.name.toUpperCase()))
  return idx >= 0 ? idx : 0
})

function prevSearchInfo() {
  if (currentSearchInfoIndex.value > 0) {
    searchInfoItem.value = searchResults.value[currentSearchInfoIndex.value - 1]
  }
}

function nextSearchInfo() {
  if (currentSearchInfoIndex.value < searchResults.value.length - 1) {
    searchInfoItem.value = searchResults.value[currentSearchInfoIndex.value + 1]
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
  closeSearchInfo()

  // Prefer GPX track boundary if available
  const gpxObj = result.gpx || (result.type === 'gpx' ? result.data : null)
  if (gpxObj && gpxObj.layer) {
    flyToGPX(gpxObj)
    return
  }

  const farmer = result.data || result
  const firstParcel = farmer.parcels && farmer.parcels.length > 0 ? farmer.parcels[0] : null
  const coords = firstParcel && firstParcel.coords ? firstParcel.coords : farmer.coords
  if (coords) {
    const [lat, lng] = coords.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 16, { duration: 1.0 })
      setStatus(`Navigating to ${farmer.name || result.name}'s farm parcel`, 'success')

      const fm = farmerMarkers.find(m => m.farmer === farmer || (m.farmer.name && (farmer.name || result.name) && m.farmer.name.toUpperCase() === (farmer.name || result.name).toUpperCase()))
      if (fm && fm.marker) {
        setTimeout(() => {
          if (fm.marker) fm.marker.openPopup()
        }, 300)
        fm.marker.openPopup()
      }
      return
    }
  }

  if (gpxObj) {
    flyToGPX(gpxObj)
  }
}

function flyToGPX(gpxFile) {
  if (!gpxFile || !map) return
  closeSearchInfo()

  if (gpxFile.layer) {
    map.fitBounds(gpxFile.layer.getBounds(), { padding: [50, 50], maxZoom: 16 })
    const popupPos = gpxFile.center ? [gpxFile.center.lat, gpxFile.center.lng] : gpxFile.layer.getBounds().getCenter()
    setTimeout(() => {
      if (gpxFile.layer) gpxFile.layer.openPopup(popupPos)
    }, 300)
    gpxFile.layer.openPopup(popupPos)
    setStatus(`🎯 Zoomed to GPX track ${gpxFile.name}`, 'success')
  } else if (gpxFile.center) {
    map.flyTo([gpxFile.center.lat, gpxFile.center.lng], 16, { duration: 1.0 })
    setStatus(`🎯 Zoomed to GPX track ${gpxFile.name}`, 'success')
  }
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

let duplicateResolver = null

function askDuplicateDecision(fileName, duplicateMatch) {
  return new Promise((resolve) => {
    pendingDuplicateFile.value = {
      name: fileName,
      duplicateName: duplicateMatch?.name || ''
    }
    duplicateResolver = resolve
  })
}

function confirmDuplicateUpload(proceed) {
  if (duplicateResolver) {
    const resolver = duplicateResolver
    duplicateResolver = null
    pendingDuplicateFile.value = null
    resolver(proceed)
  } else {
    pendingDuplicateFile.value = null
  }
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
          warning(`Duplicate detected: "${file.name}" matches "${duplicate.name}"`)
          const proceed = await askDuplicateDecision(file.name, duplicate)
          if (!proceed) {
            prog.status = 'skipped'
            prog.percent = 100
            info(`Skipped duplicate ${file.name}`)
            continue
          }
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
  const skipCount = uploadProgress.value.filter(p => p.status === 'skipped').length
  success(`Batch upload completed: ${successCount} imported, ${skipCount} skipped (${files.length} total)`)
  setTimeout(() => {
    if (!pendingDuplicateFile.value) uploadProgress.value = []
  }, 4000)
}

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function createGpxPolygonLayer(points, color, fileName, areaHectares, areaKm2, isEnclosed, centerLatVal, centerLngVal) {
  const gpxLayer = L.polygon(points, {
    color: color,
    weight: 3,
    opacity: 0.9,
    fillColor: color,
    fillOpacity: 0.25
  })

  const derivedName = deriveNameFromGPX(fileName)
  const detectedCommodity = deriveCommodityFromGPX(fileName)
  const detectedLocation = deriveLocationFromGPX(fileName)
  const coordsStr = `${centerLatVal.toFixed(4)},${centerLngVal.toFixed(4)}`

  gpxLayer.bindPopup(`
    <div style="min-width:240px; font-family: inherit; font-size: 13px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #eee; padding-bottom:4px;">
        <h3 style="margin:0; color:#2e7d32; font-size:15px; font-weight:700;">${escapeHtml(derivedName)}</h3>
        <span style="background:${color}; color:white; font-size:10.5px; font-weight:bold; padding:2px 7px; border-radius:10px;">${escapeHtml(detectedCommodity)}</span>
      </div>
      <p style="margin:3px 0; font-size:12px; color:#444;"><strong>Location:</strong> ${escapeHtml(detectedLocation)}</p>
      <p style="margin:3px 0; font-size:12px; color:#444;"><strong>File:</strong> ${escapeHtml(fileName)}</p>
      <p style="margin:3px 0; font-size:12px; color:#111;"><strong>Farm Area:</strong> <strong style="color:#2e7d32; font-size:13px;">${areaHectares.toFixed(4)} ha</strong> (${(areaKm2 * 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })} m²)</p>
      <p style="margin:3px 0; font-size:11.5px; color:#666;"><strong>Boundary:</strong> ${isEnclosed ? 'Enclosed Polygon' : 'Track Polygon'} (${points.length} GPS pts)</p>
      <div style="margin-top:6px; padding-top:6px; border-top:1px solid #eee; font-size:11px; color:#777;">
        Coordinates: <span style="font-family:monospace; color:#333;">${coordsStr}</span>
      </div>
    </div>
  `)

  let startMarker = null
  let endMarker = null
  if (points.length > 1) {
    const startIcon = L.divIcon({
      className: 'custom-track-marker',
      html: `<div style="box-sizing:border-box; width:14px; height:14px; border-radius:50%; background:#4CAF50; border:2px solid #ffffff; box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -7]
    })
    const endIcon = L.divIcon({
      className: 'custom-track-marker',
      html: `<div style="box-sizing:border-box; width:14px; height:14px; border-radius:50%; background:#F44336; border:2px solid #ffffff; box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -7]
    })
    startMarker = L.marker(points[0], { icon: startIcon })
    endMarker = L.marker(points[points.length - 1], { icon: endIcon })
    startMarker.bindPopup(`<strong>${escapeHtml(derivedName)}</strong><br>Track Start<br><small>${points[0][0].toFixed(5)}, ${points[0][1].toFixed(5)}</small>`)
    endMarker.bindPopup(`<strong>${escapeHtml(derivedName)}</strong><br>Track End<br><small>${points[points.length - 1][0].toFixed(5)}, ${points[points.length - 1][1].toFixed(5)}</small>`)
  }

  return { gpxLayer, startMarker, endMarker }
}

function clearAllGpxTrackLayers() {
  if (gpxTracksLayerGroup) {
    gpxTracksLayerGroup.clearLayers()
  } else if (map) {
    uploadedFiles.value.forEach(f => {
      if (f.layer) map.removeLayer(f.layer)
      if (f.startMarker) map.removeLayer(f.startMarker)
      if (f.endMarker) map.removeLayer(f.endMarker)
    })
  }
  uploadedFiles.value = []
}

function renderGpxTracksData(tracksList) {
  clearAllGpxTrackLayers()
  if (!Array.isArray(tracksList) || !map || !gpxTracksLayerGroup) return
  tracksList.forEach(track => {
    if (!track.points || track.points.length === 0) return
    const center = track.center || { lat: 17.9021, lng: 121.6560 }
    const { gpxLayer, startMarker, endMarker } = createGpxPolygonLayer(
      track.points,
      track.color || '#2196F3',
      track.name,
      track.areaHectares || 0,
      track.areaKm2 || 0,
      track.isEnclosed !== false,
      center.lat,
      center.lng
    )
    if (track.visible !== false) {
      gpxTracksLayerGroup.addLayer(gpxLayer)
      if (startMarker) gpxTracksLayerGroup.addLayer(startMarker)
      if (endMarker) gpxTracksLayerGroup.addLayer(endMarker)
    }
    uploadedFiles.value.push({
      ...track,
      center,
      layer: markRaw(gpxLayer),
      startMarker: startMarker ? markRaw(startMarker) : null,
      endMarker: endMarker ? markRaw(endMarker) : null
    })
  })
}

function persistGpxTracks() {
  try {
    const dataToSave = uploadedFiles.value.map(f => ({
      name: f.name,
      points: f.points,
      color: f.color,
      center: f.center,
      pointCount: f.pointCount,
      visible: f.visible !== false,
      areaKm2: f.areaKm2,
      areaHectares: f.areaHectares,
      areaMethod: f.areaMethod,
      isEnclosed: f.isEnclosed
    }))
    localStorage.setItem(STORAGE_KEY_GPX_TRACKS, JSON.stringify(dataToSave))
    queueServerSync()
  } catch (e) {
    console.error('Error persisting GPX tracks to localStorage:', e)
  }
}

function loadSavedGpxTracks() {
  const saved = localStorage.getItem(STORAGE_KEY_GPX_TRACKS)
  if (!saved || !map) return
  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed) && parsed.length > 0) {
      renderGpxTracksData(parsed)
    }
  } catch (e) {
    console.error('Error loading saved GPX tracks:', e)
  }
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

    const { gpxLayer, startMarker, endMarker } = createGpxPolygonLayer(
      points,
      color,
      fileName,
      areaHectares,
      areaKm2,
      isEnclosed,
      centerLatVal,
      centerLngVal
    )

    if (gpxTracksLayerGroup) {
      gpxTracksLayerGroup.addLayer(gpxLayer)
      if (startMarker) gpxTracksLayerGroup.addLayer(startMarker)
      if (endMarker) gpxTracksLayerGroup.addLayer(endMarker)
    } else if (map) {
      gpxLayer.addTo(map)
      if (startMarker) startMarker.addTo(map)
      if (endMarker) endMarker.addTo(map)
    }

    uploadedFiles.value.push({
      name: fileName,
      layer: markRaw(gpxLayer),
      startMarker: startMarker ? markRaw(startMarker) : null,
      endMarker: endMarker ? markRaw(endMarker) : null,
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

    persistGpxTracks()
    if (map) map.fitBounds(gpxLayer.getBounds(), { padding: [50, 50] })
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
  if (!map || !gpxTracksLayerGroup) return
  if (file.visible) {
    if (file.layer) gpxTracksLayerGroup.addLayer(file.layer)
    if (file.startMarker) gpxTracksLayerGroup.addLayer(file.startMarker)
    if (file.endMarker) gpxTracksLayerGroup.addLayer(file.endMarker)
  } else {
    if (file.layer) gpxTracksLayerGroup.removeLayer(file.layer)
    if (file.startMarker) gpxTracksLayerGroup.removeLayer(file.startMarker)
    if (file.endMarker) gpxTracksLayerGroup.removeLayer(file.endMarker)
  }
  persistGpxTracks()
}

function fitToFile(index) {
  const file = uploadedFiles.value[index]
  if (file.layer && map) {
    map.fitBounds(file.layer.getBounds(), { padding: [60, 60] })
  }
}

function removeFile(index) {
  const file = uploadedFiles.value[index]
  if (gpxTracksLayerGroup) {
    if (file.layer) gpxTracksLayerGroup.removeLayer(file.layer)
    if (file.startMarker) gpxTracksLayerGroup.removeLayer(file.startMarker)
    if (file.endMarker) gpxTracksLayerGroup.removeLayer(file.endMarker)
  }
  uploadedFiles.value.splice(index, 1)
  persistGpxTracks()
  info(`Removed ${file.name} from list and map`)
}

function showAllFiles() {
  if (!map || !gpxTracksLayerGroup) return
  uploadedFiles.value.forEach(f => {
    f.visible = true
    if (f.layer) gpxTracksLayerGroup.addLayer(f.layer)
    if (f.startMarker) gpxTracksLayerGroup.addLayer(f.startMarker)
    if (f.endMarker) gpxTracksLayerGroup.addLayer(f.endMarker)
  })
  persistGpxTracks()
  success('All GPX tracks visible')
}

function hideAllFiles() {
  if (!map || !gpxTracksLayerGroup) return
  uploadedFiles.value.forEach(f => {
    f.visible = false
    if (f.layer) gpxTracksLayerGroup.removeLayer(f.layer)
    if (f.startMarker) gpxTracksLayerGroup.removeLayer(f.startMarker)
    if (f.endMarker) gpxTracksLayerGroup.removeLayer(f.endMarker)
  })
  persistGpxTracks()
  info('All GPX tracks hidden')
}

function removeAllFiles() {
  if (gpxTracksLayerGroup) {
    gpxTracksLayerGroup.clearLayers()
  }
  uploadedFiles.value = []
  persistGpxTracks()
  info('Cleared GPX list and tracks')
}

// Farmer Registration & Autofill
function deriveCommodityFromGPX(fileName) {
  const upper = (fileName || '').toUpperCase()
  if (upper.includes('TOBACCO')) return 'Tobacco'
  if (upper.includes('CORN') || upper.includes('MAIS')) return 'Corn'
  if (upper.includes('RICE') || upper.includes('PALAY')) return 'Rice'
  if (upper.includes('VEGETABLE') || upper.includes('GULAY') || upper.includes('ONION') || upper.includes('GARLIC') || upper.includes('PEPPER') || upper.includes('EGGPLANT') || upper.includes('TOMATO') || upper.includes('CASSAVA')) return 'Vegetables'
  if (upper.includes('FRUIT') || upper.includes('PRUTAS') || upper.includes('BANANA') || upper.includes('MANGO')) return 'Fruits'
  return 'Rice'
}

function deriveLocationFromGPX(fileName) {
  const upper = (fileName || '').toUpperCase()
  const locations = [
    { key: 'ENRILE', name: 'ENRILE, CAGAYAN' },
    { key: 'ALCALA', name: 'ALCALA, CAGAYAN' },
    { key: 'GATTARAN', name: 'GATTARAN, CAGAYAN' },
    { key: 'LAL-LO', name: 'LAL-LO, CAGAYAN' },
    { key: 'LALLO', name: 'LAL-LO, CAGAYAN' },
    { key: 'BUGUEY', name: 'BUGUEY, CAGAYAN' },
    { key: 'CAMALANIUGAN', name: 'CAMALANIUGAN, CAGAYAN' },
    { key: 'APARRI', name: 'APARRI, CAGAYAN' },
    { key: 'TUGUEGARAO', name: 'TUGUEGARAO, CAGAYAN' },
    { key: 'SOLANA', name: 'SOLANA, CAGAYAN' },
    { key: 'AMULUNG', name: 'AMULUNG, CAGAYAN' },
    { key: 'BAGGAO', name: 'BAGGAO, CAGAYAN' },
    { key: 'PEÑABLANCA', name: 'PEÑABLANCA, CAGAYAN' },
    { key: 'PENABLANCA', name: 'PEÑABLANCA, CAGAYAN' },
    { key: 'IGUIG', name: 'IGUIG, CAGAYAN' },
    { key: 'ALLACAPAN', name: 'ALLACAPAN, CAGAYAN' },
    { key: 'LASAM', name: 'LASAM, CAGAYAN' },
    { key: 'SANTO NIÑO', name: 'SANTO NIÑO, CAGAYAN' },
    { key: 'SANTO NINO', name: 'SANTO NIÑO, CAGAYAN' },
    { key: 'BALLESTEROS', name: 'BALLESTEROS, CAGAYAN' },
    { key: 'ABULUG', name: 'ABULUG, CAGAYAN' },
    { key: 'PAMPLONA', name: 'PAMPLONA, CAGAYAN' },
    { key: 'SANCHEZ MIRA', name: 'SANCHEZ MIRA, CAGAYAN' },
    { key: 'CLAVERIA', name: 'CLAVERIA, CAGAYAN' },
    { key: 'SANTA PRAXEDES', name: 'SANTA PRAXEDES, CAGAYAN' },
    { key: 'SANTA TERESITA', name: 'SANTA TERESITA, CAGAYAN' },
    { key: 'GONZAGA', name: 'GONZAGA, CAGAYAN' },
    { key: 'STA. ANA', name: 'SANTA ANA, CAGAYAN' },
    { key: 'SANTA ANA', name: 'SANTA ANA, CAGAYAN' },
    { key: 'PIAT', name: 'PIAT, CAGAYAN' },
    { key: 'FAIRE', name: 'SANTO NIÑO, CAGAYAN' },
    { key: 'RIZAL', name: 'RIZAL, CAGAYAN' },
    { key: 'TUAO', name: 'TUAO, CAGAYAN' }
  ]
  for (const loc of locations) {
    if (upper.includes(loc.key)) return loc.name
  }
  return 'ALCALA, CAGAYAN'
}

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
  newFarmer.value.coords = `${file.center.lat.toFixed(4)},${file.center.lng.toFixed(4)}`
  newFarmer.value.commodity = deriveCommodityFromGPX(file.name)
  newFarmer.value.location = deriveLocationFromGPX(file.name)

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
  const coords = `${file.center.lat.toFixed(4)},${file.center.lng.toFixed(4)}`
  const areaHa = Number(Number(file.areaHectares).toFixed(4))
  const commodity = deriveCommodityFromGPX(file.name)
  const location = deriveLocationFromGPX(file.name)

  const existingFarmer = farmers.value.find(f => f.name.toUpperCase() === derived.toUpperCase())
  if (existingFarmer) {
    if (!existingFarmer.parcels) existingFarmer.parcels = []
    const alreadyHasCoord = existingFarmer.parcels.some(p => p.coords === coords)
    if (!alreadyHasCoord) {
      existingFarmer.parcels.push({ area: areaHa, coords })
      existingFarmer.area = existingFarmer.parcels.reduce((sum, p) => sum + (Number(p.area) || 0), 0)
      addFarmerMarker(existingFarmer, file.center.lat, file.center.lng, existingFarmer.parcels.length - 1)
    }
    persistFarmers()
    return existingFarmer
  }

  const farmer = {
    name: derived,
    location,
    commodity,
    parcels: [{ area: areaHa, coords }]
  }
  farmer.area = areaHa
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
      map.flyTo([lat, lng], 16, { duration: 1.0 })
      setStatus(`Locating ${farmer.name}`, 'info')

      const fm = farmerMarkers.find(m => m.farmer === farmer || (m.farmer.name && farmer.name && m.farmer.name.toUpperCase() === farmer.name.toUpperCase()))
      if (fm && fm.marker) {
        setTimeout(() => {
          if (fm.marker) fm.marker.openPopup()
        }, 300)
        fm.marker.openPopup()
      }
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
    className: 'custom-draw-marker',
    html: `<div style="box-sizing:border-box; width:10px; height:10px; border-radius:50%; background:#FF9800; border:2px solid #ffffff; box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -5]
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
      className: 'custom-area-label',
      html: `<div style="box-sizing:border-box; background:rgba(33,150,243,0.92); color:#ffffff; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:bold; white-space:nowrap; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.2); display:inline-block; line-height:1.2;">${areaHa.toFixed(4)} ha</div>`,
      iconSize: [100, 24],
      iconAnchor: [50, 12],
      popupAnchor: [0, -12]
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
function initBoundaryLayer() {
  if (!map) return

  if (boundaryLayer) {
    if (map.hasLayer(boundaryLayer)) map.removeLayer(boundaryLayer)
    boundaryLayer = null
  }

  boundaryLayer = L.geoJSON(alcalaBoundaryGeoJson, {
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
  })

  if (boundaryVisible.value) {
    boundaryLayer.addTo(map)
  }
}

function toggleBoundaryLayer() {
  boundaryVisible.value = !boundaryVisible.value
  if (!map) return

  if (!boundaryLayer) {
    initBoundaryLayer()
  }

  if (boundaryVisible.value) {
    if (boundaryLayer && !map.hasLayer(boundaryLayer)) {
      boundaryLayer.addTo(map)
    }
    info('🏛️ Alcala Boundary layer enabled')
    setStatus('Alcala boundary layer visible', 'info')
  } else {
    if (boundaryLayer && map.hasLayer(boundaryLayer)) {
      map.removeLayer(boundaryLayer)
    }
    info('Alcala Boundary layer hidden')
    setStatus('Alcala boundary layer hidden', 'info')
  }
}

function resetView() {
  if (map) {
    if (boundaryLayer && boundaryVisible.value && map.hasLayer(boundaryLayer)) {
      map.flyToBounds(boundaryLayer.getBounds(), { padding: [20, 20], duration: 1.2 })
    } else {
      map.flyTo(ALCALA_CENTER, 13, { duration: 1.2 })
    }
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

async function exportGPX() {
  if (uploadedFiles.value.length === 0) {
    warning('No GPX tracks available to export.')
    return
  }

  try {
    setStatus('Packaging GPX tracks by location into ZIP...', 'info')

    const zipEntries = []

    uploadedFiles.value.forEach(file => {
      let rawLoc = deriveLocationFromGPX(file.name) || 'ALCALA'
      // Clean and sanitize folder name (e.g., 'ENRILE, CAGAYAN' -> 'ENRILE')
      let cleanLoc = rawLoc.replace(/,.*$/, '').trim().replace(/[\\/:*?"<>|]/g, '_') || 'UNSPECIFIED_LOCATION'

      let gpx = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="FarmArea GIS Alcala">\n  <trk>\n    <name>${file.name}</name>\n    <trkseg>`
      file.points.forEach(pt => {
        gpx += `\n      <trkpt lat="${pt[0]}" lon="${pt[1]}"></trkpt>`
      })
      gpx += `\n    </trkseg>\n  </trk>\n</gpx>`

      const safeFileName = file.name.toLowerCase().endsWith('.gpx') ? file.name : `${file.name}.gpx`
      const zipPath = `${cleanLoc}/${safeFileName}`

      zipEntries.push({
        name: zipPath,
        input: gpx
      })
    })

    const zipBlob = await downloadZip(zipEntries).blob()
    const dateStr = new Date().toISOString().slice(0, 10)
    downloadBlob(zipBlob, `farm_area_gpx_tracks_by_location_${dateStr}.zip`)
    success(`Successfully exported ${uploadedFiles.value.length} GPX tracks organized by location into ZIP!`)
    setStatus(`Exported ${uploadedFiles.value.length} GPX file(s) into ZIP`, 'success')
  } catch (err) {
    console.error('Error generating GPX zip:', err)
    error('Failed to generate GPX ZIP file.')
    setStatus('Export failed', 'error')
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  downloadBlob(blob, filename)
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

function queueServerSync() {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer)
  saveDebounceTimer = setTimeout(() => {
    syncAllToServer(false, true)
  }, 1200)
}

async function fetchGisDataFromServer(showNotification = false) {
  syncStatus.value = 'syncing'
  syncStatusText.value = 'Syncing...'
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_BASE}/gis/sync`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.code === 200) {
      const serverFarmers = Array.isArray(data.farmers) ? data.farmers : []
      const serverTracks = Array.isArray(data.gpx_tracks) ? data.gpx_tracks : []

      const hasServerData = serverFarmers.length > 0 || serverTracks.length > 0
      const hasLocalData = (farmers.value && farmers.value.length > 0) || (uploadedFiles.value && uploadedFiles.value.length > 0)

      if (hasServerData) {
        renderFarmersData(serverFarmers)
        renderGpxTracksData(serverTracks)

        // Save fresh data into localStorage
        localStorage.setItem(STORAGE_KEY_FARMERS, JSON.stringify(serverFarmers))
        const tracksToSave = serverTracks.map(f => ({
          name: f.name,
          points: f.points,
          color: f.color,
          center: f.center,
          pointCount: f.pointCount,
          visible: f.visible !== false,
          areaKm2: f.areaKm2,
          areaHectares: f.areaHectares,
          areaMethod: f.areaMethod,
          isEnclosed: f.isEnclosed
        }))
        localStorage.setItem(STORAGE_KEY_GPX_TRACKS, JSON.stringify(tracksToSave))

        syncStatus.value = 'synced'
        syncStatusText.value = `In sync (${serverFarmers.length} farmers, ${serverTracks.length} tracks)`
        lastSyncTime.value = new Date().toLocaleTimeString()
        if (showNotification) {
          success(`Latest GIS data loaded (${serverFarmers.length} farmers, ${serverTracks.length} tracks)`)
        }
      } else if (hasLocalData) {
        // Initial migration: upload local data to server
        await syncAllToServer(true, true)
      } else {
        syncStatus.value = 'synced'
        syncStatusText.value = 'In sync (0 records)'
        lastSyncTime.value = new Date().toLocaleTimeString()
      }
    }
  } catch (err) {
    console.warn('Server GIS sync warning (using offline/local mode):', err)
    syncStatus.value = 'offline'
    syncStatusText.value = 'Local only (Offline)'
    if (showNotification) {
      info('Working in offline mode with local storage data')
    }
  }
}

async function syncAllToServer(isInitialMigration = false, silent = false) {
  syncStatus.value = 'syncing'
  syncStatusText.value = 'Uploading to server...'
  try {
    const token = localStorage.getItem('token')
    const farmersToUpload = farmers.value.map(f => {
      const parcels = (f.parcels && f.parcels.length > 0)
        ? f.parcels.map(p => ({
            area: Number(Number(p.area || 0).toFixed(4)),
            coords: String(p.coords || '').trim()
          }))
        : (f.coords && f.area
            ? [{ area: Number(Number(f.area).toFixed(4)), coords: String(f.coords).trim() }]
            : [])
      return {
        name: (f.name || '').trim().toUpperCase(),
        location: (f.location || 'ALCALA, CAGAYAN').trim().toUpperCase(),
        commodity: f.commodity || 'Rice',
        area: Number(f.area || 0),
        parcels
      }
    })

    const tracksToUpload = uploadedFiles.value.map(f => ({
      name: f.name,
      points: f.points,
      color: f.color,
      center: f.center,
      pointCount: f.pointCount,
      visible: f.visible !== false,
      areaKm2: f.areaKm2,
      areaHectares: f.areaHectares,
      areaMethod: f.areaMethod,
      isEnclosed: f.isEnclosed
    }))

    const res = await fetch(`${API_BASE}/gis/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        farmers: farmersToUpload,
        gpx_tracks: tracksToUpload
      })
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const result = await res.json()

    if (result.code === 200) {
      syncStatus.value = 'synced'
      syncStatusText.value = `In sync (${farmersToUpload.length} farmers, ${tracksToUpload.length} tracks)`
      lastSyncTime.value = new Date().toLocaleTimeString()
      if (!silent) {
        success(isInitialMigration ? 'Local GIS data synced to server!' : 'All GIS data saved to server!')
      }
    } else {
      throw new Error(result.message || 'Sync failed')
    }
  } catch (err) {
    console.error('Failed to sync GIS data with server:', err)
    syncStatus.value = 'offline'
    syncStatusText.value = 'Local only (Server unreachable)'
    if (!silent) {
      warning('Data saved locally. Server unreachable.')
    }
  }
}

onMounted(async () => {
  initMap()
  loadSampleData()
  loadSavedGpxTracks()
  await fetchGisDataFromServer(false)
})

onBeforeUnmount(() => {
  if (farmerLayerGroup) {
    farmerLayerGroup.clearLayers()
    farmerLayerGroup = null
  }
  if (gpxTracksLayerGroup) {
    gpxTracksLayerGroup.clearLayers()
    gpxTracksLayerGroup = null
  }
  if (drawnLayerGroup) {
    drawnLayerGroup.clearLayers()
    drawnLayerGroup = null
  }
  if (boundaryLayer && map) {
    map.removeLayer(boundaryLayer)
    boundaryLayer = null
  }
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

.boundary-indicator {
  color: var(--brand-700, #15803d);
  font-weight: 700;
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

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.modal-counter-badge {
  font-size: 0.72rem;
  font-weight: 600;
  background: var(--bg-muted);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 12px;
}

.modal-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background: var(--bg-muted);
}

.modal-footer-split {
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.modal-nav-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.nav-count-pill {
  font-size: 0.75rem;
  font-family: var(--font-mono, monospace);
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0 4px;
}

.modal-action-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
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

/* Sync Header Pill & Controls */
.sync-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  background: var(--bg-muted);
  border: 1px solid var(--border);
  padding: 0.28rem 0.6rem;
  border-radius: 20px;
  color: var(--text-secondary);
  transition: all 180ms ease;
}

.sync-pill.sync-synced {
  border-color: rgba(46, 125, 50, 0.3);
  background: rgba(46, 125, 50, 0.08);
}

.sync-pill.sync-syncing {
  border-color: rgba(237, 137, 54, 0.3);
  background: rgba(237, 137, 54, 0.08);
}

.sync-pill.sync-offline {
  border-color: var(--border);
  opacity: 0.85;
}

.sync-pill.sync-error {
  border-color: rgba(211, 47, 47, 0.3);
  background: rgba(211, 47, 47, 0.08);
}

.sync-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.btn-sync-action {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px;
  margin-left: 2px;
  border-radius: 4px;
  transition: color 150ms ease, background 150ms ease;
}

.btn-sync-action:hover:not(:disabled) {
  color: var(--brand-600);
  background: rgba(0, 0, 0, 0.05);
}

.btn-sync-icon {
  width: 13px;
  height: 13px;
}

.rotating-icon {
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* Sidebar Cloud Sync Card */
.sync-card-block {
  background: var(--bg-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.sync-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.sync-status-indicator {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.76rem;
  font-weight: 600;
}

.sync-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9e9e9e;
}

.indicator-synced .sync-status-dot { background: #2e7d32; box-shadow: 0 0 6px rgba(46, 125, 50, 0.5); }
.indicator-synced .sync-status-title { color: #2e7d32; }

.indicator-syncing .sync-status-dot { background: #ed8936; animation: pulse 1s infinite; }
.indicator-syncing .sync-status-title { color: #c05621; }

.indicator-offline .sync-status-dot { background: #757575; }
.indicator-offline .sync-status-title { color: var(--text-muted); }

.indicator-error .sync-status-dot { background: #d32f2f; }
.indicator-error .sync-status-title { color: #d32f2f; }

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
  100% { opacity: 1; transform: scale(1); }
}

.sync-timestamp {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.sync-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

/* Leaflet Marker Reset - prevents marker drift when zooming in/out */
:deep(.leaflet-marker-icon),
:deep(.leaflet-div-icon),
:deep(.custom-farmer-marker),
:deep(.custom-track-marker),
:deep(.custom-draw-marker),
:deep(.custom-area-label),
:deep(.farmer-marker-icon),
:deep(.track-marker),
:deep(.draw-marker-icon),
:deep(.area-label) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0;
  box-sizing: border-box !important;
}

:deep(.leaflet-pane img) {
  max-width: none !important;
  max-height: none !important;
}

:deep(.leaflet-tile-container img) {
  max-width: none !important;
  max-height: none !important;
}

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
