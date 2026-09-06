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
            @click="fetchGisDataFromServer(true)"
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
                <Location20 class="item-inline-icon" /> Barangay:
              </label>
              <select 
                id="searchLocationSelect" 
                v-model="searchLocationFilter" 
                class="field-control-sm"
                @change="searchFarm"
              >
                <option v-for="loc in availableLocations" :key="loc" :value="loc">
                  {{ loc === 'All' ? 'All Barangays' : loc }}
                </option>
              </select>
            </div>

            <!-- Jump to Coordinate (Lat, Long) Search -->
            <div class="jump-coord-box">
              <div class="jump-coord-header">
                <span class="jump-coord-title">
                  <Location20 class="item-inline-icon" /> Jump to Coordinate
                </span>
                <button
                  v-if="jumpPinActive"
                  type="button"
                  class="btn-clear-pin"
                  @click="clearJumpPin"
                  title="Remove target pin from map"
                >
                  ✕ Clear Pin
                </button>
              </div>
              <div class="jump-coord-fields">
                <input
                  v-model="jumpCoords"
                  type="text"
                  class="field-control-sm font-mono"
                  placeholder="e.g. 17.9240,121.7034"
                  @keyup.enter="jumpToCoordinates()"
                />
                <button
                  type="button"
                  class="btn btn-primary btn-sm btn-jump-go"
                  @click="jumpToCoordinates()"
                  title="Jump to specified coordinates"
                >
                  <Location20 class="btn-icon" />
                  <span>Go</span>
                </button>
              </div>
            </div>

            <!-- Search Results List -->
            <RecycleScroller
              v-if="searchResults.length > 0"
              class="search-results-list"
              :items="searchResults"
              :item-size="116"
              key-field="_key"
              v-slot="{ item: result, index }"
            >
              <div
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
                  <Location20 class="item-inline-icon" /> {{ resolveFarmerBarangay(result) }}
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
            </RecycleScroller>
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
            </div>

            <div>
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
                  <span class="sub-section-title">
                    <Document20 class="section-icon" /> Uploaded Files ({{ gpxSearchQuery ? filteredUploadedFiles.length + ' / ' + uploadedFiles.length : uploadedFiles.length }})
                  </span>
                  <div class="bulk-btns">
                    <button type="button" class="btn btn-sm btn-secondary" @click="showAllFiles" title="Show all on map">
                      <View20 class="btn-icon" />
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary" @click="hideAllFiles" title="Hide all from map">
                      <ViewOff20 class="btn-icon" />
                    </button>
<!--   
                    <button type="button" class="btn btn-sm btn-danger" @click="removeAllFiles" title="Clear list">
                      <TrashCan16 />
                    </button> -->

                    <button 
                      type="button" 
                      class="btn-text-toggle" 
                      @click="uploadedFilesCollapsed = !uploadedFilesCollapsed"
                    >
                      {{ uploadedFilesCollapsed ? 'Show ▼' : 'Hide ▲' }}
                    </button>
                  </div>
                </div>

                <!-- Filter Search Input for Uploaded Files -->
                <div v-show="!uploadedFilesCollapsed" class="filter-row-sm" style="margin-bottom: 0.45rem;">
                  <div class="search-input-wrapper">
                    <input
                      v-model="gpxSearchQuery"
                      type="text"
                      class="field-control-sm"
                      placeholder="Filter uploaded GPX files by name, farmer, crop..."
                    />
                    <button
                      v-if="gpxSearchQuery"
                      type="button"
                      class="btn-clear-inline"
                      title="Clear filter"
                      @click="gpxSearchQuery = ''"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <RecycleScroller
                  v-show="!uploadedFilesCollapsed && filteredUploadedFiles.length > 0"
                  :key="'gpx-scroller-' + gpxListRevision + '-' + filteredUploadedFiles.length + '-' + gpxSearchQuery"
                  class="gpx-file-cards-list"
                  :items="filteredUploadedFiles"
                  :item-size="118"
                  key-field="name"
                  v-slot="{ item: file }"
                >
                  <div
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
                        <button type="button" class="btn btn-sm btn-primary" title="Zoom to track" @click="fitToFile(file)">
                          <Location20 class="btn-icon" />
                        </button>
                        <button 
                          type="button" 
                          class="btn btn-sm btn-secondary" 
                          :title="file.visible ? 'Hide from map' : 'Show on map'" 
                          @click="toggleFileVisibility(file)"
                        >
                          <View20 v-if="file.visible" class="btn-icon" />
                          <ViewOff20 v-else class="btn-icon" />
                        </button>
                        <button type="button" class="btn btn-sm btn-danger" title="Remove from list" @click="removeFile(file)">
                          <TrashCan16 />
                        </button>
                      </div>
                    </div>
                  </div>
                </RecycleScroller>

                <div v-if="filteredUploadedFiles.length === 0 && !uploadedFilesCollapsed" class="no-search-results">
                  No uploaded files match "{{ gpxSearchQuery }}".
                </div>
              </div>
            </div>
          </section>


          <!-- 4. Registered Farmers List -->
          <section class="panel-section">
            <div class="section-head">
              <div class="section-title">
                <span class="icon-label"><UserProfile20 class="section-icon" /> Farmers ({{ filteredFarmers.length }}<template v-if="filteredFarmers.length !== farmers.length"> / {{ farmers.length }}</template>)</span>
              </div>
            </div>

            <!-- Farmer Search Input -->
            <div class="filter-row-sm">
              <label class="field-label-sm" for="farmerSearchInput">Search:</label>
              <div class="search-input-wrapper">
                <input 
                  id="farmerSearchInput"
                  v-model="farmerSearchQuery" 
                  type="text" 
                  class="field-control-sm" 
                  placeholder="Filter by name, address, parcel..." 
                />
                <button 
                  v-if="farmerSearchQuery" 
                  type="button" 
                  class="btn-clear-inline" 
                  title="Clear search" 
                  @click="farmerSearchQuery = ''"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Sort & Commodity Filter Grid -->
            <div class="filter-grid-2col" style="margin-top: 0.4rem;">
              <div class="filter-col">
                <label class="field-label-sm" for="farmerSortSelect">Sort:</label>
                <select id="farmerSortSelect" v-model="farmerSortOrder" class="field-control-sm">
                  <option value="asc">Name (A → Z)</option>
                  <option value="desc">Name (Z → A)</option>
                  <option value="area-desc">Area (High → Low)</option>
                  <option value="area-asc">Area (Low → High)</option>
                  <option value="default">Default Order</option>
                </select>
              </div>

              <div class="filter-col">
                <label class="field-label-sm" for="filterCommoditySelect">Commodity:</label>
                <select id="filterCommoditySelect" v-model="commodityFilter" class="field-control-sm">
                  <option value="All">All Commodities</option>
                  <option value="Rice">Rice</option>
                  <option value="Corn">Corn</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Tobacco">Tobacco</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <!-- Location Filter Dropdown -->
            <div class="filter-row-sm" style="margin-top: 0.4rem;">
              <label class="field-label-sm" for="farmerLocationFilterSelect">Barangay:</label>
              <select id="farmerLocationFilterSelect" v-model="farmerLocationFilter" class="field-control-sm">
                <option v-for="loc in availableLocations" :key="loc" :value="loc">
                  {{ loc === 'All' ? 'All Barangays' : loc }}
                </option>
              </select>
            </div>

            <RecycleScroller
              v-if="filteredFarmers.length > 0"
              :key="'farmers-scroller-' + farmersListRevision + '-' + filteredFarmers.length"
              class="farmers-list-container"
              :items="filteredFarmers"
              :item-size="134"
              key-field="name"
              v-slot="{ item: farmer }"
            >
              <div class="farmer-card-item">
                <div class="farmer-card-header">
                  <strong class="farmer-title truncate">{{ farmer.name }}</strong>
                  <span class="badge badge-success">{{ fmt4(farmer.area) }} ha</span>
                </div>
                <div class="farmer-card-location">
                  <Location20 class="item-inline-icon" /> {{ resolveFarmerBarangay(farmer) }}
                </div>
                <div class="farmer-badges-row">
                  <span
                    v-for="comm in resolveFarmerCommodities(farmer)"
                    :key="comm"
                    class="commodity-tag"
                    :class="'commodity-' + (comm || 'other').toLowerCase()"
                  >
                    {{ comm }}
                  </span>
                  <span class="badge badge-neutral">
                    {{ farmer.parcels ? farmer.parcels.length : 1 }} parcel(s)
                  </span>
                </div>
                <div class="farmer-card-actions">
                  <button type="button" class="btn btn-sm btn-primary" title="Fly to farmer" @click="locateFarmer(farmer)">
                    <Location20 class="btn-icon" /> Locate
                  </button>
                  <button type="button" class="btn btn-sm btn-secondary" title="Edit farmer parcels" @click="editFarmer(farmer)">
                    <Edit20 class="btn-icon" /> Edit
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" title="Delete farmer" @click="removeFarmer(farmer)">
                    <TrashCan16 />
                  </button>
                </div>
              </div>
            </RecycleScroller>

            <div v-else class="no-search-results">
              {{ farmers.length === 0 ? 'No farmers registered yet.' : 'No farmers match the selected filters.' }}
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
                  @click="uploadAllLocalToServer(true)"
                >
                  <Upload20 class="btn-icon" />
                  <span>Upload to Server</span>
                </button>
                <button 
                  type="button" 
                  class="btn btn-secondary btn-sm" 
                  :disabled="syncStatus === 'syncing'" 
                  title="Pull latest incremental changes from server"
                  @click="fetchGisDataFromServer(true)"
                >
                  <Reset20 class="btn-icon" :class="{ 'rotating-icon': syncStatus === 'syncing' }" />
                  <span>Pull Changes</span>
                </button>
              </div>
              <div style="margin-top: 0.5rem; text-align: right;">
                <button
                  type="button"
                  class="btn-link-action font-mono"
                  style="font-size: 11px; color: var(--text-muted); background: none; border: none; cursor: pointer; text-decoration: underline;"
                  :disabled="syncStatus === 'syncing'"
                  title="Force download full baseline dataset from server"
                  @click="fetchGisDataFromServer(true, false, true)"
                >
                  Force Full Refresh
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
              <div class="overlap-export-box">
                <div class="overlap-threshold-row">
                  <label class="field-label-xs">Detection Mode:</label>
                  <select v-model.number="overlapScanThreshold" class="field-control-xs" :disabled="isGeneratingOverlapReport">
                    <option :value="30">⚡ Duplicates & Major (≥30%)</option>
                    <option :value="90">🎯 Strict Duplicates (≥90%)</option>
                    <option :value="1">🔍 All Overlaps (≥1%)</option>
                  </select>
                </div>
                <button 
                  type="button" 
                  class="btn btn-secondary btn-sm btn-block" 
                  :disabled="isGeneratingOverlapReport || uploadedFiles.length < 2" 
                  :title="uploadedFiles.length < 2 ? 'At least 2 GPX tracks are required to analyze overlaps' : 'Analyze and export overlapping GPX tracks report'"
                  @click="exportOverlapReportCSV"
                >
                  <DocumentExport20 class="btn-icon" />
                  <span>{{ isGeneratingOverlapReport ? `Analyzing Overlaps (${overlapProgress}%)...` : 'Export Duplicate / Overlap Report (CSV)' }}</span>
                </button>
              </div>
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

        <!-- Initial Data Loading Overlay -->
        <Transition name="fade-loading">
          <div v-if="isInitialLoading" class="map-loading-overlay">
            <div class="loading-card">
              <div class="loading-spinner-ring"></div>
              <div class="loading-title">Preparing Farm Area GIS</div>
              <div class="loading-detail">{{ loadingMessage }}</div>
            </div>
          </div>
        </Transition>

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
          <button type="button" class="map-tool-btn" :title="'Base layer: ' + currentLayer" @click="toggleLayer">
            <Map20 />
          </button>
          <button 
            type="button" 
            class="map-tool-btn" 
            :class="{ active: parcelPolygonsVisible }" 
            :title="parcelPolygonsVisible ? 'Hide Parcel Polygons' : 'Show Parcel Polygons'" 
            @click="toggleParcelPolygons"
          >
            <AreaCustom20 />
          </button>
          <button 
            type="button" 
            class="map-tool-btn" 
            :class="{ active: farmerMarkersVisible }" 
            :title="farmerMarkersVisible ? 'Hide Farmer Pin Markers' : 'Show Farmer Pin Markers'" 
            @click="toggleFarmerMarkers"
          >
            <UserProfile20 />
          </button>
          <button 
            type="button" 
            class="map-tool-btn" 
            :class="{ active: gpxMarkersVisible }" 
            :title="gpxMarkersVisible ? 'Hide GPX Track Endpoint Markers (Performance)' : 'Show GPX Track Endpoint Markers'" 
            @click="toggleGpxMarkers"
          >
            <Location20 />
          </button>
          <button 
            type="button" 
            class="map-tool-btn" 
            :class="{ active: commodityPolygonsVisible, loading: isCommodityLoading }" 
            :title="isCommodityLoading ? 'Loading Commodity Polygons...' : (commodityPolygonsVisible ? 'Hide Rice & Corn Polygons' : 'Show Rice & Corn Polygons (Commodity Types)')" 
            @click="toggleCommodityPolygons"
          >
            <Time20 v-if="isCommodityLoading" class="rotating-icon" />
            <Wheat20 v-else />
          </button>
        </div>

        <!-- Floating Commodity Map Legend -->
        <!-- <Transition name="fade-loading">
          <div v-if="commodityPolygonsVisible" class="map-floating-legend">
            <div class="legend-header">
              <span class="legend-title"><Wheat20 class="legend-header-icon" /> Commodity Layer</span>
              <span class="legend-count">{{ commodityFeaturesCount }} types</span>
            </div>
            <div class="legend-items">
              <div class="legend-item" title="Corn commodity polygons (EPSG:32651 converted)">
                <span class="legend-color-box legend-color-corn"></span>
                <span class="legend-label">Corn</span>
              </div>
              <div class="legend-item" title="Rice commodity polygons (EPSG:32651 converted)">
                <span class="legend-color-box legend-color-rice"></span>
                <span class="legend-label">Rice</span>
              </div>
            </div>
          </div>
        </Transition> -->

        <!-- Bottom Map Status Bar -->
        <div class="map-status-pill">
          <span>Zoom: {{ currentZoom }}</span>
          <span><Location20 class="item-inline-icon" /> {{ centerLat.toFixed(4) }}, {{ centerLng.toFixed(4) }}</span>
          <span><UserProfile20 class="item-inline-icon" /> {{ farmers.length }} farmers</span>
          <span><Document20 class="item-inline-icon" /> {{ uploadedFiles.length }} GPX</span>
          <span v-if="boundaryVisible" class="boundary-indicator" title="Alcala Municipal Boundary Layer Loaded">
            <MapBoundary20 class="item-inline-icon" /> Boundary Active
          </span>
          <span v-if="commodityPolygonsVisible" class="commodity-indicator" title="Rice & Corn Commodity Layer Active">
            <Wheat20 class="item-inline-icon" /> Commodity Layer
          </span>
          <span v-if="!parcelPolygonsVisible" class="muted-indicator" title="Parcel Polygons are hidden">
            Parcels: Hidden
          </span>
          <span v-if="!farmerMarkersVisible" class="muted-indicator" title="Farmer Pin Markers are hidden">
            Pins: Hidden
          </span>
          <span v-if="gpxMarkersVisible" class="boundary-indicator" title="GPX Track Endpoint Markers are visible">
            GPX Pins: Active
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
              <tr><th>Barangay</th><td>{{ resolveFarmerBarangay(searchInfoItem.data) }}</td></tr>
              <tr>
                <th>Commodity</th>
                <td>
                  <div style="display:flex; flex-wrap:wrap; gap:4px;">
                    <span 
                      v-for="comm in resolveFarmerCommodities(searchInfoItem.data)" 
                      :key="comm"
                      class="commodity-tag"
                      :class="'commodity-' + (comm || 'other').toLowerCase()"
                    >
                      {{ comm }}
                    </span>
                  </div>
                </td>
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
                    <div v-for="(p, i) in searchInfoItem.data.parcels" :key="i" class="parcel-sub-row font-mono" style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
                      <div>
                        <strong>#{{ i + 1 }}</strong> · {{ fmt4(p.area) }} ha · {{ p.coords || 'no coords' }}
                      </div>
                      <span 
                        v-if="p.commodity || (p.coords && getCommodityFromCoordinates(Number(p.coords.split(',')[0]), Number(p.coords.split(',')[1])))" 
                        class="commodity-tag"
                        :class="'commodity-' + ((p.commodity || getCommodityFromCoordinates(Number(p.coords.split(',')[0]), Number(p.coords.split(',')[1]))) || 'other').toLowerCase()"
                        style="font-size:10px;padding:1px 6px;"
                      >
                        {{ p.commodity || getCommodityFromCoordinates(Number(p.coords.split(',')[0]), Number(p.coords.split(',')[1])) }}
                      </span>
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
            <label class="field-label-sm">Farmer Address</label>
            <input v-model="editingFarmer.address" type="text" class="field-control-sm" placeholder="e.g. Purok / Sitio, Barangay" />
          </div>

          <div class="form-row-sm">
            <label class="field-label-sm">Barangay</label>
            <input v-model="editingFarmer.location" type="text" class="field-control-sm" placeholder="e.g. Baybayog" list="alcalaBarangayDatalist" />
            <datalist id="alcalaBarangayDatalist">
              <option v-for="b in alcalaBarangays" :key="b" :value="b" />
            </datalist>
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
                  <div style="display: flex; align-items: center; gap: 0.4rem; max-width: 80%;">
                    <span>Parcel #{{ pIdx + 1 }}</span>
                    <span 
                      v-if="parcel.gpxFileName" 
                      class="badge badge-success font-mono" 
                      style="font-size: 10px; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" 
                      :title="'Associated track: ' + parcel.gpxFileName"
                    >
                      <Document20 class="item-inline-icon" /> {{ parcel.gpxFileName }}
                    </span>
                  </div>
                  <button type="button" class="btn-remove-parcel" title="Delete this parcel and associated GPX track" @click="removeParcel(editingFarmer, pIdx)">
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
          <button type="button" class="btn btn-primary btn-sm" :disabled="isSavingFarmer" @click="saveFarmerEdit">
            <Time20 v-if="isSavingFarmer" class="btn-icon rotating-icon" />
            <span>{{ isSavingFarmer ? 'Saving...' : 'Save Changes' }}</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" :disabled="isSavingFarmer" @click="editingFarmer = null">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Overlap Report Progress Modal -->
    <Transition name="fade-loading">
      <div v-if="isGeneratingOverlapReport" class="modal-overlay report-loading-overlay">
        <div class="loading-card report-loading-card">
          <div class="loading-spinner-ring"></div>
          <div class="loading-title">Analyzing GPX Overlaps</div>
          <div class="loading-subtitle">{{ overlapStatusMessage }}</div>

          <!-- Animated Progress Bar -->
          <div class="report-progress-bar-wrap">
            <div class="report-progress-bar-fill" :style="{ width: overlapProgress + '%' }"></div>
          </div>
          <div class="report-progress-pct">{{ overlapProgress }}%</div>

          <!-- Live Metrics Grid -->
          <div class="report-metrics-grid">
            <div class="metric-item">
              <span class="metric-val">{{ overlapMetrics.polygons }}</span>
              <span class="metric-lbl">Polygons</span>
            </div>
            <div class="metric-item">
              <span class="metric-val">{{ overlapMetrics.candidates }}</span>
              <span class="metric-lbl">Candidate Pairs</span>
            </div>
            <div class="metric-item">
              <span class="metric-val">{{ overlapMetrics.matches }}</span>
              <span class="metric-lbl">Overlaps Found</span>
            </div>
          </div>

          <!-- Cancel Action -->
          <div class="report-modal-actions">
            <button type="button" class="btn btn-secondary btn-sm" @click="cancelOverlapReport">
              Cancel Export
            </button>
          </div>
        </div>
      </div>
    </Transition>
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
  AreaCustom20,
  CheckmarkFilled20,
  ErrorFilled20,
  Time20,
  WarningFilled20,
  Wheat20,
} from '@carbon/icons-vue'
import { useToast } from '@/composables/useToast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { downloadZip } from 'client-zip'
import proj4 from 'proj4'
import alcalaBoundaryRaw from '@/assets/AlcalaBoundary.json'
import { generateGpxOverlapReport } from '@/utils/gpxOverlapService'

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

// Point-in-polygon ray casting algorithm
function isPointInPolygon(point, vs) {
  const x = point[0], y = point[1] // [lng, lat]
  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1]
    const xj = vs[j][0], yj = vs[j][1]
    const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

// Reverse-geocode coordinates to Barangay from AlcalaBoundary GeoJSON
function getBarangayFromCoordinates(lat, lng) {
  if (lat == null || lng == null) return null
  const numLat = Number(lat)
  const numLng = Number(lng)
  if (isNaN(numLat) || isNaN(numLng)) return null
  const pt = [numLng, numLat] // [lng, lat]

  for (const feature of (alcalaBoundaryGeoJson.features || [])) {
    if (!feature.geometry) continue
    const { type, coordinates } = feature.geometry
    if (type === 'Polygon' && Array.isArray(coordinates)) {
      if (isPointInPolygon(pt, coordinates[0])) {
        return feature.properties && feature.properties.ADM4_EN
      }
    } else if (type === 'MultiPolygon' && Array.isArray(coordinates)) {
      for (const poly of coordinates) {
        if (Array.isArray(poly) && isPointInPolygon(pt, poly[0])) {
          return feature.properties && feature.properties.ADM4_EN
        }
      }
    }
  }
  return null
}

// Spatial Index and Commodity matching for Rice and Corn polygons
let commoditySpatialIndex = null
let isBuildingCommodityIndex = false

function buildCommoditySpatialIndex(geojson) {
  if (!geojson || !Array.isArray(geojson.features)) return []
  const rings = []
  
  function processPolygon(polyCoords, comm) {
    if (!polyCoords || !polyCoords[0]) return
    const exterior = polyCoords[0]
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (let i = 0; i < exterior.length; i++) {
      const pt = exterior[i]
      const x = pt[0], y = pt[1]
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
    rings.push({ bbox: [minX, minY, maxX, maxY], ring: exterior, commodity: comm })
  }

  for (const f of geojson.features) {
    const comm = f.properties && f.properties.Commodity
    if (!comm || !f.geometry || !f.geometry.coordinates) continue
    const geomType = f.geometry.type
    if (geomType === 'Polygon') {
      processPolygon(f.geometry.coordinates, comm)
    } else if (geomType === 'MultiPolygon') {
      for (const poly of f.geometry.coordinates) {
        processPolygon(poly, comm)
      }
    }
  }
  return rings
}

async function ensureCommoditySpatialIndex() {
  if (commoditySpatialIndex) return commoditySpatialIndex
  if (isBuildingCommodityIndex) {
    while (isBuildingCommodityIndex) {
      await new Promise(r => setTimeout(r, 50))
    }
    return commoditySpatialIndex
  }
  isBuildingCommodityIndex = true
  try {
    const geojson = await loadCommodityGeoJson()
    commoditySpatialIndex = buildCommoditySpatialIndex(geojson)
  } catch (err) {
    console.warn('Could not build commodity spatial index:', err)
  } finally {
    isBuildingCommodityIndex = false
  }
  return commoditySpatialIndex
}

// Find commodity (e.g. Rice or Corn) from point coordinates [lat, lng]
function getCommodityFromCoordinates(lat, lng) {
  if (!commoditySpatialIndex || lat == null || lng == null) return null
  const numLat = Number(lat)
  const numLng = Number(lng)
  if (isNaN(numLat) || isNaN(numLng)) return null
  const pt = [numLng, numLat] // [lng, lat]

  for (let i = 0; i < commoditySpatialIndex.length; i++) {
    const entry = commoditySpatialIndex[i]
    const b = entry.bbox
    if (pt[0] < b[0] || pt[0] > b[2] || pt[1] < b[1] || pt[1] > b[3]) continue
    if (isPointInPolygon(pt, entry.ring)) {
      return entry.commodity
    }
  }
  return null
}

// Resolve list of commodity types for a farmer based on their parcel coordinates (with caching)
function resolveFarmerCommodities(farmer) {
  if (!farmer) return ['Rice']
  if (Array.isArray(farmer._cachedCommodities) && farmer._cachedCommodities.length > 0) {
    return farmer._cachedCommodities
  }
  const matched = new Set()

  if (Array.isArray(farmer.parcels) && farmer.parcels.length > 0) {
    for (const p of farmer.parcels) {
      if (p.commodity) {
        matched.add(p.commodity)
      } else if (p.coords) {
        const [lat, lng] = p.coords.split(',').map(Number)
        const comm = getCommodityFromCoordinates(lat, lng)
        if (comm) {
          p.commodity = comm
          matched.add(comm)
        }
      }
    }
  }

  if (matched.size === 0 && farmer.coords) {
    const [lat, lng] = farmer.coords.split(',').map(Number)
    const comm = getCommodityFromCoordinates(lat, lng)
    if (comm) matched.add(comm)
  }

  if (matched.size === 0) {
    if (farmer.commodity) {
      const parts = String(farmer.commodity).split(/[,;/]+/).map(s => s.trim()).filter(Boolean)
      if (parts.length > 0) {
        parts.forEach(c => matched.add(c))
      } else {
        matched.add(farmer.commodity)
      }
    } else {
      matched.add('Rice')
    }
  }

  const result = Array.from(matched)
  farmer._cachedCommodities = result
  return result
}

function resolveFarmerBarangay(farmer) {
  if (!farmer) return 'Alcala'
  if (farmer._cachedBarangay) return farmer._cachedBarangay

  let resolved = null
  // 1. Try to detect from parcel coordinates
  if (farmer.parcels && farmer.parcels.length > 0) {
    for (const p of farmer.parcels) {
      if (p.coords) {
        const [lat, lng] = p.coords.split(',').map(Number)
        const brgy = getBarangayFromCoordinates(lat, lng)
        if (brgy) {
          resolved = brgy
          break
        }
      }
    }
  }
  if (!resolved && farmer.coords) {
    const [lat, lng] = farmer.coords.split(',').map(Number)
    const brgy = getBarangayFromCoordinates(lat, lng)
    if (brgy) resolved = brgy
  }
  // 2. Clean location field if it has "Brgy. Baybayog, Alcala, Cagayan" -> "Baybayog"
  if (!resolved && farmer.location) {
    let loc = String(farmer.location).trim()
    loc = loc.replace(/,.*$/, '').replace(/^(BRGY\.?|BARANGAY)\s*/i, '').trim()
    if (loc && loc.toUpperCase() !== 'ALCALA' && loc.toUpperCase() !== 'CAGAYAN') {
      resolved = loc
    }
  }
  if (!resolved) resolved = farmer.location || 'Alcala'
  farmer._cachedBarangay = resolved
  return resolved
}

function resolveGpxBarangay(fileName, center) {
  if (center && center.lat && center.lng) {
    const brgy = getBarangayFromCoordinates(center.lat, center.lng)
    if (brgy) return brgy
  }
  const matchingFarmer = getMatchingFarmerForGpx(fileName, center)
  if (matchingFarmer) {
    return resolveFarmerBarangay(matchingFarmer)
  }
  const loc = deriveLocationFromGPX(fileName)
  if (loc) {
    let clean = loc.replace(/,.*$/, '').replace(/^(BRGY\.?|BARANGAY)\s*/i, '').trim()
    if (clean && clean.toUpperCase() !== 'ALCALA') return clean
  }
  return 'Alcala'
}

const alcalaBarangays = computed(() => {
  const brgyList = (alcalaBoundaryGeoJson.features || [])
    .map(f => f.properties && f.properties.ADM4_EN)
    .filter(Boolean)
  return Array.from(new Set(brgyList)).sort()
})

const { success, warning, error, info } = useToast()
const { confirm } = useConfirmDialog()

// State
const mapContainer = ref(null)
let map = null
let farmerLayerGroup = null
let gpxTracksLayerGroup = null
let gpxMarkersLayerGroup = null

const sidebarCollapsed = ref(false)
const uploadedFilesCollapsed = ref(true)
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
  const locSet = new Set(alcalaBarangays.value)
  farmers.value.forEach(f => {
    const b = resolveFarmerBarangay(f)
    if (b) locSet.add(b)
  })
  return ['All', ...Array.from(locSet).sort()]
})

const isDragOver = ref(false)
const gpxFileInput = ref(null)
const uploadedFiles = ref([])
const gpxSearchQuery = ref('')
const uploadProgress = ref([])
const pendingDuplicateFile = ref(null)
const isGeneratingOverlapReport = ref(false)
const overlapProgress = ref(0)
const overlapScanThreshold = ref(30)
const overlapStatusMessage = ref('Preparing field polygons...')
const overlapMetrics = ref({
  polygons: 0,
  candidates: 0,
  matches: 0
})
let overlapAbortController = null

function cancelOverlapReport() {
  if (overlapAbortController) {
    overlapAbortController.abort()
  }
}

const farmers = ref([])
const newFarmer = ref({ name: '', location: '', area: '', coords: '', commodity: 'Rice' })
const autoPopulatedArea = ref(null)
const farmerSearchQuery = ref('')
const farmerSortOrder = ref('asc') // 'asc' | 'desc' | 'area-desc' | 'area-asc' | 'default'
const commodityFilter = ref('All')
const farmerLocationFilter = ref('All')

const editingFarmer = ref(null)
const editingIndex = ref(-1)
const isSavingFarmer = ref(false)
const isDeletingGpx = ref(false)
const isDeletingFarmer = ref(false)
const gpxListRevision = ref(0)
const farmersListRevision = ref(0)

const parcelPolygonsVisible = ref(false)
const farmerMarkersVisible = ref(true)
const gpxMarkersVisible = ref(false)

const boundaryVisible = ref(true)
let boundaryLayer = null

const commodityPolygonsVisible = ref(false)
const isCommodityLoading = ref(false)
const commodityFeaturesCount = ref(2)
let commodityLayer = null
let commodityGeoJsonCache = null

const farmerMarkers = []

const baseLayers = {}
const currentLayer = ref('terrain')

const statusMessage = ref('Ready')
const statusType = ref('info')

const isInitialLoading = ref(false)
const loadingMessage = ref('')

const ALCALA_CENTER = [17.9021, 121.6560]
const STORAGE_KEY_FARMERS = 'farm_area_gis_farmers'
const STORAGE_KEY_GPX_TRACKS = 'farm_area_gis_gpx_tracks'
const GIS_IDB_DB_NAME = 'farm_area_gis_db'
const GIS_IDB_STORE_NAME = 'gis_store'

function yieldToMain() {
  return new Promise(resolve => {
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => resolve(), { timeout: 16 })
    } else {
      setTimeout(resolve, 0)
    }
  })
}

function toCleanJson(val) {
  if (val === null || val === undefined) return val
  try {
    return JSON.parse(JSON.stringify(val, (k, v) => {
      if (k === 'layer' || k === 'startMarker' || k === 'endMarker' || k === '_leaflet_id' || k === '_farmerRef') {
        return undefined
      }
      return v
    }))
  } catch (e) {
    return null
  }
}

const openGisIDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'))
    }
    const req = indexedDB.open(GIS_IDB_DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(GIS_IDB_STORE_NAME)) {
        db.createObjectStore(GIS_IDB_STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

const setGisIDB = async (key, val, alreadyClean = false) => {
  try {
    const cleanVal = alreadyClean ? val : toCleanJson(val)
    if (cleanVal === null || cleanVal === undefined) return false

    const db = await openGisIDB()
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(GIS_IDB_STORE_NAME, 'readwrite')
        const store = tx.objectStore(GIS_IDB_STORE_NAME)
        store.put(cleanVal, key)
        tx.oncomplete = () => {
          try { db.close() } catch (_) {}
          resolve(true)
        }
        tx.onerror = (event) => {
          console.warn('IDB transaction error for ' + key, event)
          try { db.close() } catch (_) {}
          resolve(false)
        }
        tx.onabort = () => {
          try { db.close() } catch (_) {}
          resolve(false)
        }
      } catch (err) {
        console.warn('IDB put error for ' + key, err)
        try { db.close() } catch (_) {}
        resolve(false)
      }
    })
  } catch (e) {
    console.warn('IDB write error for key ' + key, e)
    return false
  }
}

const getGisIDB = async (key) => {
  try {
    const db = await openGisIDB()
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(GIS_IDB_STORE_NAME, 'readonly')
        const req = tx.objectStore(GIS_IDB_STORE_NAME).get(key)
        req.onsuccess = () => {
          try { db.close() } catch (_) {}
          resolve(req.result)
        }
        req.onerror = () => {
          try { db.close() } catch (_) {}
          resolve(null)
        }
      } catch (err) {
        console.warn('IDB get error for ' + key, err)
        try { db.close() } catch (_) {}
        resolve(null)
      }
    })
  } catch (e) {
    console.warn('IDB read error for key ' + key, e)
    return null
  }
}

async function saveGisStorageData(key, data) {
  if (data === null || data === undefined) return
  // For large array datasets (GPX tracks), skip the expensive toCleanJson
  // (JSON.parse(JSON.stringify()) on 40MB+ crashes) and write directly to IDB.
  // Also skip localStorage entirely for large arrays (5MB quota limit).
  const isLargeArray = Array.isArray(data) && data.length > 500
  const cleanData = isLargeArray ? data : toCleanJson(data)
  if (cleanData === null || cleanData === undefined) return

  // Write to IndexedDB (pass alreadyClean flag to avoid double-cleaning)
  await setGisIDB(key, cleanData, isLargeArray)

  // Only write to localStorage for small datasets (sync timestamp, small lists)
  // GPX tracks and large farmer lists exceed the 5MB localStorage quota
  if (!isLargeArray) {
    try {
      localStorage.setItem(key, JSON.stringify(cleanData))
    } catch (e) {
      try {
        localStorage.removeItem(key)
      } catch (_) {}
    }
  }
}

async function loadGisStorageData(key) {
  try {
    const idbData = await getGisIDB(key)
    if (idbData && (Array.isArray(idbData) ? idbData.length > 0 : true)) {
      return idbData
    }
  } catch (e) {
    console.warn(`Failed reading ${key} from IndexedDB:`, e)
  }

  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed) {
        setGisIDB(key, parsed).then(() => {
          try {
            localStorage.removeItem(key)
          } catch (_) {}
        })
        return parsed
      }
    }
  } catch (e) {
    console.warn(`Failed reading ${key} from localStorage:`, e)
  }

  return null
}

const STORAGE_KEY_DELETED_FARMERS = 'farm_area_gis_deleted_farmers'
const STORAGE_KEY_DELETED_GPX = 'farm_area_gis_deleted_gpx'
const STORAGE_KEY_LAST_SYNCED = 'farm_area_gis_last_synced_at'

const deletedFarmerNames = ref(new Set())
const deletedGpxNames = ref(new Set())
const lastSyncedTimestamp = ref(null)

async function loadDeletedKeys() {
  try {
    const dFarmers = await loadGisStorageData(STORAGE_KEY_DELETED_FARMERS)
    if (Array.isArray(dFarmers)) {
      deletedFarmerNames.value = new Set(dFarmers.map(n => String(n).trim().toUpperCase()))
    }
    const dGpx = await loadGisStorageData(STORAGE_KEY_DELETED_GPX)
    if (Array.isArray(dGpx)) {
      deletedGpxNames.value = new Set(dGpx.map(n => String(n).trim().toLowerCase()))
    }
  } catch (e) {}
}

async function markFarmerDeleted(name) {
  if (!name) return
  deletedFarmerNames.value.add(String(name).trim().toUpperCase())
  await saveGisStorageData(STORAGE_KEY_DELETED_FARMERS, Array.from(deletedFarmerNames.value))
}

async function unmarkFarmerDeleted(name) {
  if (!name) return
  const upper = String(name).trim().toUpperCase()
  if (deletedFarmerNames.value.has(upper)) {
    deletedFarmerNames.value.delete(upper)
    await saveGisStorageData(STORAGE_KEY_DELETED_FARMERS, Array.from(deletedFarmerNames.value))
  }
}

async function markGpxDeleted(name) {
  if (!name) return
  deletedGpxNames.value.add(String(name).trim().toLowerCase())
  await saveGisStorageData(STORAGE_KEY_DELETED_GPX, Array.from(deletedGpxNames.value))
}

async function unmarkGpxDeleted(name) {
  if (!name) return
  const lower = String(name).trim().toLowerCase()
  if (deletedGpxNames.value.has(lower)) {
    deletedGpxNames.value.delete(lower)
    await saveGisStorageData(STORAGE_KEY_DELETED_GPX, Array.from(deletedGpxNames.value))
  }
}

const API_BASE = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000'
const syncStatus = ref('idle') // 'idle' | 'syncing' | 'synced' | 'offline' | 'error'
const syncStatusText = ref('Cloud Ready')
const lastSyncTime = ref(null)

// Server REST API CRUD helpers
function getAuthHeaders(includeContentType = true) {
  const token = localStorage.getItem('token')
  return {
    ...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

async function apiFetchGisChanges(sinceTimestamp = null) {
  const url = sinceTimestamp
    ? `${API_BASE}/gis/changes?since=${encodeURIComponent(sinceTimestamp)}`
    : `${API_BASE}/gis/changes`
  const res = await fetch(url, {
    headers: getAuthHeaders(false)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

async function apiFetchGisVersion() {
  const res = await fetch(`${API_BASE}/gis/version`, {
    headers: getAuthHeaders(false)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

async function apiFetchAllGisData() {
  const res = await fetch(`${API_BASE}/gis/all`, {
    headers: getAuthHeaders(false)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

async function apiCreateFarmer(farmerData) {
  try {
    const res = await fetch(`${API_BASE}/gis/farmers`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(farmerData)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const result = await res.json()
    return result.data
  } catch (err) {
    console.warn('API create farmer error:', err)
    return null
  }
}

async function apiUpdateFarmer(idOrName, farmerData) {
  try {
    const target = encodeURIComponent(String(idOrName))
    const res = await fetch(`${API_BASE}/gis/farmers/${target}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(farmerData)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const result = await res.json()
    return result.data
  } catch (err) {
    console.warn('API update farmer error:', err)
    return null
  }
}

async function apiDeleteFarmer(idOrName) {
  try {
    const target = encodeURIComponent(String(idOrName))
    const res = await fetch(`${API_BASE}/gis/farmers/${target}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn('API delete farmer error:', err)
    return null
  }
}

async function apiCreateGpxTracks(tracksData) {
  try {
    const res = await fetch(`${API_BASE}/gis/gpx_tracks`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(tracksData)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const result = await res.json()
    return result.data
  } catch (err) {
    console.warn('API create GPX tracks error:', err)
    return null
  }
}

async function apiUpdateGpxTrack(idOrName, trackData) {
  try {
    const target = encodeURIComponent(String(idOrName))
    const res = await fetch(`${API_BASE}/gis/gpx_tracks/${target}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(trackData)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const result = await res.json()
    return result.data
  } catch (err) {
    console.warn('API update GPX track error:', err)
    return null
  }
}

async function apiDeleteGpxTrack(idOrName) {
  try {
    const target = encodeURIComponent(String(idOrName))
    const res = await fetch(`${API_BASE}/gis/gpx_tracks/${target}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn('API delete GPX track error:', err)
    return null
  }
}

async function apiClearAllGisData() {
  try {
    const res = await fetch(`${API_BASE}/gis/clear`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ clear_all: true })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn('API clear all GIS data error:', err)
    return null
  }
}

// Computed
const filteredFarmers = computed(() => {
  const query = farmerSearchQuery.value.trim().toLowerCase()
  const targetLoc = farmerLocationFilter.value.trim().toUpperCase()
  const targetComm = commodityFilter.value

  const list = farmers.value.filter(f => {
    // 1. Commodity filter (checks all resolved commodities across farmer's parcels)
    const farmerComms = resolveFarmerCommodities(f)
    const matchCommodity = targetComm === 'All' || 
      farmerComms.some(c => c.toLowerCase() === targetComm.toLowerCase()) || 
      (f.commodity && f.commodity.toLowerCase().includes(targetComm.toLowerCase()))

    // 2. Location filter
    const fBrgy = resolveFarmerBarangay(f).trim().toUpperCase()
    const matchLocation = targetLoc === 'ALL' || fBrgy === targetLoc || fBrgy.includes(targetLoc) || (f.location && f.location.toUpperCase().includes(targetLoc))

    // 3. Search query filter
    let matchQuery = true
    if (query) {
      const name = (f.name || '').toLowerCase()
      const address = (f.address || '').toLowerCase()
      const location = (f.location || '').toLowerCase()
      const commodity = (f.commodity || '').toLowerCase()
      const commsStr = farmerComms.join(' ').toLowerCase()
      const brgy = fBrgy.toLowerCase()
      const parcelCoords = (f.parcels || []).map(p => p.coords || '').join(' ').toLowerCase()
      matchQuery = name.includes(query) || 
                   address.includes(query) || 
                   location.includes(query) || 
                   commodity.includes(query) || 
                   commsStr.includes(query) ||
                   brgy.includes(query) ||
                   parcelCoords.includes(query)
    }

    return matchCommodity && matchLocation && matchQuery
  })

  // 4. Sort logic
  if (farmerSortOrder.value === 'asc') {
    return list.slice().sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }))
  } else if (farmerSortOrder.value === 'desc') {
    return list.slice().sort((a, b) => (b.name || '').localeCompare(a.name || '', undefined, { sensitivity: 'base' }))
  } else if (farmerSortOrder.value === 'area-desc') {
    return list.slice().sort((a, b) => (Number(b.area) || 0) - (Number(a.area) || 0))
  } else if (farmerSortOrder.value === 'area-asc') {
    return list.slice().sort((a, b) => (Number(a.area) || 0) - (Number(b.area) || 0))
  }

  return list
})

const filteredUploadedFiles = computed(() => {
  const q = gpxSearchQuery.value.trim().toLowerCase()
  if (!q) return uploadedFiles.value
  return uploadedFiles.value.filter(f => {
    const name = (f.name || '').toLowerCase()
    const farmerName = (f.farmerName || '').toLowerCase()
    const derivedName = deriveNameFromGPX(f.name).toLowerCase()
    const location = (f.location || '').toLowerCase()
    const address = (f.address || '').toLowerCase()
    const commodity = (f.commodity || '').toLowerCase()
    const coords = f.center ? `${f.center.lat.toFixed(4)}, ${f.center.lng.toFixed(4)}` : ''
    return name.includes(q) ||
           farmerName.includes(q) ||
           derivedName.includes(q) ||
           location.includes(q) ||
           address.includes(q) ||
           commodity.includes(q) ||
           coords.includes(q)
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
    maxZoom: 19,
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

  baseLayers.terrain = terrain
  baseLayers.satellite = satellite
  baseLayers.topo = topo
  baseLayers.dark = dark

  terrain.addTo(map)

  // Layer groups for clean multi-user sync and high-performance rendering
  farmerLayerGroup = L.markerClusterGroup({
    maxClusterRadius: 45,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    chunkedLoading: true,
    chunkInterval: 100,
    chunkDelay: 25,
    disableClusteringAtZoom: 17
  })
  if (farmerMarkersVisible.value) farmerLayerGroup.addTo(map)

  gpxTracksLayerGroup = L.layerGroup()
  if (parcelPolygonsVisible.value) gpxTracksLayerGroup.addTo(map)

  gpxMarkersLayerGroup = L.layerGroup()
  if (gpxMarkersVisible.value) gpxMarkersLayerGroup.addTo(map)

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
    queueGpxViewportUpdate()
  })

  map.on('moveend', () => {
    const c = map.getCenter()
    centerLat.value = c.lat
    centerLng.value = c.lng
    currentCoordinates.value = `${c.lat.toFixed(4)}°N, ${c.lng.toFixed(4)}°E`
    queueGpxViewportUpdate()
  })
}

// Marker Handling & Dynamic Popup Generators
function jumpToParcel(farmerName, parcelIdx) {
  if (!farmerName || !map) return
  const target = String(farmerName).trim().toUpperCase()
  const farmer = farmers.value.find(f => f.name && f.name.trim().toUpperCase() === target)
  if (!farmer || !farmer.parcels || !farmer.parcels[parcelIdx]) return

  const parcel = farmer.parcels[parcelIdx]
  if (!parcel.coords) {
    warning(`No coordinates found for Parcel #${parcelIdx + 1}`)
    return
  }

  const [pLat, pLng] = parcel.coords.split(',').map(Number)
  if (isNaN(pLat) || isNaN(pLng)) {
    warning(`Invalid coordinates for Parcel #${parcelIdx + 1}`)
    return
  }

  // 1. Try to find a GPX track whose center/points closely match this specific parcel's coordinates or GPX filename
  const matchingGpx = uploadedFiles.value.find(track => {
    if (parcel.gpxFileName && track.name === parcel.gpxFileName) return true
    if (track.center && Math.abs(track.center.lat - pLat) < 0.0015 && Math.abs(track.center.lng - pLng) < 0.0015) {
      return true
    }
    return false
  })

  // Ensure layer exists for the matching GPX track
  if (matchingGpx) {
    getOrCreateGpxTrackLayer(matchingGpx)
    if (matchingGpx.layer && gpxTracksLayerGroup && !gpxTracksLayerGroup.hasLayer(matchingGpx.layer) && parcelPolygonsVisible.value) {
      gpxTracksLayerGroup.addLayer(matchingGpx.layer)
    }
  }

  // 2. Find the exact marker for this parcel index
  let fm = farmerMarkers.find(m => 
    (m.farmer === farmer || (m.farmer && m.farmer.name && m.farmer.name.toUpperCase() === target)) && 
    (m.parcelIndex === parcelIdx || (m.marker && m.marker._parcelIndex === parcelIdx))
  )

  // If no marker exists yet for this parcel, create one immediately
  if (!fm && !isNaN(pLat) && !isNaN(pLng)) {
    addFarmerMarker(farmer, pLat, pLng, parcelIdx)
    fm = farmerMarkers.find(m => 
      (m.farmer === farmer || (m.farmer && m.farmer.name && m.farmer.name.toUpperCase() === target)) && 
      (m.parcelIndex === parcelIdx || (m.marker && m.marker._parcelIndex === parcelIdx))
    )
  }

  if (matchingGpx && matchingGpx.layer && matchingGpx.layer.getBounds) {
    try {
      map.fitBounds(matchingGpx.layer.getBounds(), { padding: [50, 50], maxZoom: 17 })
    } catch (_) {
      map.flyTo([pLat, pLng], 17, { duration: 1.0 })
    }
  } else {
    map.flyTo([pLat, pLng], 17, { duration: 1.0 })
  }

  setStatus(`Navigating to ${farmer.name} - Parcel #${parcelIdx + 1}`, 'info')

  setTimeout(() => {
    if (fm && fm.marker) {
      if (farmerLayerGroup && farmerLayerGroup.zoomToShowLayer) {
        farmerLayerGroup.zoomToShowLayer(fm.marker, () => {
          fm.marker.openPopup()
        })
      } else {
        fm.marker.openPopup()
      }
    } else if (matchingGpx && matchingGpx.layer) {
      const popupPos = matchingGpx.center ? [matchingGpx.center.lat, matchingGpx.center.lng] : [pLat, pLng]
      matchingGpx.layer.openPopup(popupPos)
    }
  }, 350)
}

function buildFarmerPopupHtml(farmer, parcelIndex = 0, lat = 0, lng = 0) {
  if (!farmer) return ''
  const parcelColors = ['#2e7d32', '#1e88e5', '#f9a825', '#8e24aa', '#e53935', '#00acc1']
  const safeName = escapeHtml(farmer.name).replace(/'/g, "\\'")
  let parcelsHtml = ''
  if (farmer.parcels && farmer.parcels.length > 0) {
    parcelsHtml = '<div style="margin-top:8px; border-top:1px solid #eee; padding-top:6px; font-size:12px;"><strong>Parcels:</strong><div style="margin-top:4px;">'
    farmer.parcels.forEach((p, i) => {
      const pColor = parcelColors[i % parcelColors.length]
      const active = i === parcelIndex ? 'font-weight:bold;' : ''
      let pComm = p.commodity
      if (!pComm && p.coords) {
        const [pLat, pLng] = p.coords.split(',').map(Number)
        pComm = getCommodityFromCoordinates(pLat, pLng)
      }
      const commBadge = pComm ? '' : ''

      parcelsHtml += `
        <div 
          class="popup-parcel-row"
          style="margin:3px 0; font-size:11.5px; ${active} cursor:pointer; display:flex; align-items:center; padding:2px 4px; border-radius:4px; transition:background 0.15s ease;" 
          title="Click to jump to Parcel #${i + 1}"
          onclick="window.jumpToParcelByPopup('${safeName}', ${i})"
        >
          <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${pColor};color:white;font-size:10px;text-align:center;line-height:16px;margin-right:6px;flex-shrink:0;">${i + 1}</span>
          <span style="text-decoration:underline; text-underline-offset:2px;">${(p.area != null ? Number(p.area).toFixed(4) : '—')} ha${commBadge} — ${p.coords || 'no coords'}</span>
          ${i === parcelIndex ? '<span style="margin-left:4px; color:#2e7d32;">◀</span>' : ''}
        </div>
      `
    })
    parcelsHtml += '</div></div>'
  }

  const totalArea = farmer.parcels && farmer.parcels.length > 0
    ? farmer.parcels.reduce((s, p) => s + (Number(p.area) || 0), 0)
    : Number(farmer.area || 0)

  const latVal = typeof lat === 'number' ? lat.toFixed(5) : lat
  const lngVal = typeof lng === 'number' ? lng.toFixed(5) : lng
  const addressHtml = farmer.address ? `<p style="margin:2px 0;font-size:12px;color:#444;"><strong>Address:</strong> ${escapeHtml(farmer.address)}</p>` : ''
  const allComms = resolveFarmerCommodities(farmer).join(', ')

  return `
    <div style="min-width:240px; font-family: inherit; font-size: 13px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #eee; padding-bottom:4px;">
        <h3 style="margin:0; color:#2e7d32; font-size:15px; font-weight:700;">${escapeHtml(farmer.name)}</h3>
        <button type="button" class="btn-popup-edit" onclick="window.editFarmerByPopup('${safeName}')" title="Edit Farmer Profile">
          ✏️ Edit
        </button>
      </div>
      ${addressHtml}
      <p style="margin:2px 0;font-size:12px;color:#444;"><strong>Barangay:</strong> ${escapeHtml(resolveFarmerBarangay(farmer))}</p>
      <p style="margin:2px 0;font-size:12px;color:#222;"><strong>Total Area:</strong> ${totalArea.toFixed(4)} ha (${farmer.parcels ? farmer.parcels.length : 1} parcel(s))</p>
      ${parcelsHtml}
      <div style="margin-top:6px; padding-top:6px; border-top:1px solid #eee; font-size:11px; color:#777;">
        Parcel #${(Number(parcelIndex) || 0) + 1} — ${latVal}, ${lngVal}
      </div>
    </div>
  `
}

function getMatchingFarmerForGpx(fileName, gpxCenter) {
  if (!farmers.value || farmers.value.length === 0) return null
  const derived = deriveNameFromGPX(fileName).trim().toUpperCase()

  // 1. Linked by GPX filename
  let match = farmers.value.find(f => 
    (f.gpxFileName && f.gpxFileName === fileName) || 
    (f.gpxFileNames && Array.isArray(f.gpxFileNames) && f.gpxFileNames.includes(fileName))
  )
  if (match) return match

  // 2. Direct name match
  match = farmers.value.find(f => f.name && f.name.trim().toUpperCase() === derived)
  if (match) return match

  // 3. Partial name match
  match = farmers.value.find(f => f.name && (
    fileName.toUpperCase().includes(f.name.toUpperCase()) || 
    f.name.toUpperCase().includes(derived)
  ))
  if (match) return match

  // 4. Coordinate match (within ~0.001 deg)
  if (gpxCenter && gpxCenter.lat && gpxCenter.lng) {
    const lat = gpxCenter.lat
    const lng = gpxCenter.lng
    match = farmers.value.find(f => {
      if (f.parcels && f.parcels.length > 0) {
        return f.parcels.some(p => {
          if (!p.coords) return false
          const [pLat, pLng] = p.coords.split(',').map(Number)
          return !isNaN(pLat) && !isNaN(pLng) && Math.abs(pLat - lat) < 0.001 && Math.abs(pLng - lng) < 0.001
        })
      }
      if (f.coords) {
        const [pLat, pLng] = f.coords.split(',').map(Number)
        return !isNaN(pLat) && !isNaN(pLng) && Math.abs(pLat - lat) < 0.001 && Math.abs(pLng - lng) < 0.001
      }
      return false
    })
    if (match) return match
  }
  return null
}

function buildGpxPopupHtml(fileName, normPoints, trackColor, areaHectares, areaKm2, enclosed, safeCenter) {
  const matchingFarmer = getMatchingFarmerForGpx(fileName, safeCenter)

  const displayName = matchingFarmer ? matchingFarmer.name : deriveNameFromGPX(fileName)
  const displayCommodity = matchingFarmer ? (matchingFarmer.commodity || '—') : deriveCommodityFromGPX(fileName)
  const displayBarangay = resolveGpxBarangay(fileName, safeCenter)
  const addressHtml = (matchingFarmer && matchingFarmer.address) ? `<p style="margin:3px 0; font-size:12px; color:#444;"><strong>Address:</strong> ${escapeHtml(matchingFarmer.address)}</p>` : ''
  const coordsStr = safeCenter ? `${safeCenter.lat.toFixed(4)},${safeCenter.lng.toFixed(4)}` : ''
  const haVal = typeof areaHectares === 'number' && !isNaN(areaHectares) && areaHectares > 0
    ? areaHectares
    : (calculatePolygonArea(normPoints || []) * 100)
  const km2Val = typeof areaKm2 === 'number' && !isNaN(areaKm2) && areaKm2 > 0
    ? areaKm2
    : (haVal / 100)

  let parcelsInfoHtml = ''
  if (matchingFarmer && matchingFarmer.parcels && matchingFarmer.parcels.length > 1) {
    parcelsInfoHtml = `<p style="margin:3px 0; font-size:11.5px; color:#555;"><strong>Total Farmer Area:</strong> ${(matchingFarmer.area || haVal).toFixed(4)} ha (${matchingFarmer.parcels.length} parcels)</p>`
  }

  const safeDisplayName = escapeHtml(displayName).replace(/'/g, "\\'")

  return `
    <div style="min-width:240px; font-family: inherit; font-size: 13px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #eee; padding-bottom:4px;">
        <h3 style="margin:0; color:#2e7d32; font-size:15px; font-weight:700;">${escapeHtml(displayName)}</h3>
        <div style="display:flex; align-items:center; gap:6px;">
          <button type="button" class="btn-popup-edit" onclick="window.editFarmerByPopup('${safeDisplayName}')" title="Edit Farmer Profile">
            ✏️ Edit
          </button>
        </div>
      </div>
      ${addressHtml}
      <p style="margin:3px 0; font-size:12px; color:#444;"><strong>Barangay:</strong> ${escapeHtml(displayBarangay)}</p>
      <p style="margin:3px 0; font-size:12px; color:#444;"><strong>File:</strong> ${escapeHtml(fileName)}</p>
      <p style="margin:3px 0; font-size:12px; color:#111;"><strong>Farm Area:</strong> <strong style="color:#2e7d32; font-size:13px;">${haVal.toFixed(4)} ha</strong> (${(km2Val * 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })} m²)</p>
      ${parcelsInfoHtml}
      <p style="margin:3px 0; font-size:11.5px; color:#666;"><strong>Boundary:</strong> ${enclosed ? 'Enclosed Polygon' : 'Track Polygon'} (${(normPoints || []).length} GPS pts)</p>
      <div style="margin-top:6px; padding-top:6px; border-top:1px solid #eee; font-size:11px; color:#777;">
        Coordinates: <span style="font-family:monospace; color:#333;">${coordsStr}</span>
      </div>
    </div>
  `
}

function captureActivePopup() {
  if (!map) return null
  let active = null
  map.eachLayer(layer => {
    if (active) return
    if (layer.isPopupOpen && layer.isPopupOpen()) {
      const popup = layer.getPopup()
      const latlng = popup ? popup.getLatLng() : null

      // 1. Is it a farmer marker?
      const fm = farmerMarkers.find(m => m.marker === layer)
      if (fm && fm.farmer) {
        active = {
          type: 'farmer',
          farmerName: (fm.farmer.name || '').trim().toUpperCase(),
          parcelIndex: fm.parcelIndex !== undefined ? fm.parcelIndex : (layer._parcelIndex || 0),
          latlng
        }
        return
      }

      // 2. Is it a GPX track layer or start/end marker?
      const gpx = uploadedFiles.value.find(f => f.layer === layer || f.startMarker === layer || f.endMarker === layer)
      if (gpx) {
        active = {
          type: 'gpx',
          trackName: gpx.name,
          latlng
        }
        return
      }

      if (latlng) {
        active = {
          type: 'generic',
          latlng,
          popupContent: popup.getContent ? popup.getContent() : null
        }
      }
    }
  })
  return active
}

function restoreActivePopup(active) {
  if (!active || !map) return

  setTimeout(() => {
    if (!map) return
    if (active.type === 'farmer') {
      const fm = farmerMarkers.find(m => 
        m.farmer && 
        (m.farmer.name || '').trim().toUpperCase() === active.farmerName && 
        (m.parcelIndex === active.parcelIndex || m.marker._parcelIndex === active.parcelIndex)
      ) || farmerMarkers.find(m => m.farmer && (m.farmer.name || '').trim().toUpperCase() === active.farmerName)

      if (fm && fm.marker) {
        fm.marker.openPopup()
        return
      }
    }

    if (active.type === 'gpx') {
      const gpx = uploadedFiles.value.find(f => f.name === active.trackName)
      if (gpx && gpx.layer) {
        gpx.layer.openPopup(active.latlng || gpx.center)
        return
      }
    }

    if (active.type === 'generic' && active.latlng && active.popupContent) {
      L.popup().setLatLng(active.latlng).setContent(active.popupContent).openOn(map)
    }
  }, 60)
}

function refreshAllMapPopups() {
  if (!map) return
  map.eachLayer(layer => {
    if (layer.getPopup && layer.getPopup() && layer.isPopupOpen && layer.isPopupOpen()) {
      const popup = layer.getPopup()
      if (popup) {
        popup.update()
      }
    }
  })
}

function createFarmerMarkerObject(farmer, lat, lng, parcelIndex = 0) {
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
  marker.bindPopup(() => buildFarmerPopupHtml(marker._farmerRef, marker._parcelIndex, marker.getLatLng().lat, marker.getLatLng().lng))
  return marker
}

function addFarmerMarker(farmer, lat, lng, parcelIndex = 0) {
  if (!map || !farmerLayerGroup) return
  const marker = createFarmerMarkerObject(farmer, lat, lng, parcelIndex)
  farmerLayerGroup.addLayer(marker)
  farmerMarkers.push({ marker: markRaw(marker), farmer, parcelIndex })
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

async function renderFarmersData(farmersList) {
  const activePopup = captureActivePopup()
  clearAllFarmerMarkers()
  farmers.value = Array.isArray(farmersList) ? farmersList : []
  const total = farmers.value.length
  const CHUNK = 100
  for (let i = 0; i < total; i += CHUNK) {
    const end = Math.min(i + CHUNK, total)
    const chunkMarkers = []
    for (let k = i; k < end; k++) {
      const f = farmers.value[k]
      if (!f.parcels) {
        f.parcels = []
        if (f.coords && f.area) f.parcels.push({ area: Number(f.area), coords: String(f.coords) })
      }
      f.area = f.parcels.reduce((sum, p) => sum + (Number(p.area) || 0), 0)
      f.parcels.forEach((p, idx) => {
        if (p.coords) {
          const [lat, lng] = p.coords.split(',').map(Number)
          if (!isNaN(lat) && !isNaN(lng)) {
            if (!p.commodity) {
              const matchedComm = getCommodityFromCoordinates(lat, lng)
              if (matchedComm) p.commodity = matchedComm
            }
            const marker = createFarmerMarkerObject(f, lat, lng, idx)
            chunkMarkers.push(marker)
            farmerMarkers.push({ marker: markRaw(marker), farmer: f, parcelIndex: idx })
          }
        }
      })
      const resolvedComms = resolveFarmerCommodities(f)
      if (resolvedComms.length > 0) {
        f.commodity = resolvedComms[0]
      }
      resolveFarmerBarangay(f)
    }
    if (chunkMarkers.length > 0 && farmerLayerGroup) {
      farmerLayerGroup.addLayers(chunkMarkers)
    }
    // Yield to main thread between chunks so the browser stays responsive
    if (i + CHUNK < total) {
      if (isInitialLoading.value) {
        loadingMessage.value = `Updating farmer records (${Math.min(i + CHUNK, total)} / ${total})...`
      }
      await new Promise(r => setTimeout(r, 0))
    }
  }
  restoreActivePopup(activePopup)
}

// Sample Data & Storage
async function loadSampleData() {
  const saved = await loadGisStorageData(STORAGE_KEY_FARMERS)
  if (saved && Array.isArray(saved)) {
    farmers.value = saved.filter(f => !deletedFarmerNames.value.has((f.name || '').trim().toUpperCase()))
  } else {
    farmers.value = []
  }

  const total = farmers.value.length
  const CHUNK = 100
  for (let i = 0; i < total; i += CHUNK) {
    const end = Math.min(i + CHUNK, total)
    const chunkMarkers = []
    for (let k = i; k < end; k++) {
      const f = farmers.value[k]
      if (!f.parcels) {
        f.parcels = []
        if (f.coords && f.area) f.parcels.push({ area: Number(f.area), coords: String(f.coords) })
      }
      f.area = f.parcels.reduce((sum, p) => sum + (Number(p.area) || 0), 0)
      f.parcels.forEach((p, idx) => {
        if (p.coords) {
          const [lat, lng] = p.coords.split(',').map(Number)
          if (!isNaN(lat) && !isNaN(lng)) {
            if (!p.commodity) {
              const matchedComm = getCommodityFromCoordinates(lat, lng)
              if (matchedComm) p.commodity = matchedComm
            }
            const marker = createFarmerMarkerObject(f, lat, lng, idx)
            chunkMarkers.push(marker)
            farmerMarkers.push({ marker: markRaw(marker), farmer: f, parcelIndex: idx })
          }
        }
      })
      const resolvedComms = resolveFarmerCommodities(f)
      if (resolvedComms.length > 0) {
        f.commodity = resolvedComms[0]
      }
      resolveFarmerBarangay(f)
    }
    if (chunkMarkers.length > 0 && farmerLayerGroup) {
      farmerLayerGroup.addLayers(chunkMarkers)
    }
    // Yield to main thread between chunks so the browser stays responsive
    if (i + CHUNK < total) {
      if (isInitialLoading.value) {
        loadingMessage.value = `Loading farmer records (${Math.min(i + CHUNK, total)} / ${total})...`
      }
      await new Promise(r => setTimeout(r, 0))
    }
  }
}

async function persistFarmers() {
  try {
    const toSave = farmers.value.map(f => {
      const parcels = (f.parcels && f.parcels.length > 0)
        ? f.parcels.map(p => ({
            id: p.id,
            area: Number(Number(p.area || 0).toFixed(4)),
            coords: String(p.coords || '').trim(),
            gpxFileName: p.gpxFileName || null
          }))
        : (f.coords && f.area
            ? [{ area: Number(Number(f.area).toFixed(4)), coords: String(f.coords).trim(), gpxFileName: f.gpxFileName || null }]
            : [])
      return {
        id: f.id,
        name: (f.name || '').trim().toUpperCase(),
        address: f.address && String(f.address).trim() ? String(f.address).trim() : null,
        location: resolveFarmerBarangay(f),
        commodity: f.commodity || 'Rice',
        area: f.area !== undefined ? Number(f.area) : 0,
        parcels,
        gpxFileName: f.gpxFileName || null,
        gpxFileNames: f.gpxFileNames || (f.gpxFileName ? [f.gpxFileName] : []),
        updated_at: f.updated_at || new Date().toISOString()
      }
    })
    await saveGisStorageData(STORAGE_KEY_FARMERS, toSave)
  } catch (e) {
    console.error('Error persisting farmers:', e)
  }
}

// Jump to Coordinate Search
const jumpCoords = ref('')
const jumpPinActive = ref(false)
let jumpMarker = null

function jumpToCoordinates(customCoords = null) {
  const inputStr = String(customCoords !== null ? customCoords : (jumpCoords.value || '')).trim()
  if (!inputStr) {
    warning('Please enter coordinates in "lat, long" format (e.g. 17.9240,121.7034).')
    return
  }

  // Parse "17.9240, 121.7034" or "17.9240,121.7034" or "17.9240 121.7034"
  const match = inputStr.match(/^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)$/)
  if (!match) {
    warning('Invalid coordinate format. Please use "lat, long" (e.g. 17.9240,121.7034).')
    return
  }

  const lat = parseFloat(match[1])
  const lng = parseFloat(match[2])

  if (isNaN(lat) || isNaN(lng)) {
    warning('Please enter valid numerical Latitude and Longitude coordinates.')
    return
  }

  if (lat < -90 || lat > 90) {
    warning('Latitude must be between -90 and 90.')
    return
  }
  if (lng < -180 || lng > 180) {
    warning('Longitude must be between -180 and 180.')
    return
  }

  if (!map) return

  clearJumpPin()

  // Check if a parcel or GPX track already exists at this coordinate
  let matchedFarmer = null
  let matchedParcelIdx = -1
  let matchedGpx = null

  // 1. Check existing farmers and their parcels (threshold ~0.00015 deg, approx 15-20 meters)
  for (const f of farmers.value) {
    if (f.parcels && f.parcels.length > 0) {
      const idx = f.parcels.findIndex(p => {
        if (!p.coords) return false
        const [pLat, pLng] = p.coords.split(',').map(Number)
        return !isNaN(pLat) && !isNaN(pLng) && Math.abs(pLat - lat) < 0.0002 && Math.abs(pLng - lng) < 0.0002
      })
      if (idx >= 0) {
        matchedFarmer = f
        matchedParcelIdx = idx
        break
      }
    } else if (f.coords) {
      const [pLat, pLng] = f.coords.split(',').map(Number)
      if (!isNaN(pLat) && !isNaN(pLng) && Math.abs(pLat - lat) < 0.0002 && Math.abs(pLng - lng) < 0.0002) {
        matchedFarmer = f
        matchedParcelIdx = 0
        break
      }
    }
  }

  // 2. Check GPX tracks center or polygon proximity
  if (!matchedFarmer) {
    matchedGpx = uploadedFiles.value.find(track => {
      if (track.center && Math.abs(track.center.lat - lat) < 0.0002 && Math.abs(track.center.lng - lng) < 0.0002) {
        return true
      }
      return false
    })
  }

  // If a parcel or track already exists on that exact coordinate, do not show custom pin
  if (matchedFarmer) {
    const targetName = (matchedFarmer.name || '').trim().toUpperCase()
    const fm = farmerMarkers.find(m => 
      (m.farmer === matchedFarmer || (m.farmer && m.farmer.name && m.farmer.name.toUpperCase() === targetName)) &&
      m.parcelIndex === matchedParcelIdx
    ) || farmerMarkers.find(m => 
      m.farmer === matchedFarmer || (m.farmer && m.farmer.name && m.farmer.name.toUpperCase() === targetName)
    )

    map.flyTo([lat, lng], 17, { duration: 1.2 })
    if (fm && fm.marker) {
      setTimeout(() => {
        if (fm.marker) fm.marker.openPopup()
      }, 350)
      fm.marker.openPopup()
    }
    const detectedBrgy = getBarangayFromCoordinates(lat, lng) || resolveFarmerBarangay(matchedFarmer)
    setStatus(`Located parcel for ${matchedFarmer.name} (${detectedBrgy})`, 'success')
    return
  }

  if (matchedGpx && matchedGpx.layer) {
    flyToGPX(matchedGpx)
    return
  }

  // No parcel or track found at this coordinate: Show Coordinate Location Custom Pin
  map.flyTo([lat, lng], 17, { duration: 1.2 })

  const icon = L.divIcon({
    className: 'custom-jump-pin',
    html: `
      <div style="position:relative; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:rgba(30, 136, 229, 0.35); animation: pulse 1.5s infinite;"></div>
        <div style="position:relative; width:28px; height:28px; border-radius:50%; background:#1e88e5; border:3px solid #ffffff; box-shadow:0 3px 8px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; color:white; font-size:13px; font-weight:bold;">📍</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  })

  jumpMarker = L.marker([lat, lng], { icon }).addTo(map)
  jumpPinActive.value = true

  const detectedBrgy = getBarangayFromCoordinates(lat, lng)
  const brgyDisplay = detectedBrgy ? `Brgy. ${detectedBrgy}` : 'Alcala, Cagayan'

  const popupHtml = `
    <div style="min-width:200px; font-family:inherit; font-size:13px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #eee; padding-bottom:4px;">
        <strong style="color:#1e88e5; font-size:14px;">📍 Coordinate Location</strong>
        <span style="font-size:11px; background:#e3f2fd; color:#1565c0; padding:2px 6px; border-radius:10px; font-weight:600;">Custom Pin</span>
      </div>
      <p style="margin:4px 0; font-size:12px; color:#333;"><strong>Barangay:</strong> <span style="font-weight:700; color:#2e7d32;">${brgyDisplay}</span></p>
      <p style="margin:4px 0; font-size:12px; color:#333;"><strong>Latitude:</strong> <span style="font-family:monospace; font-weight:600;">${lat.toFixed(6)}</span></p>
      <p style="margin:4px 0; font-size:12px; color:#333;"><strong>Longitude:</strong> <span style="font-family:monospace; font-weight:600;">${lng.toFixed(6)}</span></p>
      <div style="margin-top:8px; padding-top:6px; border-top:1px solid #eee; display:flex; justify-content:flex-end;">
        <button type="button" class="btn-popup-edit" style="background:#d32f2f !important;" onclick="window.clearJumpPinByPopup()">
          ✕ Clear Pin
        </button>
      </div>
    </div>
  `
  jumpMarker.bindPopup(popupHtml)
  setTimeout(() => {
    if (jumpMarker) jumpMarker.openPopup()
  }, 350)

  setStatus(`Jumped to ${brgyDisplay} (${lat.toFixed(5)}, ${lng.toFixed(5)})`, 'success')
}

function clearJumpPin() {
  if (jumpMarker && map) {
    map.removeLayer(jumpMarker)
    jumpMarker = null
  }
  jumpPinActive.value = false
}

// Search
function searchFarm() {
  const q = searchQuery.value.toLowerCase().trim()
  const loc = searchLocationFilter.value

  // Check if searchQuery itself is a coordinate pair (e.g. "17.9464, 121.7353")
  const coordMatch = q.match(/^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)$/)
  if (coordMatch) {
    jumpCoords.value = `${coordMatch[1]},${coordMatch[2]}`
    jumpToCoordinates(jumpCoords.value)
  }

  if (!q && loc === 'All') {
    searchResults.value = []
    searchInfoItem.value = null
    return
  }

  const unifiedMap = new Map()

  // 1. Process farmers
  farmers.value.forEach(f => {
    const name = (f.name || '').trim().toUpperCase()
    const location = resolveFarmerBarangay(f)
    const commsList = resolveFarmerCommodities(f)
    const commodity = commsList.join(', ') || f.commodity || 'Rice'

    if (loc !== 'All' && !location.toUpperCase().includes(loc.toUpperCase()) && !(f.location && f.location.toUpperCase().includes(loc.toUpperCase()))) {
      return
    }

    if (q) {
      const matchName = name.toLowerCase().includes(q)
      const matchLoc = location.toLowerCase().includes(q) || (f.location && f.location.toLowerCase().includes(q))
      const matchCrop = commodity.toLowerCase().includes(q) || commsList.some(c => c.toLowerCase().includes(q))
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
      commodities: commsList,
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

    const location = resolveGpxBarangay(g.name, g.center)
    const commodity = deriveCommodityFromGPX(g.name)

    if (loc !== 'All' && !location.toUpperCase().includes(loc.toUpperCase())) {
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

  searchResults.value = Array.from(unifiedMap.values()).map((item, idx) => ({
    ...item,
    _key: `${item.type}_${item.name}_${idx}`
  }))
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

  getOrCreateGpxTrackLayer(gpxFile)
  if (gpxFile.layer && gpxTracksLayerGroup && !gpxTracksLayerGroup.hasLayer(gpxFile.layer) && parcelPolygonsVisible.value) {
    gpxTracksLayerGroup.addLayer(gpxFile.layer)
  }

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

function areCoordinatesEqual(ptsA, ptsB, tolerance = 1e-5) {
  if (!ptsA || !ptsB || ptsA.length !== ptsB.length || ptsA.length === 0) return false

  let forwardMatch = true
  for (let i = 0; i < ptsA.length; i++) {
    if (Math.abs(ptsA[i][0] - ptsB[i][0]) > tolerance || Math.abs(ptsA[i][1] - ptsB[i][1]) > tolerance) {
      forwardMatch = false
      break
    }
  }
  if (forwardMatch) return true

  let reverseMatch = true
  const len = ptsA.length
  for (let i = 0; i < len; i++) {
    if (Math.abs(ptsA[i][0] - ptsB[len - 1 - i][0]) > tolerance || Math.abs(ptsA[i][1] - ptsB[len - 1 - i][1]) > tolerance) {
      reverseMatch = false
      break
    }
  }
  return reverseMatch
}

function areTrackCoordinatesMatching(ptsA, ptsB, tolerance = 1e-5) {
  if (!ptsA || !ptsB || ptsA.length === 0 || ptsB.length === 0) return false
  if (areCoordinatesEqual(ptsA, ptsB, tolerance)) return true

  // Handle closed ring with duplicate last vertex
  const cleanA = (ptsA.length > 2 && Math.abs(ptsA[0][0] - ptsA[ptsA.length - 1][0]) < 1e-5 && Math.abs(ptsA[0][1] - ptsA[ptsA.length - 1][1]) < 1e-5)
    ? ptsA.slice(0, -1) : ptsA
  const cleanB = (ptsB.length > 2 && Math.abs(ptsB[0][0] - ptsB[ptsB.length - 1][0]) < 1e-5 && Math.abs(ptsB[0][1] - ptsB[ptsB.length - 1][1]) < 1e-5)
    ? ptsB.slice(0, -1) : ptsB

  return areCoordinatesEqual(cleanA, cleanB, tolerance)
}

function findExactOrAreaDuplicate(fileName, tempPoints) {
  if (!tempPoints || tempPoints.length === 0) return null
  const areaKm2 = calculatePolygonArea(tempPoints)
  const areaHectares = areaKm2 * 100
  const normalizedName = String(fileName || '').trim().toLowerCase()

  for (const existing of uploadedFiles.value) {
    if (!existing.points || existing.points.length === 0) continue

    const existingName = String(existing.name || '').trim().toLowerCase()
    const coordsMatch = areTrackCoordinatesMatching(tempPoints, existing.points)

    if (!coordsMatch) continue

    const existingAreaHa = existing.areaHectares !== undefined
      ? Number(existing.areaHectares)
      : (existing.areaKm2 ? Number(existing.areaKm2) * 100 : 0)
    const areaMatch = Math.abs(existingAreaHa - areaHectares) < 0.0001
    const nameMatch = existingName === normalizedName

    // 1. Same filename and same exact coordinates
    if (nameMatch) {
      return {
        existing,
        reason: `already present with same filename and coordinates in "${existing.name}"`
      }
    }

    // 2. Same calculated area and coordinates present already (even if filenames are different)
    if (areaMatch) {
      return {
        existing,
        reason: `already present with matching coordinates and calculated area (${areaHectares.toFixed(4)} ha in "${existing.name}")`
      }
    }

    // If coordinates match but BOTH filename and area are different,
    // automatically allow upload (not a duplicate)
  }

  return null
}

function checkDuplicateGPX(newPoints, newFileName = '') {
  if (!newPoints || newPoints.length === 0) return null
  const newCenterLat = newPoints.reduce((s, p) => s + p[0], 0) / newPoints.length
  const newCenterLng = newPoints.reduce((s, p) => s + p[1], 0) / newPoints.length
  const newFirst = newPoints[0]
  const newLast = newPoints[newPoints.length - 1]
  const normalizedNewName = String(newFileName || '').trim().toLowerCase()
  const newAreaHa = calculatePolygonArea(newPoints) * 100

  for (const existing of uploadedFiles.value) {
    const existingName = String(existing.name || '').trim().toLowerCase()
    const existingAreaHa = existing.areaHectares !== undefined
      ? Number(existing.areaHectares)
      : (existing.areaKm2 ? Number(existing.areaKm2) * 100 : 0)

    const isDifferentName = Boolean(normalizedNewName && existingName && normalizedNewName !== existingName)
    const isDifferentArea = Math.abs(existingAreaHa - newAreaHa) >= 0.0001

    // If coordinates match / are proximate, but filename is different AND area is different,
    // automatically upload (do not treat as duplicate to block or prompt modal)
    if (isDifferentName && isDifferentArea) {
      continue
    }

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

  const initialTrackCount = uploadedFiles.value.length

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const prog = uploadProgress.value[i]
    try {
      prog.status = 'processing'
      prog.percent = 30
      const content = await readFileAsync(file)
      prog.percent = 50

      const tempPoints = extractTrackPoints(content)

      if (tempPoints.length > 0) {
        // Automatic Skip: only if exact filename & coordinates match, OR matching area & coordinates
        const autoSkipMatch = findExactOrAreaDuplicate(file.name, tempPoints)
        if (autoSkipMatch) {
          prog.status = 'skipped'
          prog.percent = 100
          info(`Automatically skipped "${file.name}": ${autoSkipMatch.reason}`)
          continue
        }

        const duplicate = checkDuplicateGPX(tempPoints, file.name)
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

  // Reconcile all tracks against farmer records
  await reconcileOrphanGpxTracks()

  // Save new tracks to server SQLite database
  const newTracks = uploadedFiles.value.slice(initialTrackCount)
  if (newTracks.length > 0) {
    persistGpxTracks()
    apiCreateGpxTracks(newTracks).then(savedTracks => {
      if (Array.isArray(savedTracks)) {
        savedTracks.forEach(saved => {
          const localTrack = uploadedFiles.value.find(t => t.name === saved.name)
          if (localTrack && saved.id) localTrack.id = saved.id
        })
        persistGpxTracks()
      }
    }).catch(err => console.warn('Server batch GPX save warning:', err))
  }

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

function fixLatLng(lat, lng) {
  if (isNaN(lat) || !isFinite(lat) || isNaN(lng) || !isFinite(lng)) return null
  // In Philippines (Alcala, Cagayan ~ 17.9°N, 121.6°E):
  // If coordinates are [lng, lat] (lng > 50 and lat <= 50): swap to [lat, lng]
  if (lat > 50 && lng <= 50) {
    return [lng, lat]
  }
  return [lat, lng]
}

function parseGpxXmlString(xmlStr) {
  try {
    const parser = new DOMParser()
    const xml = parser.parseFromString(xmlStr, 'text/xml')
    const trkpts = xml.querySelectorAll('trkpt')
    const rtepts = xml.querySelectorAll('rtept')
    const waypoints = xml.querySelectorAll('wpt')
    const nodes = trkpts.length > 0 ? trkpts : (rtepts.length > 0 ? rtepts : waypoints)
    const pts = []
    nodes.forEach(pt => {
      const lat = parseFloat(pt.getAttribute('lat'))
      const lng = parseFloat(pt.getAttribute('lon') || pt.getAttribute('lng'))
      if (!isNaN(lat) && !isNaN(lng)) {
        const fixed = fixLatLng(lat, lng)
        if (fixed) pts.push(fixed)
      }
    })
    return pts
  } catch (e) {
    return []
  }
}

function extractTrackPoints(raw) {
  if (!raw) return []
  let data = raw

  // If passed the entire track object, extract the coordinate property
  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    if (data.points !== undefined) data = data.points
    else if (data.track_points !== undefined) data = data.track_points
    else if (data.trackPoints !== undefined) data = data.trackPoints
    else if (data.coordinates !== undefined) data = data.coordinates
    else if (data.coords !== undefined) data = data.coords
    else if (data.latlngs !== undefined) data = data.latlngs
    else if (data.latLngs !== undefined) data = data.latLngs
    else if (data.path !== undefined) data = data.path
    else if (data.geometry && data.geometry.coordinates !== undefined) data = data.geometry.coordinates
    else if (data.content || data.gpx_content || data.xml || data.gpx || data.raw) {
      data = data.content || data.gpx_content || data.xml || data.gpx || data.raw
    }
  }

  // If string, handle JSON string or GPX XML or coordinate text
  if (typeof data === 'string') {
    data = data.trim()
    if (data.startsWith('[') || data.startsWith('{')) {
      try {
        const parsed = JSON.parse(data)
        return extractTrackPoints(parsed)
      } catch (e) {}
    }
    if (data.includes('<trk') || data.includes('<wpt') || data.includes('<rte') || data.includes('<?xml')) {
      return parseGpxXmlString(data)
    }
    // Delimited coordinates: e.g. "17.9021,121.6560\n17.9022,121.6561" or "17.9021 121.6560, 17.9022 121.6561"
    const lines = data.split(/[\r\n;]+/)
    const parsedPts = []
    for (const line of lines) {
      const parts = line.trim().split(/[,\s]+/).map(Number).filter(n => !isNaN(n))
      if (parts.length >= 2) {
        const fixed = fixLatLng(parts[0], parts[1])
        if (fixed) parsedPts.push(fixed)
      }
    }
    if (parsedPts.length > 0) return parsedPts
  }

  // If GeoJSON Geometry / Feature
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.type === 'Feature' && data.geometry) return extractTrackPoints(data.geometry)
    if (data.type === 'FeatureCollection' && Array.isArray(data.features) && data.features[0]) {
      return extractTrackPoints(data.features[0])
    }
    if (data.coordinates) {
      data = data.coordinates
      // Flatten nested polygon rings if needed
      while (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && Array.isArray(data[0][0])) {
        data = data[0]
      }
    }
  }

  if (!Array.isArray(data)) return []

  const result = []
  for (let i = 0; i < data.length; i++) {
    const p = data[i]
    if (Array.isArray(p)) {
      if (p.length >= 2) {
        const fixed = fixLatLng(Number(p[0]), Number(p[1]))
        if (fixed) result.push(fixed)
      }
    } else if (p && typeof p === 'object') {
      const lat = p.lat !== undefined ? Number(p.lat) : (p.latitude !== undefined ? Number(p.latitude) : (p.y !== undefined ? Number(p.y) : NaN))
      const lng = p.lng !== undefined ? Number(p.lng) : (p.lon !== undefined ? Number(p.lon) : (p.longitude !== undefined ? Number(p.longitude) : (p.x !== undefined ? Number(p.x) : NaN)))
      const fixed = fixLatLng(lat, lng)
      if (fixed) result.push(fixed)
    } else if (typeof p === 'string') {
      const parts = p.split(/[,\s]+/).map(Number).filter(n => !isNaN(n))
      if (parts.length >= 2) {
        const fixed = fixLatLng(parts[0], parts[1])
        if (fixed) result.push(fixed)
      }
    }
  }
  return result
}

function normalizeTrackCenter(rawCenter, normPoints) {
  let c = rawCenter
  if (typeof c === 'string') {
    try {
      c = JSON.parse(c)
    } catch (e) {
      c = null
    }
  }
  if (c && typeof c === 'object') {
    if (Array.isArray(c) && c.length >= 2) {
      const fixed = fixLatLng(Number(c[0]), Number(c[1]))
      if (fixed) return { lat: fixed[0], lng: fixed[1] }
    } else if (c.lat !== undefined && c.lng !== undefined) {
      const fixed = fixLatLng(Number(c.lat), Number(c.lng))
      if (fixed) return { lat: fixed[0], lng: fixed[1] }
    } else if (c.latitude !== undefined && c.longitude !== undefined) {
      const fixed = fixLatLng(Number(c.latitude), Number(c.longitude))
      if (fixed) return { lat: fixed[0], lng: fixed[1] }
    } else if (c.center_lat !== undefined && c.center_lng !== undefined) {
      const fixed = fixLatLng(Number(c.center_lat), Number(c.center_lng))
      if (fixed) return { lat: fixed[0], lng: fixed[1] }
    }
  }

  if (normPoints && normPoints.length > 0) {
    const latSum = normPoints.reduce((s, p) => s + p[0], 0)
    const lngSum = normPoints.reduce((s, p) => s + p[1], 0)
    return {
      lat: latSum / normPoints.length,
      lng: lngSum / normPoints.length
    }
  }

  return { lat: 17.9021, lng: 121.6560 }
}

function createGpxPolygonLayer(points, color, fileName, areaHectares, areaKm2, isEnclosed, centerLatVal, centerLngVal) {
  const normPoints = extractTrackPoints(points)
  if (normPoints.length === 0) return { gpxLayer: null, startMarker: null, endMarker: null }

  const safeCenter = normalizeTrackCenter(
    centerLatVal !== undefined && centerLngVal !== undefined ? { lat: centerLatVal, lng: centerLngVal } : null,
    normPoints
  )

  const enclosed = isEnclosed !== undefined ? Boolean(isEnclosed) : isTrackEnclosed(normPoints, 0.05)
  const trackColor = color || '#2196F3'

  // Construct Leaflet polygon directly from surveyed perimeter points
  const gpxLayer = L.polygon(normPoints, {
    color: trackColor,
    weight: 3,
    opacity: 0.9,
    fillColor: trackColor,
    fillOpacity: 0.35
  })

  const derivedName = deriveNameFromGPX(fileName)
  const detectedCommodity = deriveCommodityFromGPX(fileName)
  const detectedLocation = deriveLocationFromGPX(fileName)
  const coordsStr = `${safeCenter.lat.toFixed(4)},${safeCenter.lng.toFixed(4)}`
  const haVal = typeof areaHectares === 'number' && !isNaN(areaHectares) && areaHectares > 0
    ? areaHectares
    : (calculatePolygonArea(normPoints) * 100)
  const km2Val = typeof areaKm2 === 'number' && !isNaN(areaKm2) && areaKm2 > 0
    ? areaKm2
    : (haVal / 100)

  gpxLayer.bindPopup(() => buildGpxPopupHtml(fileName, normPoints, trackColor, haVal, km2Val, enclosed, safeCenter))

  let startMarker = null
  let endMarker = null
  if (normPoints.length > 1) {
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
    startMarker = L.marker(normPoints[0], { icon: startIcon })
    endMarker = L.marker(normPoints[normPoints.length - 1], { icon: endIcon })
    startMarker.bindPopup(() => {
      const match = getMatchingFarmerForGpx(fileName, safeCenter)
      const name = match ? match.name : deriveNameFromGPX(fileName)
      return `<strong>${escapeHtml(name)}</strong><br>Track Start<br><small>${normPoints[0][0].toFixed(5)}, ${normPoints[0][1].toFixed(5)}</small>`
    })
    endMarker.bindPopup(() => {
      const match = getMatchingFarmerForGpx(fileName, safeCenter)
      const name = match ? match.name : deriveNameFromGPX(fileName)
      return `<strong>${escapeHtml(name)}</strong><br>Track End<br><small>${normPoints[normPoints.length - 1][0].toFixed(5)}, ${normPoints[normPoints.length - 1][1].toFixed(5)}</small>`
    })
  }

  return { gpxLayer, startMarker, endMarker, polygonPoints: normPoints, safeCenter, haVal, km2Val, enclosed }
}

// Viewport-based GPX track rendering for 11,000+ tracks
let gpxViewportDebounceTimer = null

function getOrCreateGpxTrackLayer(track) {
  if (track.layer) return { gpxLayer: track.layer, startMarker: track.startMarker, endMarker: track.endMarker }

  const normPoints = (Array.isArray(track.points) && track.points.length > 0 && Array.isArray(track.points[0]))
    ? track.points
    : extractTrackPoints(track.points || track)
  if (normPoints.length === 0) return { gpxLayer: null, startMarker: null, endMarker: null }

  const center = normalizeTrackCenter(track.center, normPoints)
  const isEnclosed = track.isEnclosed !== undefined ? Boolean(track.isEnclosed) : isTrackEnclosed(normPoints, 0.05)
  const areaHa = Number(track.areaHectares || track.area_hectares || 0) || (calculatePolygonArea(normPoints) * 100)
  const areaKm2 = Number(track.areaKm2 || track.area_km2 || 0) || (areaHa / 100)

  const created = createGpxPolygonLayer(
    normPoints,
    track.color || '#2196F3',
    track.name,
    areaHa,
    areaKm2,
    isEnclosed,
    center.lat,
    center.lng
  )

  track.layer = created.gpxLayer ? markRaw(created.gpxLayer) : null
  track.startMarker = created.startMarker ? markRaw(created.startMarker) : null
  track.endMarker = created.endMarker ? markRaw(created.endMarker) : null
  return created
}

let gpxRenderSessionId = 0

function updateVisibleGpxLayers() {
  if (!map || !parcelPolygonsVisible.value) {
    gpxRenderSessionId++
    return
  }
  
  const bounds = map.getBounds().pad(0.65) // Generous margin for smooth panning without edge clipping
  const bSouth = bounds.getSouth()
  const bNorth = bounds.getNorth()
  const bWest = bounds.getWest()
  const bEast = bounds.getEast()

  const tracks = uploadedFiles.value
  const len = tracks.length
  if (len === 0) return

  const renderAll = len <= 100

  const toAdd = []
  const toRemove = []

  for (let i = 0; i < len; i++) {
    const track = tracks[i]
    if (!track || track.visible === false) {
      if (track.layer && gpxTracksLayerGroup && gpxTracksLayerGroup.hasLayer(track.layer)) {
        toRemove.push(track)
      }
      continue
    }

    let inView = renderAll
    if (!inView) {
      if (track.bbox) {
        // Bounding box overlap test with map bounds
        const [minLat, minLng, maxLat, maxLng] = track.bbox
        inView = !(maxLat < bSouth || minLat > bNorth || maxLng < bWest || minLng > bEast)
      } else if (track.center) {
        inView = bounds.contains([track.center.lat, track.center.lng])
      }
    }

    if (inView) {
      toAdd.push(track)
    } else {
      if (track.layer && gpxTracksLayerGroup && gpxTracksLayerGroup.hasLayer(track.layer)) {
        toRemove.push(track)
      }
    }
  }

  // 1. Remove out-of-view tracks synchronously (cheap)
  for (let i = 0; i < toRemove.length; i++) {
    const track = toRemove[i]
    if (track.layer && gpxTracksLayerGroup) {
      gpxTracksLayerGroup.removeLayer(track.layer)
    }
    if (gpxMarkersLayerGroup) {
      if (track.startMarker && gpxMarkersLayerGroup.hasLayer(track.startMarker)) gpxMarkersLayerGroup.removeLayer(track.startMarker)
      if (track.endMarker && gpxMarkersLayerGroup.hasLayer(track.endMarker)) gpxMarkersLayerGroup.removeLayer(track.endMarker)
    }
  }

  // 2. Add in-view tracks progressively in chunks of 30 per animation frame
  const sessionId = ++gpxRenderSessionId
  const BATCH_SIZE = 30
  let idx = 0

  function renderBatch() {
    if (sessionId !== gpxRenderSessionId || !map || !parcelPolygonsVisible.value) return
    const end = Math.min(idx + BATCH_SIZE, toAdd.length)

    for (; idx < end; idx++) {
      const track = toAdd[idx]
      if (!track.layer) {
        getOrCreateGpxTrackLayer(track)
      }
      if (track.layer && gpxTracksLayerGroup && !gpxTracksLayerGroup.hasLayer(track.layer)) {
        gpxTracksLayerGroup.addLayer(track.layer)
      }
      if (gpxMarkersVisible.value && gpxMarkersLayerGroup) {
        if (track.startMarker && !gpxMarkersLayerGroup.hasLayer(track.startMarker)) gpxMarkersLayerGroup.addLayer(track.startMarker)
        if (track.endMarker && !gpxMarkersLayerGroup.hasLayer(track.endMarker)) gpxMarkersLayerGroup.addLayer(track.endMarker)
      }
    }

    if (idx < toAdd.length) {
      requestAnimationFrame(renderBatch)
    }
  }

  renderBatch()
}

function queueGpxViewportUpdate() {
  if (gpxViewportDebounceTimer) clearTimeout(gpxViewportDebounceTimer)
  gpxViewportDebounceTimer = setTimeout(() => {
    updateVisibleGpxLayers()
  }, 120)
}

function clearAllGpxTrackLayers() {
  if (gpxTracksLayerGroup) {
    gpxTracksLayerGroup.clearLayers()
  }
  if (gpxMarkersLayerGroup) {
    gpxMarkersLayerGroup.clearLayers()
  }
  if (map && !gpxTracksLayerGroup && !gpxMarkersLayerGroup) {
    uploadedFiles.value.forEach(f => {
      if (f.layer) map.removeLayer(f.layer)
      if (f.startMarker) map.removeLayer(f.startMarker)
      if (f.endMarker) map.removeLayer(f.endMarker)
    })
  }
  uploadedFiles.value = []
}

async function renderGpxTracksData(tracksList, syncToServer = false) {
  const activePopup = captureActivePopup()
  clearAllGpxTrackLayers()
  if (!Array.isArray(tracksList) || !map) return
  if (!gpxTracksLayerGroup && map) {
    gpxTracksLayerGroup = L.layerGroup()
    if (parcelPolygonsVisible.value) gpxTracksLayerGroup.addTo(map)
  } else if (gpxTracksLayerGroup && map && !map.hasLayer(gpxTracksLayerGroup) && parcelPolygonsVisible.value) {
    gpxTracksLayerGroup.addTo(map)
  }

  if (!gpxMarkersLayerGroup && map) {
    gpxMarkersLayerGroup = L.layerGroup()
    if (gpxMarkersVisible.value) gpxMarkersLayerGroup.addTo(map)
  }

  const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B']
  const filteredList = tracksList.filter(t => t && !deletedGpxNames.value.has((t.name || '').trim().toLowerCase()))

  const newFiles = []
  let skippedCount = 0
  const CHUNK = 200
  for (let i = 0; i < filteredList.length; i += CHUNK) {
    const end = Math.min(i + CHUNK, filteredList.length)
    for (let j = i; j < end; j++) {
      try {
        const track = filteredList[j]
        if (!track) continue
        // Skip expensive re-extraction when points are already normalized [lat, lng] arrays
        const normPoints = (Array.isArray(track.points) && track.points.length > 0 && Array.isArray(track.points[0]))
          ? track.points
          : extractTrackPoints(track)
        if (normPoints.length === 0) continue

        const trackColor = track.color || colors[j % colors.length]
        const center = normalizeTrackCenter(track.center, normPoints)
        const isEnclosed = track.isEnclosed !== undefined ? Boolean(track.isEnclosed) : isTrackEnclosed(normPoints, 0.05)
        const areaHa = Number(track.areaHectares || track.area_hectares || 0) || (calculatePolygonArea(normPoints) * 100)
        const areaKm2 = Number(track.areaKm2 || track.area_km2 || 0) || (areaHa / 100)

        let minLat = normPoints[0][0], maxLat = normPoints[0][0]
        let minLng = normPoints[0][1], maxLng = normPoints[0][1]
        for (let pIdx = 1; pIdx < normPoints.length; pIdx++) {
          const p = normPoints[pIdx]
          if (p[0] < minLat) minLat = p[0]
          if (p[0] > maxLat) maxLat = p[0]
          if (p[1] < minLng) minLng = p[1]
          if (p[1] > maxLng) maxLng = p[1]
        }

        newFiles.push({
          ...track,
          name: track.name || `Track ${j + 1}`,
          points: normPoints,
          center,
          bbox: [minLat, minLng, maxLat, maxLng],
          color: trackColor,
          areaHectares: areaHa,
          areaKm2,
          isEnclosed,
          pointCount: normPoints.length,
          visible: track.visible !== false,
          layer: null,
          startMarker: null,
          endMarker: null
        })
      } catch (trackErr) {
        skippedCount++
        if (skippedCount <= 5) {
          console.warn(`[GIS] Skipped corrupt track at index ${j}:`, trackErr)
        }
      }
    }
    // Yield to main thread between chunks so the browser stays responsive
    if (i + CHUNK < filteredList.length) {
      if (isInitialLoading.value) {
        loadingMessage.value = `Processing GPX tracks (${Math.min(i + CHUNK, filteredList.length)} / ${filteredList.length})...`
      }
      await new Promise(r => setTimeout(r, 0))
    }
  }

  if (skippedCount > 0) {
    console.warn(`[GIS] Skipped ${skippedCount} corrupt tracks out of ${filteredList.length}`)
  }
  console.log(`[GIS] renderGpxTracksData complete: ${newFiles.length} tracks rendered`)

  uploadedFiles.value = newFiles
  updateVisibleGpxLayers()
  persistGpxTracks()
  await reconcileOrphanGpxTracks()
  restoreActivePopup(activePopup)
}

async function persistGpxTracks() {
  try {
    const dataToSave = uploadedFiles.value.map(f => ({
      id: f.id,
      name: f.name,
      farmerId: f.farmerId || null,
      farmerName: f.farmerName || null,
      address: f.address || null,
      location: f.location || null,
      commodity: f.commodity || null,
      points: f.points,
      color: f.color,
      center: f.center,
      pointCount: f.pointCount,
      visible: f.visible !== false,
      areaKm2: f.areaKm2,
      areaHectares: f.areaHectares,
      areaMethod: f.areaMethod,
      isEnclosed: f.isEnclosed,
      updated_at: f.updated_at || new Date().toISOString()
    }))
    await saveGisStorageData(STORAGE_KEY_GPX_TRACKS, dataToSave)
  } catch (e) {
    console.error('Error persisting GPX tracks:', e)
  }
}

async function loadSavedGpxTracks() {
  if (!map) return
  try {
    const saved = await loadGisStorageData(STORAGE_KEY_GPX_TRACKS)
    if (Array.isArray(saved) && saved.length > 0) {
      const activeSaved = saved.filter(t => !deletedGpxNames.value.has((t.name || '').trim().toLowerCase()))
      await renderGpxTracksData(activeSaved)
    }
  } catch (e) {
    console.error('Error loading saved GPX tracks:', e)
  }
}

function parseGPX(fileName, gpxContent) {
  try {
    unmarkGpxDeleted(fileName)
    const points = extractTrackPoints(gpxContent)
    if (points.length === 0) return null

    const duplicateCheck = findExactOrAreaDuplicate(fileName, points)
    if (duplicateCheck) {
      console.warn(`parseGPX skipped duplicate for "${fileName}": ${duplicateCheck.reason}`)
      return null
    }

    const centerLatVal = points.reduce((s, p) => s + p[0], 0) / points.length
    const centerLngVal = points.reduce((s, p) => s + p[1], 0) / points.length

    const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B']
    const color = colors[uploadedFiles.value.length % colors.length]

    const isEnclosed = isTrackEnclosed(points, 0.05)
    const areaKm2 = calculatePolygonArea(points)
    const areaHectares = areaKm2 * 100
    const areaMethod = isEnclosed ? 'polygon' : 'convex-hull'

    const { gpxLayer, startMarker, endMarker, safeCenter } = createGpxPolygonLayer(
      points,
      color,
      fileName,
      areaHectares,
      areaKm2,
      isEnclosed,
      centerLatVal,
      centerLngVal
    )

    if (!gpxLayer) return null

    if (gpxTracksLayerGroup) {
      if (map && !map.hasLayer(gpxTracksLayerGroup) && parcelPolygonsVisible.value) gpxTracksLayerGroup.addTo(map)
      gpxTracksLayerGroup.addLayer(gpxLayer)
      if (gpxLayer.bringToFront) {
        try { gpxLayer.bringToFront() } catch (e) {}
      }
    } else if (map && parcelPolygonsVisible.value) {
      gpxLayer.addTo(map)
    }

    if (gpxMarkersLayerGroup) {
      if (startMarker) gpxMarkersLayerGroup.addLayer(startMarker)
      if (endMarker) gpxMarkersLayerGroup.addLayer(endMarker)
    } else if (map && gpxMarkersVisible.value) {
      if (startMarker) startMarker.addTo(map)
      if (endMarker) endMarker.addTo(map)
    }

    uploadedFiles.value.push({
      name: fileName,
      layer: markRaw(gpxLayer),
      startMarker: startMarker ? markRaw(startMarker) : null,
      endMarker: endMarker ? markRaw(endMarker) : null,
      center: safeCenter || { lat: centerLatVal, lng: centerLngVal },
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
  if (!points || points.length < 3) return false
  const first = points[0]
  const last = points[points.length - 1]
  const lat1 = typeof first === 'object' && first.lat !== undefined ? first.lat : first[0]
  const lon1 = typeof first === 'object' && first.lng !== undefined ? first.lng : first[1]
  const lat2 = typeof last === 'object' && last.lat !== undefined ? last.lat : last[0]
  const lon2 = typeof last === 'object' && last.lng !== undefined ? last.lng : last[1]
  return haversineDistance(lat1, lon1, lat2, lon2) <= thresholdKm
}

function convexHull(points) {
  if (!points || points.length <= 3) return points ? [...points] : []
  const sorted = [...points].sort((a, b) => a[1] - b[1] || a[0] - b[0])
  const cross = (o, a, b) => (a[1] - o[1]) * (b[0] - o[0]) - (a[0] - o[0]) * (b[1] - o[1])

  const lower = []
  for (const pt of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) {
      lower.pop()
    }
    lower.push(pt)
  }

  const reversed = [...sorted].reverse()
  const upper = []
  for (const pt of reversed) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) {
      upper.pop()
    }
    upper.push(pt)
  }

  return lower.slice(0, -1).concat(upper.slice(0, -1))
}

// File List Controls
function toggleFileVisibility(target) {
  const index = typeof target === 'number' ? target : uploadedFiles.value.indexOf(target)
  const file = typeof target === 'object' && target ? target : (index >= 0 ? uploadedFiles.value[index] : null)
  if (!file) return
  file.visible = !file.visible
  if (!map) return

  if (file.visible) {
    getOrCreateGpxTrackLayer(file)
    if (file.layer && gpxTracksLayerGroup && !gpxTracksLayerGroup.hasLayer(file.layer) && parcelPolygonsVisible.value) {
      gpxTracksLayerGroup.addLayer(file.layer)
      if (file.layer.bringToFront) try { file.layer.bringToFront() } catch (e) {}
    }
    if (gpxMarkersVisible.value && gpxMarkersLayerGroup) {
      if (file.startMarker && !gpxMarkersLayerGroup.hasLayer(file.startMarker)) gpxMarkersLayerGroup.addLayer(file.startMarker)
      if (file.endMarker && !gpxMarkersLayerGroup.hasLayer(file.endMarker)) gpxMarkersLayerGroup.addLayer(file.endMarker)
    }
  } else {
    if (file.layer && gpxTracksLayerGroup) gpxTracksLayerGroup.removeLayer(file.layer)
    if (gpxMarkersLayerGroup) {
      if (file.startMarker) gpxMarkersLayerGroup.removeLayer(file.startMarker)
      if (file.endMarker) gpxMarkersLayerGroup.removeLayer(file.endMarker)
    }
  }
  persistGpxTracks()
}

function fitToFile(target) {
  const index = typeof target === 'number' ? target : uploadedFiles.value.indexOf(target)
  const file = typeof target === 'object' && target ? target : (index >= 0 ? uploadedFiles.value[index] : null)
  if (!file || !map) return

  // Ensure file is visible
  if (file.visible === false) {
    file.visible = true
    persistGpxTracks()
  }

  getOrCreateGpxTrackLayer(file)
  if (file.layer && gpxTracksLayerGroup && !gpxTracksLayerGroup.hasLayer(file.layer) && parcelPolygonsVisible.value) {
    gpxTracksLayerGroup.addLayer(file.layer)
  }
  if (gpxMarkersVisible.value && gpxMarkersLayerGroup) {
    if (file.startMarker && !gpxMarkersLayerGroup.hasLayer(file.startMarker)) gpxMarkersLayerGroup.addLayer(file.startMarker)
    if (file.endMarker && !gpxMarkersLayerGroup.hasLayer(file.endMarker)) gpxMarkersLayerGroup.addLayer(file.endMarker)
  }

  if (file.layer && file.layer.getBounds) {
    try {
      map.fitBounds(file.layer.getBounds(), { padding: [50, 50], maxZoom: 17 })
    } catch (_) {
      if (file.center) map.flyTo([file.center.lat, file.center.lng], 16, { duration: 1.0 })
    }
  } else if (file.center) {
    map.flyTo([file.center.lat, file.center.lng], 16, { duration: 1.0 })
  }

  const popupPos = file.center ? [file.center.lat, file.center.lng] : (file.layer?.getBounds ? file.layer.getBounds().getCenter() : null)
  if (file.layer && popupPos) {
    setTimeout(() => {
      try {
        if (file.layer) file.layer.openPopup(popupPos)
      } catch (_) {}
    }, 300)
    try {
      file.layer.openPopup(popupPos)
    } catch (_) {}
  }

  setStatus(`🎯 Zoomed to GPX track ${file.name}`, 'success')
}

async function removeFile(target, skipConfirm = false) {
  const file = (typeof target === 'object' && target) 
    ? target 
    : (typeof target === 'number' && target >= 0 ? uploadedFiles.value[target] : uploadedFiles.value.find(f => f.name === target || (f.id && f.id === target)))
  if (!file) return

  if (!skipConfirm) {
    const confirmed = await confirm(
      'Delete GPX Track',
      `Are you sure you want to delete "${file.name}"? If associated with a farmer profile, the corresponding parcel will also be removed.`,
      'Delete Track'
    )
    if (!confirmed) return
  }

  isDeletingGpx.value = true
  syncStatus.value = 'syncing'
  syncStatusText.value = `Deleting "${file.name}"...`

  try {
    const fileName = file.name
    const fileCenterLat = file.center ? file.center.lat : null
    const fileCenterLng = file.center ? file.center.lng : null

    // 1. Mark as deleted in IndexedDB deleted set
    await markGpxDeleted(fileName)

    // 2. Remove GPX layers from Leaflet map
    if (file.layer && gpxTracksLayerGroup) {
      try { gpxTracksLayerGroup.removeLayer(file.layer) } catch (_) {}
    }
    if (gpxMarkersLayerGroup) {
      if (file.startMarker) try { gpxMarkersLayerGroup.removeLayer(file.startMarker) } catch (_) {}
      if (file.endMarker) try { gpxMarkersLayerGroup.removeLayer(file.endMarker) } catch (_) {}
    }

    // 3. Remove immediately from reactive in-memory list
    const fileIndex = uploadedFiles.value.findIndex(f => f === file || f.name === fileName || (file.id && f.id === file.id))
    if (fileIndex >= 0) {
      uploadedFiles.value.splice(fileIndex, 1)
    } else {
      uploadedFiles.value = uploadedFiles.value.filter(f => f !== file && f.name !== fileName)
    }

    // Force virtual scroller to immediately refresh visible items without needing manual scroll
    gpxListRevision.value++

    // 4. Save updated GPX tracks directly to IndexedDB
    await persistGpxTracks()

    // 5. Unlink and remove/update associated farmer and farmer markers
    let farmersModified = false
    const farmersToDelete = []
    const farmersToUpdate = []

    for (let i = farmers.value.length - 1; i >= 0; i--) {
      const farmer = farmers.value[i]
      if (isGpxTrackRelatedToFarmer(file, farmer)) {
        farmersModified = true

        // Remove track filename from farmer metadata
        if (Array.isArray(farmer.gpxFileNames)) {
          farmer.gpxFileNames = farmer.gpxFileNames.filter(fn => fn !== fileName)
        }
        if (farmer.gpxFileName === fileName) {
          farmer.gpxFileName = (farmer.gpxFileNames && farmer.gpxFileNames.length > 0) ? farmer.gpxFileNames[0] : null
        }

        // Remove ONLY the single exact parcel for this specific GPX file
        if (Array.isArray(farmer.parcels) && farmer.parcels.length > 0) {
          let matchingParcelIdx = -1

          // 1. Match by explicit parcel.gpxFileName
          matchingParcelIdx = farmer.parcels.findIndex(p => p.gpxFileName === fileName)

          // 2. Direct score matching between this parcel and the deleted file object
          if (matchingParcelIdx === -1) {
            let lowestScore = Infinity
            farmer.parcels.forEach((p, pIdx) => {
              let score = 0
              if (p.coords && file.center) {
                const [pLat, pLng] = p.coords.split(',').map(Number)
                if (!isNaN(pLat) && !isNaN(pLng)) {
                  score += Math.hypot(pLat - file.center.lat, pLng - file.center.lng) * 1000
                }
              }
              const pArea = Number(p.area || 0)
              if (pArea > 0 && file.areaHectares > 0) {
                score += Math.abs(file.areaHectares - pArea) * 10
              }
              if (score < lowestScore) {
                lowestScore = score
                matchingParcelIdx = pIdx
              }
            })
          }

          // 3. Fallback for single parcel
          if (matchingParcelIdx === -1 && farmer.parcels.length === 1) {
            matchingParcelIdx = 0
          }

          // Remove ONLY that single matching parcel
          if (matchingParcelIdx >= 0) {
            farmer.parcels.splice(matchingParcelIdx, 1)
          }
        }

        // Recalculate farmer total area
        farmer.area = (farmer.parcels || []).reduce((sum, p) => sum + (Number(p.area) || 0), 0)

        // If no parcels left, delete the farmer and remove all markers
        if (!farmer.parcels || farmer.parcels.length === 0) {
          removeFarmerMarker(farmer)
          farmers.value.splice(i, 1)
          await markFarmerDeleted(farmer.name)
          farmersToDelete.push(farmer)
        } else {
          farmersToUpdate.push(farmer)
        }
      }
    }

    if (farmersModified) {
      farmersListRevision.value++
      await persistFarmers()
      renderFarmersData(farmers.value)

      // Sync farmer deletions / updates to SQLite server
      for (const f of farmersToDelete) {
        apiDeleteFarmer(f.id || f.name).catch(() => {})
      }
      for (const f of farmersToUpdate) {
        apiUpdateFarmer(f.id || f.name, f).catch(() => {})
      }
    }

    // 6. Clear search selection if currently active on this deleted track or deleted farmer
    if (searchInfoItem.value) {
      const sName = (searchInfoItem.value.name || (searchInfoItem.value.data && searchInfoItem.value.data.name) || '').trim().toUpperCase()
      if (sName === fileName.toUpperCase() || farmersToDelete.some(f => (f.name || '').toUpperCase() === sName)) {
        searchInfoItem.value = null
      }
    }

    // 7. Send DELETE request to server SQLite DB
    const targetIdOrName = file.id || fileName
    try {
      await apiDeleteGpxTrack(targetIdOrName)
    } catch (err) {
      console.warn('Server delete GPX track warning:', err)
    }

    syncStatus.value = 'synced'
    syncStatusText.value = `In sync (${farmers.value.length} farmers, ${uploadedFiles.value.length} tracks)`
    lastSyncTime.value = new Date().toLocaleTimeString()
    info(`Removed "${fileName}" and updated farmer records`)
  } finally {
    isDeletingGpx.value = false
  }
}

function showAllFiles() {
  if (!map) return
  parcelPolygonsVisible.value = true
  if (!gpxTracksLayerGroup) {
    gpxTracksLayerGroup = L.layerGroup().addTo(map)
  } else if (!map.hasLayer(gpxTracksLayerGroup)) {
    gpxTracksLayerGroup.addTo(map)
  }
  uploadedFiles.value.forEach(f => {
    f.visible = true
  })
  updateVisibleGpxLayers()
  persistGpxTracks()
  success('All GPX tracks visible')
}

function hideAllFiles() {
  if (!map) return
  uploadedFiles.value.forEach(f => {
    f.visible = false
    if (f.layer && gpxTracksLayerGroup) gpxTracksLayerGroup.removeLayer(f.layer)
    if (gpxMarkersLayerGroup) {
      if (f.startMarker) gpxMarkersLayerGroup.removeLayer(f.startMarker)
      if (f.endMarker) gpxMarkersLayerGroup.removeLayer(f.endMarker)
    }
  })
  persistGpxTracks()
  info('All GPX tracks hidden')
}

async function removeAllFiles() {
  const confirmed = await confirm(
    'Clear All Uploaded GPX Tracks',
    'Are you sure you want to remove all GPX tracks from the map and server?',
    'Clear All Tracks'
  )
  if (!confirmed) return

  const tracksToClear = [...uploadedFiles.value]

  if (gpxTracksLayerGroup) {
    gpxTracksLayerGroup.clearLayers()
  }
  if (gpxMarkersLayerGroup) {
    gpxMarkersLayerGroup.clearLayers()
  }
  uploadedFiles.value = []
  deletedGpxNames.value.clear()
  await saveGisStorageData(STORAGE_KEY_GPX_TRACKS, [])
  await saveGisStorageData(STORAGE_KEY_DELETED_GPX, [])

  for (const t of tracksToClear) {
    apiDeleteGpxTrack(t.id || t.name).catch(() => {})
  }
  info('Cleared all GPX tracks from map and server')
}

async function clearAllGisMapData() {
  const confirmed = await confirm(
    'Reset & Clear All GIS Data',
    'This will completely clear all registered farmers, parcels, and GPX tracks from both your browser and the cloud server. Are you sure you want to restart fresh?',
    'Reset Everything'
  )
  if (!confirmed) return

  // 1. Clear local memory arrays
  farmers.value = []
  uploadedFiles.value = []
  searchInfoItem.value = null
  searchResults.value = []
  farmerSearchQuery.value = ''
  deletedFarmerNames.value.clear()
  deletedGpxNames.value.clear()

  // 2. Clear Leaflet Map Layers
  if (farmerLayerGroup) farmerLayerGroup.clearLayers()
  if (gpxTracksLayerGroup) gpxTracksLayerGroup.clearLayers()
  if (gpxMarkersLayerGroup) gpxMarkersLayerGroup.clearLayers()
  clearJumpPin()

  // 3. Clear Storage
  await saveGisStorageData(STORAGE_KEY_FARMERS, [])
  await saveGisStorageData(STORAGE_KEY_GPX_TRACKS, [])
  await saveGisStorageData(STORAGE_KEY_DELETED_FARMERS, [])
  await saveGisStorageData(STORAGE_KEY_DELETED_GPX, [])

  // 4. Send clear to server SQLite database
  try {
    await apiClearAllGisData()
  } catch (e) {
    console.warn('Server clear request warning:', e)
  }

  // 5. Update sync status
  syncStatus.value = 'synced'
  syncStatusText.value = 'All data cleared (0 farmers, 0 tracks)'
  lastSyncTime.value = new Date().toLocaleTimeString()
  setStatus('Map and server GIS data cleared — ready for fresh upload', 'success')
  success('Cleared all map data and server storage successfully!')
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
  const detectedBrgy = getBarangayFromCoordinates(file.center.lat, file.center.lng)
  newFarmer.value.name = derived
  newFarmer.value.area = file.areaHectares.toFixed(4)
  autoPopulatedArea.value = file.areaHectares
  newFarmer.value.coords = `${file.center.lat.toFixed(4)},${file.center.lng.toFixed(4)}`
  newFarmer.value.commodity = deriveCommodityFromGPX(file.name)
  newFarmer.value.location = detectedBrgy || deriveLocationFromGPX(file.name) || 'Alcala'

  setStatus(`Auto-filled "${derived}" (${file.areaHectares.toFixed(4)} ha, ${newFarmer.value.location}) from ${file.name}`, 'success')
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
  const detectedComm = getCommodityFromCoordinates(file.center.lat, file.center.lng)
  const commodity = detectedComm || deriveCommodityFromGPX(file.name)
  const detectedBrgy = getBarangayFromCoordinates(file.center.lat, file.center.lng)
  const location = detectedBrgy || deriveLocationFromGPX(file.name) || 'Alcala'

  // Look for existing farmer by derived name or existing linkage
  const existingFarmer = farmers.value.find(f => {
    if (!f || !f.name) return false
    const fUpper = f.name.trim().toUpperCase()
    if (fUpper === derived.toUpperCase()) return true
    if (f.gpxFileName && f.gpxFileName === fileName) return true
    if (Array.isArray(f.gpxFileNames) && f.gpxFileNames.includes(fileName)) return true
    return false
  })

  if (existingFarmer) {
    if (!existingFarmer.parcels) existingFarmer.parcels = []
    
    // Check if a parcel already corresponds to this coordinate or this GPX file
    const existingParcelIdx = existingFarmer.parcels.findIndex(p => {
      if (p.gpxFileName && p.gpxFileName === fileName) return true
      if (p.coords) {
        const [pLat, pLng] = p.coords.split(',').map(Number)
        if (!isNaN(pLat) && !isNaN(pLng)) {
          return Math.abs(pLat - file.center.lat) < 0.001 && Math.abs(pLng - file.center.lng) < 0.001
        }
      }
      return false
    })

    if (existingParcelIdx < 0) {
      existingFarmer.parcels.push({ area: areaHa, coords, gpxFileName: fileName, commodity })
      existingFarmer.area = existingFarmer.parcels.reduce((sum, p) => sum + (Number(p.area) || 0), 0)
      addFarmerMarker(existingFarmer, file.center.lat, file.center.lng, existingFarmer.parcels.length - 1)
    } else {
      const matchingParcel = existingFarmer.parcels[existingParcelIdx]
      if (matchingParcel) {
        if (Math.abs(Number(matchingParcel.area || 0) - areaHa) >= 0.0001) {
          matchingParcel.area = areaHa
          existingFarmer.area = existingFarmer.parcels.reduce((sum, p) => sum + (Number(p.area) || 0), 0)
        }
        if (!matchingParcel.gpxFileName) {
          matchingParcel.gpxFileName = fileName
        }
        if (!matchingParcel.commodity) {
          matchingParcel.commodity = commodity
        }
        matchingParcel.coords = coords
      }
      // Verify farmer marker exists for this parcel
      const hasMarker = farmerMarkers.some(m => 
        (m.farmer === existingFarmer || (m.farmer && m.farmer.name && m.farmer.name.toUpperCase() === existingFarmer.name.toUpperCase())) && 
        (m.parcelIndex === existingParcelIdx || m.marker._parcelIndex === existingParcelIdx)
      )
      if (!hasMarker) {
        addFarmerMarker(existingFarmer, file.center.lat, file.center.lng, existingParcelIdx)
      }
    }

    if (!existingFarmer.location || existingFarmer.location === 'ALCALA, CAGAYAN' || existingFarmer.location === 'Alcala') {
      if (detectedBrgy) existingFarmer.location = detectedBrgy
    }
    if (!existingFarmer.gpxFileNames) existingFarmer.gpxFileNames = []
    if (!existingFarmer.gpxFileNames.includes(fileName)) existingFarmer.gpxFileNames.push(fileName)
    if (!existingFarmer.gpxFileName) existingFarmer.gpxFileName = fileName

    const resolvedComms = resolveFarmerCommodities(existingFarmer)
    if (resolvedComms.length > 0) existingFarmer.commodity = resolvedComms[0]

    file.farmerName = existingFarmer.name
    unmarkFarmerDeleted(existingFarmer.name)
    farmersListRevision.value++
    persistFarmers()
    apiUpdateFarmer(existingFarmer.id || existingFarmer.name, existingFarmer).catch(() => {})
    return existingFarmer
  }

  const farmer = {
    name: derived,
    location,
    commodity,
    gpxFileName: fileName,
    gpxFileNames: [fileName],
    parcels: [{ area: areaHa, coords, gpxFileName: fileName, commodity }]
  }
  farmer.area = areaHa
  file.farmerName = derived
  unmarkFarmerDeleted(derived)
  farmers.value.push(farmer)
  farmersListRevision.value++
  persistFarmers()
  addFarmerMarker(farmer, file.center.lat, file.center.lng, 0)
  apiCreateFarmer(farmer).then(saved => {
    if (saved && saved.id) {
      farmer.id = saved.id
      if (Array.isArray(saved.parcels)) farmer.parcels = saved.parcels
      persistFarmers()
    }
  }).catch(() => {})
  return farmer
}

// Auto-reconcile all uploaded GPX tracks against farmers to ensure no track polygon is left without a farmer record or map marker
async function reconcileOrphanGpxTracks() {
  if (!uploadedFiles.value || uploadedFiles.value.length === 0) return 0

  // 1. Build fast lookup maps over farmers:
  //    - gpxMap: map from lowercase gpxFileName to farmer
  //    - nameMap: map from trimmed uppercase farmer name to farmer
  //    - coordMap: spatial bucket map (key = "round(lat*100),round(lng*100)") -> array of { farmer, parcelIdx, lat, lng }
  const gpxMap = new Map()
  const nameMap = new Map()
  const coordBuckets = new Map()

  function getCoordKey(lat, lng) {
    return `${Math.round(lat * 100)},${Math.round(lng * 100)}`
  }

  function indexFarmer(f) {
    if (!f) return
    if (f.name) {
      nameMap.set(f.name.trim().toUpperCase(), f)
    }
    if (f.gpxFileName) {
      gpxMap.set(String(f.gpxFileName).trim().toLowerCase(), f)
    }
    if (Array.isArray(f.gpxFileNames)) {
      f.gpxFileNames.forEach(fn => {
        if (fn) gpxMap.set(String(fn).trim().toLowerCase(), f)
      })
    }
    if (Array.isArray(f.parcels)) {
      f.parcels.forEach((p, pIdx) => {
        if (p.gpxFileName) {
          gpxMap.set(String(p.gpxFileName).trim().toLowerCase(), f)
        }
        if (p.coords) {
          const [lat, lng] = p.coords.split(',').map(Number)
          if (!isNaN(lat) && !isNaN(lng)) {
            const key = getCoordKey(lat, lng)
            if (!coordBuckets.has(key)) coordBuckets.set(key, [])
            coordBuckets.get(key).push({ farmer: f, parcelIndex: pIdx, lat, lng })
          }
        }
      })
    } else if (f.coords) {
      const [lat, lng] = f.coords.split(',').map(Number)
      if (!isNaN(lat) && !isNaN(lng)) {
        const key = getCoordKey(lat, lng)
        if (!coordBuckets.has(key)) coordBuckets.set(key, [])
        coordBuckets.get(key).push({ farmer: f, parcelIndex: 0, lat, lng })
      }
    }
  }

  for (let i = 0; i < farmers.value.length; i++) {
    indexFarmer(farmers.value[i])
  }

  // Fast marker lookup set: `${farmerName}::${parcelIndex}`
  const existingMarkerKeys = new Set()
  for (let i = 0; i < farmerMarkers.length; i++) {
    const fm = farmerMarkers[i]
    const fn = (fm.farmer && fm.farmer.name) ? fm.farmer.name.toUpperCase() : ''
    const pIdx = fm.parcelIndex !== undefined ? fm.parcelIndex : (fm.marker ? fm.marker._parcelIndex : 0)
    if (fn) existingMarkerKeys.add(`${fn}::${pIdx}`)
  }

  // Fast finder using maps
  function findFastFarmer(fileName, center) {
    const fnLower = (fileName || '').trim().toLowerCase()
    if (gpxMap.has(fnLower)) return gpxMap.get(fnLower)

    const derived = deriveNameFromGPX(fileName).trim().toUpperCase()
    if (nameMap.has(derived)) return nameMap.get(derived)

    if (center && center.lat && center.lng) {
      const key = getCoordKey(center.lat, center.lng)
      // Check exact cell and neighboring cells
      const [cLat, cLng] = [Math.round(center.lat * 100), Math.round(center.lng * 100)]
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nKey = `${cLat + dx},${cLng + dy}`
          const candidates = coordBuckets.get(nKey)
          if (candidates) {
            for (let c = 0; c < candidates.length; c++) {
              const cand = candidates[c]
              if (Math.abs(cand.lat - center.lat) < 0.001 && Math.abs(cand.lng - center.lng) < 0.001) {
                return cand.farmer
              }
            }
          }
        }
      }
    }
    return null
  }

  let newlyRegisteredCount = 0
  let newlyUpdatedCount = 0
  const newlyCreatedFarmers = []
  const newMarkersToInsert = []
  const totalFiles = uploadedFiles.value.length
  const CHUNK_SIZE = 400

  for (let i = 0; i < totalFiles; i++) {
    const file = uploadedFiles.value[i]
    if (!file || !file.name) continue

    const matchingFarmer = findFastFarmer(file.name, file.center)
    if (!matchingFarmer) {
      // Auto-register new farmer record for orphaned track
      const derived = deriveNameFromGPX(file.name)
      const coords = file.center ? `${file.center.lat.toFixed(4)},${file.center.lng.toFixed(4)}` : ''
      const areaHa = Number(Number(file.areaHectares || 0).toFixed(4))
      const detectedComm = file.center ? getCommodityFromCoordinates(file.center.lat, file.center.lng) : null
      const commodity = detectedComm || deriveCommodityFromGPX(file.name)
      const detectedBrgy = file.center ? getBarangayFromCoordinates(file.center.lat, file.center.lng) : null
      const location = detectedBrgy || deriveLocationFromGPX(file.name) || 'Alcala'

      const farmer = {
        name: derived,
        location,
        commodity,
        gpxFileName: file.name,
        gpxFileNames: [file.name],
        parcels: [{ area: areaHa, coords, gpxFileName: file.name, commodity }],
        area: areaHa,
        _cachedCommodities: [commodity],
        _cachedBarangay: location
      }
      file.farmerName = derived
      unmarkFarmerDeleted(derived)
      farmers.value.push(farmer)
      indexFarmer(farmer)
      newlyCreatedFarmers.push(farmer)
      newlyRegisteredCount++

      if (file.center && file.center.lat && file.center.lng) {
        const marker = createFarmerMarkerObject(farmer, file.center.lat, file.center.lng, 0)
        newMarkersToInsert.push(marker)
        farmerMarkers.push({ marker: markRaw(marker), farmer, parcelIndex: 0 })
        existingMarkerKeys.add(`${farmer.name.toUpperCase()}::0`)
      }
    } else {
      // Matching farmer found: ensure parcel & marker exist
      const coords = file.center ? `${file.center.lat.toFixed(4)},${file.center.lng.toFixed(4)}` : ''
      const areaHa = Number(Number(file.areaHectares || 0).toFixed(4))
      if (!matchingFarmer.parcels) matchingFarmer.parcels = []

      let pIdx = -1
      for (let p = 0; p < matchingFarmer.parcels.length; p++) {
        const pr = matchingFarmer.parcels[p]
        if (pr.gpxFileName && pr.gpxFileName === file.name) { pIdx = p; break }
        if (pr.coords && coords && pr.coords === coords) { pIdx = p; break }
        if (pr.coords && file.center) {
          const [pLat, pLng] = pr.coords.split(',').map(Number)
          if (!isNaN(pLat) && !isNaN(pLng) && Math.abs(pLat - file.center.lat) < 0.001 && Math.abs(pLng - file.center.lng) < 0.001) {
            pIdx = p
            break
          }
        }
      }

      if (pIdx < 0 && coords) {
        const pComm = file.commodity || (file.center ? getCommodityFromCoordinates(file.center.lat, file.center.lng) : null) || 'Rice'
        matchingFarmer.parcels.push({
          area: areaHa,
          coords,
          gpxFileName: file.name,
          commodity: pComm
        })
        matchingFarmer.area = matchingFarmer.parcels.reduce((s, p) => s + (Number(p.area) || 0), 0)
        pIdx = matchingFarmer.parcels.length - 1
        delete matchingFarmer._cachedCommodities

        if (file.center && file.center.lat && file.center.lng) {
          const marker = createFarmerMarkerObject(matchingFarmer, file.center.lat, file.center.lng, pIdx)
          newMarkersToInsert.push(marker)
          farmerMarkers.push({ marker: markRaw(marker), farmer: matchingFarmer, parcelIndex: pIdx })
          existingMarkerKeys.add(`${matchingFarmer.name.toUpperCase()}::${pIdx}`)
        }
        newlyUpdatedCount++
      } else if (pIdx >= 0 && file.center && file.center.lat && file.center.lng) {
        if (!matchingFarmer.parcels[pIdx].gpxFileName) {
          matchingFarmer.parcels[pIdx].gpxFileName = file.name
          newlyUpdatedCount++
        }
        const mKey = `${matchingFarmer.name.toUpperCase()}::${pIdx}`
        if (!existingMarkerKeys.has(mKey)) {
          const marker = createFarmerMarkerObject(matchingFarmer, file.center.lat, file.center.lng, pIdx)
          newMarkersToInsert.push(marker)
          farmerMarkers.push({ marker: markRaw(marker), farmer: matchingFarmer, parcelIndex: pIdx })
          existingMarkerKeys.add(mKey)
        }
      }

      if (!matchingFarmer.gpxFileNames) matchingFarmer.gpxFileNames = []
      if (!matchingFarmer.gpxFileNames.includes(file.name)) matchingFarmer.gpxFileNames.push(file.name)
      if (!matchingFarmer.gpxFileName) matchingFarmer.gpxFileName = file.name
      file.farmerName = matchingFarmer.name
    }

    // Yield to the event loop in chunks of CHUNK_SIZE
    if (i % CHUNK_SIZE === 0 && i > 0) {
      if (newMarkersToInsert.length > 0 && farmerLayerGroup) {
        farmerLayerGroup.addLayers(newMarkersToInsert.splice(0, newMarkersToInsert.length))
      }
      if (isInitialLoading.value) {
        loadingMessage.value = `Reconciling farm parcels (${i} / ${totalFiles})...`
      }
      await new Promise(r => setTimeout(r, 0))
    }
  }

  // Insert any remaining markers
  if (newMarkersToInsert.length > 0 && farmerLayerGroup) {
    farmerLayerGroup.addLayers(newMarkersToInsert)
  }

  // Persist only once if any farmers were created or updated
  if (newlyRegisteredCount > 0 || newlyUpdatedCount > 0) {
    farmersListRevision.value++
    await persistFarmers()
  }

  // Asynchronously push newly created farmers to SQLite backend in background
  if (newlyCreatedFarmers.length > 0) {
    apiCreateFarmer(newlyCreatedFarmers).catch(err => console.warn('Background server sync for reconciled farmers:', err))
  }

  return newlyRegisteredCount
}

async function registerFarmer() {
  if (!newFarmer.value.name || !newFarmer.value.area) {
    warning('Please provide at least a Farmer Name and Farm Area.')
    return
  }
  const area = parseFloat(newFarmer.value.area)
  const coords = (newFarmer.value.coords || '').trim()
  let detectedBrgy = null
  if (coords) {
    const [lat, lng] = coords.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      detectedBrgy = getBarangayFromCoordinates(lat, lng)
    }
  }

  const farmer = {
    name: newFarmer.value.name.trim().toUpperCase(),
    location: (newFarmer.value.location || detectedBrgy || 'Alcala').trim(),
    commodity: newFarmer.value.commodity || 'Rice',
    parcels: []
  }
  if (area > 0) {
    farmer.parcels.push({ area, coords })
  }
  farmer.area = farmer.parcels.reduce((sum, p) => sum + (p.area || 0), 0)
  await unmarkFarmerDeleted(farmer.name)
  farmers.value.push(farmer)
  await persistFarmers()

  if (coords) {
    const [lat, lng] = coords.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      addFarmerMarker(farmer, lat, lng, 0)
    }
  }

  const registeredName = farmer.name
  const registeredLocation = farmer.location
  newFarmer.value = { name: '', location: '', area: '', coords: '', commodity: 'Rice' }
  autoPopulatedArea.value = null

  syncStatus.value = 'syncing'
  syncStatusText.value = `Registering "${registeredName}"...`

  try {
    const saved = await apiCreateFarmer(farmer)
    if (saved && saved.id) {
      farmer.id = saved.id
      if (Array.isArray(saved.parcels)) farmer.parcels = saved.parcels
      await persistFarmers()
    }
    syncStatus.value = 'synced'
    syncStatusText.value = `In sync (${farmers.value.length} farmers, ${uploadedFiles.value.length} tracks)`
    lastSyncTime.value = new Date().toLocaleTimeString()
    success(`Farmer "${registeredName}" registered in ${registeredLocation}!`)
  } catch (err) {
    console.warn('Server create farmer warning:', err)
  }
}

function isGpxTrackRelatedToFarmer(track, farmer) {
  if (!track || !farmer) return false
  const farmerName = (farmer.name || '').trim().toUpperCase()
  if (!farmerName || farmerName === 'UNKNOWN FARMER') return false

  const trackName = (track.name || '').trim().toUpperCase()
  const trackBaseName = trackName.replace(/\.GPX$/i, '').trim()
  const trackFarmerName = (track.farmerName || '').trim().toUpperCase()

  // 1. Linked by explicit gpxFileName on farmer
  if (farmer.gpxFileName) {
    const fn = String(farmer.gpxFileName).trim().toUpperCase()
    const fnBase = fn.replace(/\.GPX$/i, '').trim()
    if (fn === trackName || fnBase === trackBaseName) return true
  }

  // 2. Linked by explicit gpxFileNames array on farmer
  if (Array.isArray(farmer.gpxFileNames)) {
    const isDirectMatch = farmer.gpxFileNames.some(fName => {
      const fn = String(fName).trim().toUpperCase()
      const fnBase = fn.replace(/\.GPX$/i, '').trim()
      return fn === trackName || fnBase === trackBaseName
    })
    if (isDirectMatch) return true
  }

  // 3. Linked by explicit gpxFileName on any of the farmer's parcels
  if (Array.isArray(farmer.parcels)) {
    const isParcelMatch = farmer.parcels.some(p => {
      if (!p || !p.gpxFileName) return false
      const fn = String(p.gpxFileName).trim().toUpperCase()
      const fnBase = fn.replace(/\.GPX$/i, '').trim()
      return fn === trackName || fnBase === trackBaseName
    })
    if (isParcelMatch) return true
  }

  // 4. Track has explicitly assigned farmerName property matching this farmer
  if (trackFarmerName && trackFarmerName === farmerName) {
    return true
  }

  // 5. Track filename directly contains or equals farmer name
  if (trackBaseName === farmerName || trackBaseName.includes(farmerName) || farmerName.includes(trackBaseName)) {
    return true
  }

  // 6. Derived farmer name from GPX strictly equals farmer name
  const derived = deriveNameFromGPX(track.name).trim().toUpperCase()
  if (derived && derived !== 'UNKNOWN FARMER' && (derived === farmerName || farmerName.includes(derived) || derived.includes(farmerName))) {
    return true
  }

  return false
}

function findGpxTrackForParcel(farmer, parcel) {
  if (!farmer || !parcel) return null
  const farmerName = (farmer.name || '').trim().toUpperCase()

  // 1. If parcel already has an explicit gpxFileName, check if that file exists in uploadedFiles
  if (parcel.gpxFileName) {
    const exact = uploadedFiles.value.find(t => t.name === parcel.gpxFileName)
    if (exact) return exact
  }

  // 2. Filter uploadedFiles to ONLY tracks that belong to THIS specific farmer
  const farmerTracks = uploadedFiles.value.filter(t => isGpxTrackRelatedToFarmer(t, farmer))

  if (farmerTracks.length === 0) return null
  if (farmerTracks.length === 1) return farmerTracks[0]

  // 3. If farmer has multiple tracks, find the best match for this parcel among the farmer's tracks
  const pArea = Number(parcel.area || 0)
  let pLat = null
  let pLng = null
  if (parcel.coords) {
    const parts = parcel.coords.split(',').map(Number)
    if (!isNaN(parts[0]) && !isNaN(parts[1])) {
      pLat = parts[0]
      pLng = parts[1]
    }
  }

  let bestMatch = null
  let lowestScore = Infinity

  for (const track of farmerTracks) {
    let score = 0
    // Area difference score
    if (pArea > 0 && track.areaHectares > 0) {
      const areaDiff = Math.abs(track.areaHectares - pArea)
      score += areaDiff * 10
    }
    // Coordinate distance score
    if (pLat !== null && pLng !== null && track.center) {
      const dist = Math.hypot(track.center.lat - pLat, track.center.lng - pLng)
      score += dist * 1000
    }
    if (score < lowestScore) {
      lowestScore = score
      bestMatch = track
    }
  }

  return bestMatch
}

async function removeFarmer(target, skipConfirm = false) {
  let index = typeof target === 'number' ? target : farmers.value.indexOf(target)
  if (index === -1 && typeof target === 'object' && target) {
    index = farmers.value.findIndex(f => f.name && target.name && f.name.toUpperCase() === target.name.toUpperCase())
  }
  const farmer = index >= 0 ? farmers.value[index] : null
  if (!farmer) return false
  if (!skipConfirm) {
    const confirmed = await confirm('Delete Farmer', `Are you sure you want to delete "${farmer.name}" and remove any related GPX tracks?`, 'Delete')
    if (!confirmed) return false
  }

  isDeletingFarmer.value = true
  const targetName = (farmer.name || '').trim().toUpperCase()
  syncStatus.value = 'syncing'
  syncStatusText.value = `Deleting farmer "${targetName}"...`

  try {
    // 1. Mark as deleted so server sync never restores this farmer
    await markFarmerDeleted(targetName)

    // 2. Remove farmer from in-memory list and map marker
    farmers.value.splice(index, 1)
    removeFarmerMarker(farmer)
    await persistFarmers()

    // 3. Find and remove all related GPX tracks from map, uploadedFiles list, and storage
    const removedTracks = []
    for (let i = uploadedFiles.value.length - 1; i >= 0; i--) {
      const track = uploadedFiles.value[i]
      if (isGpxTrackRelatedToFarmer(track, farmer)) {
        removedTracks.push(track.name)
        await markGpxDeleted(track.name)

        if (track.layer && gpxTracksLayerGroup) {
          try { gpxTracksLayerGroup.removeLayer(track.layer) } catch (_) {}
        }
        if (gpxMarkersLayerGroup) {
          if (track.startMarker) try { gpxMarkersLayerGroup.removeLayer(track.startMarker) } catch (_) {}
          if (track.endMarker) try { gpxMarkersLayerGroup.removeLayer(track.endMarker) } catch (_) {}
        }
        uploadedFiles.value.splice(i, 1)
      }
    }

    if (removedTracks.length > 0) {
      await persistGpxTracks()
    }

    // 4. Clear search selection if currently on this farmer or deleted track
    if (searchInfoItem.value) {
      const sName = (searchInfoItem.value.name || (searchInfoItem.value.data && searchInfoItem.value.data.name) || '').trim().toUpperCase()
      if (sName === targetName || removedTracks.some(rt => rt.toUpperCase() === sName)) {
        searchInfoItem.value = null
      }
    }

    // 5. Send DELETE requests to server endpoints
    const farmerIdOrName = farmer.id || targetName
    try {
      await apiDeleteFarmer(farmerIdOrName)
      for (const track of removedTracks) {
        await apiDeleteGpxTrack(track)
      }
    } catch (e) {
      console.warn('Server delete farmer warning:', e)
    }

    syncStatus.value = 'synced'
    syncStatusText.value = `In sync (${farmers.value.length} farmers, ${uploadedFiles.value.length} tracks)`
    lastSyncTime.value = new Date().toLocaleTimeString()
    info(`Deleted farmer "${targetName}"${removedTracks.length > 0 ? ` and ${removedTracks.length} related GPX track(s)` : ''}`)
    return true
  } finally {
    isDeletingFarmer.value = false
  }
}

function locateFarmer(target) {
  const index = typeof target === 'number' ? target : farmers.value.indexOf(target)
  const farmer = typeof target === 'object' && target ? target : (index >= 0 ? farmers.value[index] : null)
  if (!farmer) return
  const firstParcel = farmer.parcels && farmer.parcels.length > 0 ? farmer.parcels[0] : null
  const coords = firstParcel && firstParcel.coords ? firstParcel.coords : farmer.coords
  if (coords && map) {
    const [lat, lng] = coords.split(',').map(Number)
    if (!isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 16, { duration: 1.0 })
      setStatus(`Locating ${farmer.name} (${resolveFarmerBarangay(farmer)})`, 'info')

      const fm = farmerMarkers.find(m => m.farmer === farmer || (m.farmer.name && farmer.name && m.farmer.name.toUpperCase() === farmer.name.toUpperCase()))
      if (fm && fm.marker) {
        setTimeout(() => {
          if (fm.marker) {
            if (farmerLayerGroup && farmerLayerGroup.zoomToShowLayer) {
              farmerLayerGroup.zoomToShowLayer(fm.marker, () => {
                fm.marker.openPopup()
              })
            } else {
              fm.marker.openPopup()
            }
          }
        }, 300)
      }
      return
    }
  }
  warning(`No valid coordinates found for ${farmer.name}`)
}

function editFarmer(target) {
  const index = typeof target === 'number' ? target : farmers.value.indexOf(target)
  const farmer = typeof target === 'object' && target ? target : (index >= 0 ? farmers.value[index] : null)
  if (!farmer) return
  const clone = { ...farmer }
  clone.address = clone.address || null
  clone.location = resolveFarmerBarangay(farmer)
  clone.parcels = (farmer.parcels || []).map(p => {
    const pClone = { ...p }
    if (!pClone.gpxFileName) {
      const match = findGpxTrackForParcel(farmer, pClone)
      if (match) pClone.gpxFileName = match.name
    }
    return pClone
  })
  if (clone.parcels.length === 0 && (clone.coords || clone.area)) {
    clone.parcels.push({ area: clone.area || 0, coords: clone.coords || '', gpxFileName: farmer.gpxFileName || null })
  }
  editingFarmer.value = clone
  editingIndex.value = index >= 0 ? index : farmers.value.findIndex(f => f.name && farmer.name && f.name.toUpperCase() === farmer.name.toUpperCase())
}

function openEditFarmerByName(name) {
  if (!name) return
  const target = String(name).trim().toUpperCase()
  const idx = farmers.value.findIndex(f => f.name && f.name.trim().toUpperCase() === target)
  if (idx >= 0) {
    editFarmer(idx)
  } else {
    const matchingGpx = uploadedFiles.value.find(g => {
      const derived = deriveNameFromGPX(g.name).toUpperCase()
      return derived === target || g.name.toUpperCase().includes(target)
    })
    if (matchingGpx) {
      const created = autoRegisterFromGPX(matchingGpx.name)
      if (created) {
        const newIdx = farmers.value.indexOf(created)
        if (newIdx >= 0) {
          editFarmer(newIdx)
          return
        }
      }
    }
    warning(`Farmer profile "${name}" not found in registered list.`)
  }
}

function addParcel(farmer) {
  if (!farmer.parcels) farmer.parcels = []
  farmer.parcels.push({ area: 0, coords: '' })
}

async function removeParcel(farmer, pIdx) {
  if (!farmer || !farmer.parcels || !farmer.parcels[pIdx]) return

  const targetIdx = editingIndex.value >= 0 ? editingIndex.value : farmers.value.indexOf(farmer)
  const parcel = farmer.parcels[pIdx]
  const isLastParcel = farmer.parcels.length <= 1

  if (isLastParcel) {
    const farmerName = farmer.name || 'this farmer'
    editingFarmer.value = null
    editingIndex.value = -1

    const confirmed = await confirm(
      'Delete Farmer Profile',
      `Deleting the only parcel will delete "${farmerName}" and remove any related GPX tracks from the map. Do you want to proceed?`,
      'Delete Farmer'
    )

    if (!confirmed) {
      if (targetIdx >= 0 && farmers.value[targetIdx]) {
        editingFarmer.value = JSON.parse(JSON.stringify(farmers.value[targetIdx]))
        editingIndex.value = targetIdx
      }
      return
    }

    if (targetIdx >= 0) {
      await removeFarmer(targetIdx, true)
    }
    return
  }

  // Multi-parcel removal
  const confirmed = await confirm(
    'Delete Parcel',
    `Are you sure you want to remove Parcel #${pIdx + 1} (${parcel.area} ha)? If it is tied to a GPX track file, that GPX file will also be removed from the map and server.`,
    'Delete Parcel'
  )
  if (!confirmed) return

  // 1. Locate tied GPX track for this specific parcel
  const linkedGpxName = parcel.gpxFileName
  let matchingTrack = null

  if (linkedGpxName) {
    matchingTrack = uploadedFiles.value.find(t => t.name === linkedGpxName)
  }

  if (!matchingTrack && parcel.coords) {
    const [pLat, pLng] = parcel.coords.split(',').map(Number)
    if (!isNaN(pLat) && !isNaN(pLng)) {
      matchingTrack = uploadedFiles.value.find(t => {
        if (!t.center) return false
        return Math.hypot(t.center.lat - pLat, t.center.lng - pLng) < 0.0003
      })
    }
  }

  // 2. If matching GPX track found, delete it from map, uploadedFiles, IndexedDB, and server
  if (matchingTrack) {
    const trackName = matchingTrack.name
    await markGpxDeleted(trackName)

    if (matchingTrack.layer && gpxTracksLayerGroup) {
      try { gpxTracksLayerGroup.removeLayer(matchingTrack.layer) } catch (_) {}
    }
    if (gpxMarkersLayerGroup) {
      if (matchingTrack.startMarker) try { gpxMarkersLayerGroup.removeLayer(matchingTrack.startMarker) } catch (_) {}
      if (matchingTrack.endMarker) try { gpxMarkersLayerGroup.removeLayer(matchingTrack.endMarker) } catch (_) {}
    }

    const tIdx = uploadedFiles.value.indexOf(matchingTrack)
    if (tIdx >= 0) {
      uploadedFiles.value.splice(tIdx, 1)
    }
    gpxListRevision.value++
    await persistGpxTracks()
    apiDeleteGpxTrack(matchingTrack.id || trackName).catch(() => {})

    if (Array.isArray(farmer.gpxFileNames)) {
      farmer.gpxFileNames = farmer.gpxFileNames.filter(fn => fn !== trackName)
    }
    if (farmer.gpxFileName === trackName) {
      farmer.gpxFileName = (farmer.gpxFileNames && farmer.gpxFileNames.length > 0) ? farmer.gpxFileNames[0] : null
    }
  }

  // 3. Remove parcel from modal and farmers array
  farmer.parcels.splice(pIdx, 1)
  farmer.area = farmer.parcels.reduce((sum, p) => sum + (Number(p.area) || 0), 0)

  if (targetIdx >= 0 && farmers.value[targetIdx]) {
    farmers.value[targetIdx].parcels = farmer.parcels.map(p => ({ ...p }))
    farmers.value[targetIdx].area = farmer.area
    farmers.value[targetIdx].gpxFileName = farmer.gpxFileName
    farmers.value[targetIdx].gpxFileNames = farmer.gpxFileNames
    farmersListRevision.value++
    await persistFarmers()
    renderFarmersData(farmers.value)
    apiUpdateFarmer(farmers.value[targetIdx].id || farmers.value[targetIdx].name, farmers.value[targetIdx]).catch(() => {})
  }

  info(`Removed Parcel #${pIdx + 1}${matchingTrack ? ` and its GPX track "${matchingTrack.name}"` : ''}`)
}

async function saveFarmerEdit() {
  if (editingIndex.value >= 0) {
    isSavingFarmer.value = true
    syncStatus.value = 'syncing'
    syncStatusText.value = 'Saving farmer...'

    try {
      const oldFarmer = farmers.value[editingIndex.value]
      const updated = {
        ...editingFarmer.value,
        name: (editingFarmer.value.name || '').trim().toUpperCase(),
        address: editingFarmer.value.address && editingFarmer.value.address.trim() ? editingFarmer.value.address.trim() : null,
        location: (editingFarmer.value.location || '').trim().toUpperCase(),
        updated_at: new Date().toISOString()
      }
      if (updated.parcels && updated.parcels.length > 0) {
        updated.area = updated.parcels.reduce((sum, p) => sum + (Number(p.area) || 0), 0)
        updated.parcels.forEach(p => {
          if (p.coords) {
            const [lat, lng] = p.coords.split(',').map(Number)
            if (!isNaN(lat) && !isNaN(lng)) {
              const matchedComm = getCommodityFromCoordinates(lat, lng)
              if (matchedComm) p.commodity = matchedComm
            }
          }
        })
        const resolvedComms = resolveFarmerCommodities(updated)
        if (resolvedComms.length > 0) {
          updated.commodity = resolvedComms[0]
        }
      }
      await unmarkFarmerDeleted(updated.name)
      if (oldFarmer.name && oldFarmer.name.trim().toUpperCase() !== updated.name) {
        await markFarmerDeleted(oldFarmer.name)
      }
      farmers.value[editingIndex.value] = updated
      await persistFarmers()

      // 1. Sync corresponding GPX tracks in uploadedFiles and farm_area_gis_gpx_tracks
      let gpxUpdated = false
      const updatedTracks = []
      const oldNameUpper = (oldFarmer.name || '').trim().toUpperCase()
      const newNameUpper = updated.name

      uploadedFiles.value.forEach(track => {
        const trackDerivedName = deriveNameFromGPX(track.name).trim().toUpperCase()
        const isNameMatch = trackDerivedName === oldNameUpper || 
                            (track.name && track.name.toUpperCase().includes(oldNameUpper)) ||
                            (track.farmerName && track.farmerName.toUpperCase() === oldNameUpper) ||
                            (oldFarmer.gpxFileName && oldFarmer.gpxFileName === track.name) ||
                            (oldFarmer.gpxFileNames && Array.isArray(oldFarmer.gpxFileNames) && oldFarmer.gpxFileNames.includes(track.name))

        // Also check coordinate proximity match
        let isCoordMatch = false
        if (!isNameMatch && track.center && oldFarmer.parcels) {
          isCoordMatch = oldFarmer.parcels.some(p => {
            if (!p.coords) return false
            const [pLat, pLng] = p.coords.split(',').map(Number)
            return !isNaN(pLat) && !isNaN(pLng) && 
                   Math.abs(pLat - track.center.lat) < 0.001 && 
                   Math.abs(pLng - track.center.lng) < 0.001
          })
        }

        if (isNameMatch || isCoordMatch) {
          gpxUpdated = true
          track.farmerName = newNameUpper

          // If the track was named after the old farmer name, keep track.name synced
          if (oldNameUpper && oldNameUpper !== newNameUpper) {
            if (track.name.toUpperCase().includes(oldNameUpper)) {
              track.name = track.name.replace(new RegExp(oldNameUpper, 'i'), newNameUpper)
            } else if (trackDerivedName === oldNameUpper) {
              track.name = `${newNameUpper}.gpx`
            }
          }
          track.address = updated.address
          track.location = updated.location
          track.commodity = updated.commodity

          if (updated.parcels && updated.parcels.length === 1 && updated.parcels[0].area > 0) {
            track.areaHectares = Number(updated.parcels[0].area)
            track.areaKm2 = track.areaHectares / 100
          }

          // Update popup immediately if layer exists
          if (track.layer) {
            const newPopupHtml = buildGpxPopupHtml(track.name, track.points, track.color, track.areaHectares, track.areaKm2, track.isEnclosed, track.center)
            track.layer.setPopupContent(newPopupHtml)
          }
          if (track.startMarker) {
            track.startMarker.setPopupContent(`<strong>${escapeHtml(newNameUpper)}</strong><br>Track Start<br><small>${track.points && track.points[0] ? `${track.points[0][0].toFixed(5)}, ${track.points[0][1].toFixed(5)}` : ''}</small>`)
          }
          if (track.endMarker) {
            track.endMarker.setPopupContent(`<strong>${escapeHtml(newNameUpper)}</strong><br>Track End<br><small>${track.points && track.points.length ? `${track.points[track.points.length - 1][0].toFixed(5)}, ${track.points[track.points.length - 1][1].toFixed(5)}` : ''}</small>`)
          }

          updatedTracks.push(track)
        }
      })

      if (gpxUpdated) {
        await persistGpxTracks()
        for (const t of updatedTracks) {
          apiUpdateGpxTrack(t.id || t.name, t).catch(() => {})
        }
      }

      // 2. Refresh all farmer markers on the map
      renderFarmersData(farmers.value)

      // 3. Update search info panel if open for this farmer
      if (searchInfoItem.value) {
        if (searchInfoItem.value.data && (searchInfoItem.value.data.name === oldFarmer.name || searchInfoItem.value.name === oldFarmer.name)) {
          searchInfoItem.value.name = updated.name
          searchInfoItem.value.address = updated.address
          searchInfoItem.value.location = updated.location
          searchInfoItem.value.commodity = updated.commodity
          searchInfoItem.value.area = updated.area
          searchInfoItem.value.parcels = updated.parcels
          searchInfoItem.value.data = { ...searchInfoItem.value.data, ...updated }
        }
      }

      // 4. Trigger leaflet popup updates
      refreshAllMapPopups()

      const targetIdOrName = updated.id || oldFarmer.id || oldNameUpper
      try {
        const saved = await apiUpdateFarmer(targetIdOrName, updated)
        if (saved && saved.id) {
          updated.id = saved.id
          if (Array.isArray(saved.parcels)) updated.parcels = saved.parcels
          await persistFarmers()
        }
      } catch (err) {
        console.warn('Server update farmer warning:', err)
      }

      syncStatus.value = 'synced'
      syncStatusText.value = `In sync (${farmers.value.length} farmers, ${uploadedFiles.value.length} tracks)`
      lastSyncTime.value = new Date().toLocaleTimeString()
      success(`Updated farmer "${updated.name}"`)
    } finally {
      isSavingFarmer.value = false
      editingFarmer.value = null
      editingIndex.value = -1
    }
  }
}

// Drawing & Measurements
// Layer Visibility Toggles
function toggleParcelPolygons() {
  parcelPolygonsVisible.value = !parcelPolygonsVisible.value
  if (!map || !gpxTracksLayerGroup) return
  if (parcelPolygonsVisible.value) {
    if (!map.hasLayer(gpxTracksLayerGroup)) gpxTracksLayerGroup.addTo(map)
    updateVisibleGpxLayers()
    info('Parcel polygons visible')
    setStatus('Parcel polygons shown', 'info')
  } else {
    if (map.hasLayer(gpxTracksLayerGroup)) map.removeLayer(gpxTracksLayerGroup)
    info('Parcel polygons hidden (boosts map clarity & performance)')
    setStatus('Parcel polygons hidden', 'info')
  }
}

function toggleFarmerMarkers() {
  farmerMarkersVisible.value = !farmerMarkersVisible.value
  if (!map || !farmerLayerGroup) return
  if (farmerMarkersVisible.value) {
    if (!map.hasLayer(farmerLayerGroup)) farmerLayerGroup.addTo(map)
    info('Farmer pin markers visible')
    setStatus('Farmer pin markers shown', 'info')
  } else {
    if (map.hasLayer(farmerLayerGroup)) map.removeLayer(farmerLayerGroup)
    info('Farmer pin markers hidden (boosts map performance)')
    setStatus('Farmer pin markers hidden', 'info')
  }
}

function toggleGpxMarkers() {
  gpxMarkersVisible.value = !gpxMarkersVisible.value
  if (!map || !gpxMarkersLayerGroup) return
  if (gpxMarkersVisible.value) {
    if (!map.hasLayer(gpxMarkersLayerGroup)) gpxMarkersLayerGroup.addTo(map)
    updateVisibleGpxLayers()
    info('GPX track endpoint markers visible')
    setStatus('GPX endpoint markers shown', 'info')
  } else {
    if (map.hasLayer(gpxMarkersLayerGroup)) map.removeLayer(gpxMarkersLayerGroup)
    info('GPX track endpoint markers hidden (boosts map performance)')
    setStatus('GPX endpoint markers hidden', 'info')
  }
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

// Commodity Type Polygons (Rice & Corn)
async function loadCommodityGeoJson() {
  if (commodityGeoJsonCache) return commodityGeoJsonCache

  try {
    const res = await import('@/assets/Riceandcorncommodity_wgs84.json')
    commodityGeoJsonCache = res.default || res
    return commodityGeoJsonCache
  } catch (err) {
    console.warn('Direct WGS84 commodity JSON load failed, falling back to dynamic conversion:', err)
  }

  // Fallback: Dynamically import and convert from EPSG:32651
  const rawMod = await import('@/assets/Riceandcorncommodity.json')
  const raw = rawMod.default || rawMod
  const convertedFeatures = (raw.features || []).map(f => ({
    type: 'Feature',
    id: f.id,
    properties: f.properties,
    geometry: {
      type: f.geometry.type,
      coordinates: convertUtmCoords(f.geometry.coordinates)
    }
  }))

  commodityGeoJsonCache = {
    type: 'FeatureCollection',
    features: convertedFeatures
  }
  return commodityGeoJsonCache
}

async function initCommodityLayer() {
  if (!map) return

  if (commodityLayer) {
    if (map.hasLayer(commodityLayer)) map.removeLayer(commodityLayer)
    commodityLayer = null
  }

  isCommodityLoading.value = true
  setStatus('Loading Rice & Corn commodity polygons...', 'info')

  try {
    const geojson = await loadCommodityGeoJson()
    if (!geojson || !geojson.features) {
      warning('Failed to parse commodity features data.')
      return
    }

    commodityFeaturesCount.value = geojson.features.length

    commodityLayer = L.geoJSON(geojson, {
      style: (feature) => {
        const commodity = (feature && feature.properties && feature.properties.Commodity) || ''
        const isRice = commodity.toLowerCase() === 'rice'
        const isCorn = commodity.toLowerCase() === 'corn'

        return {
          color: isRice ? '#059669' : isCorn ? '#d97706' : '#2563eb',
          weight: 1.5,
          opacity: 0.9,
          fillColor: isRice ? '#10b981' : isCorn ? '#f59e0b' : '#3b82f6',
          fillOpacity: 0.45
        }
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {}
        const commodityName = props.Commodity || 'Crop'
        const fid = props.FID !== undefined ? props.FID : (feature.id || '—')
        const isRice = commodityName.toLowerCase() === 'rice'
        const badgeColor = isRice ? '#059669' : '#d97706'
        const icon = isRice ? '🌾' : '🌽'

        layer.bindTooltip(`
          <div style="font-weight:700;font-size:12px;color:${badgeColor};display:flex;align-items:center;gap:4px;">
            <span>${icon}</span>
            <span>Commodity: ${escapeHtml(commodityName)}</span>
          </div>
          <div style="font-size:10.5px;color:#4b5563;margin-top:2px;">
            Feature ID: ${escapeHtml(String(fid))}
          </div>
        `, {
          sticky: true,
          direction: 'top',
          className: 'commodity-map-tooltip'
        })

        layer.on('mouseover', () => {
          layer.setStyle({
            weight: 2.5,
            fillOpacity: 0.68
          })
        })

        layer.on('mouseout', () => {
          const isRiceItem = (props.Commodity || '').toLowerCase() === 'rice'
          layer.setStyle({
            weight: 1.5,
            fillOpacity: 0.45,
            color: isRiceItem ? '#059669' : '#d97706'
          })
        })
      }
    })

    if (commodityPolygonsVisible.value) {
      commodityLayer.addTo(map)
    }
  } catch (err) {
    console.error('Error loading commodity layer:', err)
    warning('Failed to render commodity layer')
  } finally {
    isCommodityLoading.value = false
  }
}

async function toggleCommodityPolygons() {
  if (isCommodityLoading.value) return
  commodityPolygonsVisible.value = !commodityPolygonsVisible.value

  if (!map) return

  if (commodityPolygonsVisible.value) {
    if (!commodityLayer) {
      await initCommodityLayer()
    } else if (!map.hasLayer(commodityLayer)) {
      commodityLayer.addTo(map)
    }
    info('🌾 Rice & Corn commodity polygons enabled')
    setStatus('Rice & Corn commodity layer visible', 'info')
  } else {
    if (commodityLayer && map.hasLayer(commodityLayer)) {
      map.removeLayer(commodityLayer)
    }
    info('Rice & Corn commodity polygons hidden')
    setStatus('Commodity polygons hidden', 'info')
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

function switchToLayer(layerName) {
  if (!map) return
  Object.values(baseLayers).forEach(l => {
    if (map.hasLayer(l)) map.removeLayer(l)
  })
  const mapKey = {
    terrain: 'terrain',
    satellite: 'satellite',
    topo: 'topo',
    dark: 'dark'
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
  const header = ['Farmer Name', 'Farmer Address', 'Farm Location', 'Commodity', 'Parcel #', 'Area (ha)', 'Coordinates']
  const rows = []
  farmers.value.forEach(f => {
    const parcels = f.parcels && f.parcels.length > 0 ? f.parcels : [{ area: f.area || '', coords: f.coords || '' }]
    parcels.forEach((p, idx) => {
      rows.push([
        f.name || '',
        f.address || '',
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

async function exportOverlapReportCSV() {
  if (uploadedFiles.value.length < 2) {
    warning('At least 2 GPX tracks are required to analyze overlaps.')
    return
  }

  isGeneratingOverlapReport.value = true
  overlapProgress.value = 0
  overlapStatusMessage.value = 'Preparing & validating field polygons...'
  overlapMetrics.value = {
    polygons: uploadedFiles.value.length,
    candidates: 0,
    matches: 0
  }
  setStatus('Analyzing GPX polygon overlaps...', 'info')

  overlapAbortController = new AbortController()

  try {
    // Format all uploaded GPX records with complete attributes
    const records = uploadedFiles.value.map(file => {
      const farmerName = file.farmerName || deriveNameFromGPX(file.name) || ''
      const location = file.location || resolveGpxBarangay(file.name, file.center) || ''
      const commodity = file.commodity || deriveCommodityFromGPX(file.name) || ''
      return {
        name: file.name,
        farmerName: farmerName || null,
        address: file.address || null,
        location: location || null,
        commodity: commodity || null,
        color: file.color,
        center: file.center,
        points: file.points || [],
        pointCount: file.pointCount || (file.points ? file.points.length : 0),
        visible: file.visible !== false,
        areaKm2: file.areaKm2,
        areaHectares: file.areaHectares,
        areaMethod: file.areaMethod || 'polygon',
        isEnclosed: file.isEnclosed !== false,
        updated_at: file.updated_at || new Date().toISOString()
      }
    })

    const { csv, summary } = await generateGpxOverlapReport(records, {
      minOverlapPct: overlapScanThreshold.value,
      signal: overlapAbortController.signal,
      onProgress: ({ stageMessage, percent, polygonsCount, candidatePairsCount, matchesCount }) => {
        overlapProgress.value = percent
        overlapStatusMessage.value = stageMessage
        overlapMetrics.value = {
          polygons: polygonsCount || records.length,
          candidates: candidatePairsCount || 0,
          matches: matchesCount || 0
        }
        setStatus(`Analyzing overlaps: ${percent}% (${matchesCount} found)...`, 'info')
      }
    })

    console.log('=== GPX FIELD POLYGON OVERLAP REPORT SUMMARY ===')
    console.log(`Total Polygons Checked:  ${summary.totalPolygonsChecked}`)
    console.log(`Valid Polygons Compared: ${summary.validPolygonsCompared}`)
    console.log(`Candidate Pairs Checked: ${summary.candidatePairsChecked}`)
    console.log(`Total Overlapping Pairs: ${summary.totalOverlappingPairs}`)
    console.log(`- Duplicate (>90%):      ${summary.duplicateCount}`)
    console.log(`- Major Overlap (>30%):  ${summary.majorOverlapCount}`)
    console.log(`- Minor Overlap (<=30%): ${summary.minorOverlapCount}`)
    console.log('================================================')

    if (summary.totalOverlappingPairs === 0) {
      info('No overlapping GPX track polygons were detected among the uploaded tracks.')
    } else {
      const timestamp = new Date().toISOString().slice(0, 10)
      downloadFile('\uFEFF' + csv, `overlap_report_${timestamp}.csv`, 'text/csv;charset=utf-8;')
      success(`Overlap report generated: ${summary.totalOverlappingPairs} overlapping pairs (${summary.duplicateCount} duplicates, ${summary.majorOverlapCount} major, ${summary.minorOverlapCount} minor). CSV downloaded!`)
    }
  } catch (err) {
    if (err.name === 'AbortError' || err.message?.includes('cancelled')) {
      info('Overlap report generation cancelled.')
    } else {
      console.error('Error generating GPX overlap report:', err)
      useToast().error('Error generating overlap report: ' + (err.message || 'Unknown error'))
    }
  } finally {
    isGeneratingOverlapReport.value = false
    overlapProgress.value = 0
    overlapAbortController = null
    clearStatus()
  }
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

async function applyGisDeltaChanges(deltaData) {
  let farmerChangesCount = 0
  let trackChangesCount = 0

  // 1. Handle Deleted Farmers
  const deletedFarmers = (deltaData.deleted && Array.isArray(deltaData.deleted.farmers)) ? deltaData.deleted.farmers : []
  for (let i = 0; i < deletedFarmers.length; i++) {
    const df = deletedFarmers[i]
    const id = df.id
    const nameUpper = (df.name || '').trim().toUpperCase()
    const idx = farmers.value.findIndex(f => (id && f.id === id) || (nameUpper && f.name && f.name.trim().toUpperCase() === nameUpper))
    if (idx >= 0) {
      const targetFarmer = farmers.value[idx]
      removeFarmerMarker(targetFarmer)
      farmers.value.splice(idx, 1)
      farmerChangesCount++
    }
    if (i > 0 && i % 100 === 0) {
      await yieldToMain()
    }
  }

  // 2. Handle Deleted GPX Tracks
  const deletedTracks = (deltaData.deleted && Array.isArray(deltaData.deleted.gpx_tracks)) ? deltaData.deleted.gpx_tracks : []
  for (let i = 0; i < deletedTracks.length; i++) {
    const dt = deletedTracks[i]
    const id = dt.id
    const nameLower = (dt.name || '').trim().toLowerCase()
    const idx = uploadedFiles.value.findIndex(t => (id && t.id === id) || (nameLower && t.name && t.name.trim().toLowerCase() === nameLower))
    if (idx >= 0) {
      const targetTrack = uploadedFiles.value[idx]
      if (targetTrack.layer && gpxTracksLayerGroup) {
        try { gpxTracksLayerGroup.removeLayer(targetTrack.layer) } catch (_) {}
      }
      if (gpxMarkersLayerGroup) {
        if (targetTrack.startMarker) try { gpxMarkersLayerGroup.removeLayer(targetTrack.startMarker) } catch (_) {}
        if (targetTrack.endMarker) try { gpxMarkersLayerGroup.removeLayer(targetTrack.endMarker) } catch (_) {}
      }
      uploadedFiles.value.splice(idx, 1)
      trackChangesCount++
    }
    if (i > 0 && i % 50 === 0) {
      await yieldToMain()
    }
  }

  // 3. Upsert Updated / New Farmers
  const incomingFarmers = Array.isArray(deltaData.farmers) ? deltaData.farmers : []
  for (let i = 0; i < incomingFarmers.length; i++) {
    const serverFarmer = incomingFarmers[i]
    const nameUpper = (serverFarmer.name || '').trim().toUpperCase()
    if (deletedFarmerNames.value.has(nameUpper)) continue

    const idx = farmers.value.findIndex(f => (serverFarmer.id && f.id === serverFarmer.id) || (nameUpper && f.name && f.name.trim().toUpperCase() === nameUpper))
    if (idx >= 0) {
      const existing = farmers.value[idx]
      removeFarmerMarker(existing)
      farmers.value[idx] = { ...existing, ...serverFarmer }
    } else {
      farmers.value.push(serverFarmer)
    }
    // Re-add markers for this updated farmer's parcels
    const current = farmers.value.find(f => (serverFarmer.id && f.id === serverFarmer.id) || (nameUpper && f.name && f.name.trim().toUpperCase() === nameUpper))
    if (current && Array.isArray(current.parcels)) {
      current.parcels.forEach((p, pIdx) => {
        if (p.coords) {
          const [lat, lng] = p.coords.split(',').map(Number)
          if (!isNaN(lat) && !isNaN(lng)) {
            addFarmerMarker(current, lat, lng, pIdx)
          }
        }
      })
    }
    farmerChangesCount++
    if (i > 0 && i % 50 === 0) {
      await yieldToMain()
    }
  }

  // 4. Upsert Updated / New GPX Tracks
  const incomingTracks = Array.isArray(deltaData.gpx_tracks) ? deltaData.gpx_tracks : []
  const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B']

  for (let i = 0; i < incomingTracks.length; i++) {
    const track = incomingTracks[i]
    if (!track) continue
    const nameLower = (track.name || '').trim().toLowerCase()
    if (deletedGpxNames.value.has(nameLower)) continue

    const normPoints = (Array.isArray(track.points) && track.points.length > 0 && Array.isArray(track.points[0]))
      ? track.points
      : extractTrackPoints(track)
    if (normPoints.length === 0) continue

    const trackColor = track.color || colors[(uploadedFiles.value.length + i) % colors.length]
    const center = normalizeTrackCenter(track.center, normPoints)
    const isEnclosed = track.isEnclosed !== undefined ? Boolean(track.isEnclosed) : isTrackEnclosed(normPoints, 0.05)
    const areaHa = Number(track.areaHectares || track.area_hectares || 0) || (calculatePolygonArea(normPoints) * 100)
    const areaKm2 = Number(track.areaKm2 || track.area_km2 || 0) || (areaHa / 100)

    let minLat = normPoints[0][0], maxLat = normPoints[0][0]
    let minLng = normPoints[0][1], maxLng = normPoints[0][1]
    for (let pIdx = 1; pIdx < normPoints.length; pIdx++) {
      const p = normPoints[pIdx]
      if (p[0] < minLat) minLat = p[0]
      if (p[0] > maxLat) maxLat = p[0]
      if (p[1] < minLng) minLng = p[1]
      if (p[1] > maxLng) maxLng = p[1]
    }

    const trackObj = {
      ...track,
      name: track.name || `Track ${uploadedFiles.value.length + 1}`,
      points: normPoints,
      center,
      bbox: [minLat, minLng, maxLat, maxLng],
      color: trackColor,
      areaHectares: areaHa,
      areaKm2,
      isEnclosed,
      pointCount: normPoints.length,
      visible: track.visible !== false,
      layer: null,
      startMarker: null,
      endMarker: null
    }

    const idx = uploadedFiles.value.findIndex(t => (track.id && t.id === track.id) || (nameLower && t.name && t.name.trim().toLowerCase() === nameLower))
    if (idx >= 0) {
      const oldTrack = uploadedFiles.value[idx]
      if (oldTrack.layer && gpxTracksLayerGroup) {
        try { gpxTracksLayerGroup.removeLayer(oldTrack.layer) } catch (_) {}
      }
      if (gpxMarkersLayerGroup) {
        if (oldTrack.startMarker) try { gpxMarkersLayerGroup.removeLayer(oldTrack.startMarker) } catch (_) {}
        if (oldTrack.endMarker) try { gpxMarkersLayerGroup.removeLayer(oldTrack.endMarker) } catch (_) {}
      }
      uploadedFiles.value[idx] = trackObj
    } else {
      uploadedFiles.value.push(trackObj)
    }
    trackChangesCount++

    if (i > 0 && i % 30 === 0) {
      await yieldToMain()
    }
  }

  // 5. Persist merged datasets and update viewport layers
  if (farmerChangesCount > 0) {
    farmersListRevision.value++
    await persistFarmers()
  }
  if (trackChangesCount > 0) {
    gpxListRevision.value++
    updateVisibleGpxLayers()
    await persistGpxTracks()
    await reconcileOrphanGpxTracks()
  }

  // 6. Update last synced timestamp
  if (deltaData.server_time) {
    lastSyncedTimestamp.value = deltaData.server_time
    await saveGisStorageData(STORAGE_KEY_LAST_SYNCED, deltaData.server_time)
  }

  refreshAllMapPopups()
  return { farmerChangesCount, trackChangesCount }
}

async function fetchGisDataFromServer(showNotification = false, isBackground = false, forceFull = false) {
  if (syncStatus.value === 'syncing' && !isInitialLoading.value) return

  const hasLocalData = farmers.value.length > 0 || uploadedFiles.value.length > 0
  if (!isBackground) {
    syncStatus.value = 'syncing'
    syncStatusText.value = forceFull ? 'Downloading full GIS dataset...' : 'Syncing changes with server...'
    if (!hasLocalData) {
      isInitialLoading.value = true
      loadingMessage.value = 'Connecting to server & downloading GIS data...'
    }
  }

  try {
    if (!lastSyncedTimestamp.value && !forceFull) {
      lastSyncedTimestamp.value = await loadGisStorageData(STORAGE_KEY_LAST_SYNCED)
    }

    const sinceParam = forceFull || !hasLocalData ? null : lastSyncedTimestamp.value
    const data = await apiFetchGisChanges(sinceParam)

    if (data.code === 200) {
      if (!data.is_delta || forceFull || !hasLocalData) {
        // Full initial or forced baseline download
        const rawServerFarmers = Array.isArray(data.farmers) ? data.farmers : []
        const rawServerTracks = Array.isArray(data.gpx_tracks) ? data.gpx_tracks : []

        const serverFarmers = rawServerFarmers.filter(f => !deletedFarmerNames.value.has((f.name || '').trim().toUpperCase()))
        const serverTracks = rawServerTracks.filter(t => !deletedGpxNames.value.has((t.name || '').trim().toLowerCase()))

        if (!hasLocalData && isInitialLoading.value) {
          loadingMessage.value = `Loading ${serverFarmers.length} farmers & ${serverTracks.length} tracks...`
        }

        console.log(`[GIS] Full sync received: ${serverFarmers.length} farmers, ${serverTracks.length} tracks`)

        // Process farmers independently so a failure doesn't block tracks
        try {
          await renderFarmersData(serverFarmers)
          await saveGisStorageData(STORAGE_KEY_FARMERS, serverFarmers)
          console.log(`[GIS] Farmers rendered & saved: ${farmers.value.length}`)
        } catch (farmerErr) {
          console.error('[GIS] Error rendering/saving farmers:', farmerErr)
        }

        // Process tracks independently so a failure doesn't block farmers
        try {
          await renderGpxTracksData(serverTracks)
          await saveGisStorageData(STORAGE_KEY_GPX_TRACKS, serverTracks)
          console.log(`[GIS] Tracks rendered & saved: ${uploadedFiles.value.length}`)
        } catch (trackErr) {
          console.error('[GIS] Error rendering/saving GPX tracks:', trackErr)
        }

        if (data.server_time) {
          lastSyncedTimestamp.value = data.server_time
          await saveGisStorageData(STORAGE_KEY_LAST_SYNCED, data.server_time)
        }

        refreshAllMapPopups()
        if (showNotification) {
          success(`Full GIS sync complete (${farmers.value.length} farmers, ${uploadedFiles.value.length} tracks)`)
        }
      } else {
        // Incremental Delta Sync (Fast path)
        const totalChanges = (data.count && data.count.total_changes !== undefined) ? data.count.total_changes : 0
        const { farmerChangesCount, trackChangesCount } = await applyGisDeltaChanges(data)

        if (showNotification) {
          if (totalChanges === 0) {
            info(`Already in sync with server (0 changes, ${farmers.value.length} farmers, ${uploadedFiles.value.length} tracks)`)
          } else {
            success(`Delta sync complete: updated ${farmerChangesCount} farmer(s), ${trackChangesCount} track(s)`)
          }
        }
      }

      if (!isBackground) {
        syncStatus.value = 'synced'
        syncStatusText.value = `In sync (${farmers.value.length} farmers, ${uploadedFiles.value.length} tracks)`
      }
      lastSyncTime.value = new Date().toLocaleTimeString()
    }
  } catch (err) {
    if (!isBackground) {
      console.warn('Server GIS sync warning (using offline/local mode):', err)
      syncStatus.value = 'offline'
      syncStatusText.value = 'Local only (Offline)'
      if (showNotification) {
        info('Working in offline mode with local storage data')
      }
    }
  } finally {
    if (!hasLocalData && isInitialLoading.value) {
      isInitialLoading.value = false
    }
  }
}

async function uploadAllLocalToServer(showNotification = true) {
  if (syncStatus.value === 'syncing') return
  syncStatus.value = 'syncing'
  syncStatusText.value = 'Uploading to server...'
  try {
    const farmersToUpload = farmers.value.map(f => ({
      name: f.name,
      address: f.address || null,
      location: resolveFarmerBarangay(f),
      commodity: f.commodity || 'Rice',
      area: f.area,
      parcels: f.parcels || [],
      gpxFileName: f.gpxFileName || null,
      gpxFileNames: f.gpxFileNames || []
    }))

    const tracksToUpload = uploadedFiles.value.map(f => ({
      name: f.name,
      farmerName: f.farmerName || null,
      address: f.address || null,
      location: resolveGpxBarangay(f.name, f.center),
      commodity: f.commodity || null,
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

    if (farmersToUpload.length > 0) {
      await apiCreateFarmer(farmersToUpload)
    }
    if (tracksToUpload.length > 0) {
      await apiCreateGpxTracks(tracksToUpload)
    }

    syncStatus.value = 'synced'
    syncStatusText.value = `In sync (${farmers.value.length} farmers, ${uploadedFiles.value.length} tracks)`
    lastSyncTime.value = new Date().toLocaleTimeString()
    if (showNotification) {
      success(`Saved ${farmers.value.length} farmers and ${uploadedFiles.value.length} tracks to SQLite server!`)
    }
  } catch (err) {
    console.error('Failed to upload local GIS data:', err)
    syncStatus.value = 'offline'
    syncStatusText.value = 'Local only (Server unreachable)'
    if (showNotification) {
      warning('Could not connect to server. Data remains safe locally in IndexedDB.')
    }
  }
}

onMounted(async () => {
  window.editFarmerByPopup = (farmerName) => {
    openEditFarmerByName(farmerName)
  }
  window.jumpToParcelByPopup = (farmerName, parcelIdx) => {
    jumpToParcel(farmerName, parcelIdx)
  }
  window.clearJumpPinByPopup = () => {
    clearJumpPin()
  }
  isInitialLoading.value = true
  loadingMessage.value = 'Initializing map & workspace...'
  syncStatus.value = 'syncing'
  syncStatusText.value = 'Loading GIS Data...'

  try {
    initMap()
    await loadDeletedKeys()

    // Preload commodity spatial index so parcel coordinates match Rice/Corn immediately
    ensureCommoditySpatialIndex().catch(err => console.warn('Commodity index init error:', err))

    loadingMessage.value = 'Loading farmer records...'
    await loadSampleData()

    loadingMessage.value = 'Loading GPX tracks...'
    await loadSavedGpxTracks()

    // Reconcile any tracks loaded without corresponding farmer records
    await reconcileOrphanGpxTracks()
  } catch (err) {
    console.error('Error during GIS onMounted initialization:', err)
  } finally {
    loadingMessage.value = 'Ready!'
    isInitialLoading.value = false
    if (syncStatus.value === 'syncing') {
      syncStatus.value = 'idle'
      syncStatusText.value = 'Cloud Sync Ready'
    }
  }

  // Defer server fetch to background — don't block initial render
  fetchGisDataFromServer(false).catch(err => console.warn('Background server sync:', err))
})

onBeforeUnmount(() => {
  delete window.editFarmerByPopup
  delete window.jumpToParcelByPopup
  delete window.clearJumpPinByPopup
  clearJumpPin()
  if (farmerLayerGroup) {
    farmerLayerGroup.clearLayers()
    farmerLayerGroup = null
  }
  if (gpxTracksLayerGroup) {
    gpxTracksLayerGroup.clearLayers()
    gpxTracksLayerGroup = null
  }
  if (gpxMarkersLayerGroup) {
    gpxMarkersLayerGroup.clearLayers()
    gpxMarkersLayerGroup = null
  }
  if (boundaryLayer && map) {
    map.removeLayer(boundaryLayer)
    boundaryLayer = null
  }
  if (commodityLayer && map) {
    map.removeLayer(commodityLayer)
    commodityLayer = null
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
  right: 0px;
  z-index: 9999;
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
  gap: 0.35rem;
  align-items: center;
}

.search-input-group .field-control-sm {
  flex: 1;
}

.search-input-group .btn {
  height: 28px !important;
  min-height: 28px !important;
  max-height: 28px !important;
  padding: 0 0.65rem;
  font-size: 0.76rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  box-sizing: border-box;
  white-space: nowrap;
}

/* Jump to Coordinate Box */
.jump-coord-box {
  margin-top: 0.55rem;
  padding: 0.55rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.jump-coord-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.jump-coord-title {
  font-size: 0.72rem;
  font-weight: 750;
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  text-transform: uppercase;
}

.btn-clear-pin {
  background: transparent;
  border: none;
  font-size: 0.68rem;
  font-weight: 700;
  color: #e53935;
  cursor: pointer;
  padding: 0;
  transition: opacity 150ms ease;
}

.btn-clear-pin:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.jump-coord-fields {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

.jump-coord-fields .field-control-sm {
  flex: 1;
}

.btn-jump-go {
  height: 28px !important;
  min-height: 28px !important;
  max-height: 28px !important;
  padding: 0 0.75rem;
  font-size: 0.76rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  box-sizing: border-box;
  white-space: nowrap;
}

.search-results-list {
  height: 260px;
  max-height: 260px;
  overflow-y: auto;
  margin-top: 0.65rem;
}

.search-results-list .vue-recycle-scroller__item-view {
  padding-bottom: 6px;
  box-sizing: border-box;
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
  align-items: center;
  gap: 0.35rem;
}

.gpx-file-cards-list {
  height: 260px;
  max-height: 260px;
  overflow-y: auto;
  padding: 4px 6px 8px;
  box-sizing: border-box;
}

.gpx-file-cards-list .vue-recycle-scroller__item-view {
  padding-bottom: 10px;
  box-sizing: border-box;
}

.gpx-file-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.65rem;
  box-sizing: border-box;
  min-height: 100px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  margin-bottom: 0.15rem;
}

.field-label-xs {
  display: block;
  font-size: 0.66rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.1rem;
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

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  height: 28px;
}

.search-input-wrapper .field-control-sm {
  padding-right: 1.5rem;
}

.btn-clear-inline {
  position: absolute;
  right: 6px;
  background: none;
  border: none;
  font-size: 0.72rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px 4px;
  line-height: 1;
}

.btn-clear-inline:hover {
  color: var(--danger-600, #dc2626);
}

.filter-grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
  margin-bottom: 0.55rem;
}

.filter-col {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.filter-col .field-label-sm {
  margin-bottom: 0;
}

.farmers-list-container {
  height: 330px;
  max-height: 330px;
  overflow-y: auto;
  padding: 4px 6px 8px;
  box-sizing: border-box;
}

.farmers-list-container .vue-recycle-scroller__item-view {
  padding-bottom: 10px;
  box-sizing: border-box;
}

.farmer-card-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.65rem;
  box-sizing: border-box;
  min-height: 116px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.muted-indicator {
  color: var(--text-muted, #6b7280);
  font-weight: 600;
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

.commodity-indicator {
  color: #d97706;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.commodity-tool-icon {
  font-size: 16px;
  line-height: 1;
}

/* Floating Commodity Legend */
.map-floating-legend {
  position: absolute;
  top: 92px;
  left: 14px;
  z-index: 400;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 8px);
  padding: 8px 12px;
  box-shadow: var(--shadow-md);
  min-width: 140px;
  pointer-events: auto;
}

.legend-header-icon {
  width: 14px;
  height: 14px;
  vertical-align: -2px;
  color: #d97706;
}

.legend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border);
  gap: 8px;
}

.legend-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--heading, #0f172a);
}

.legend-count {
  font-size: 0.68rem;
  font-family: var(--font-mono, monospace);
  color: var(--text-muted);
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  color: var(--text);
}

.legend-color-box {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.legend-color-corn {
  background: #f59e0b;
  border-color: #d97706;
}

.legend-color-rice {
  background: #10b981;
  border-color: #059669;
}

.legend-label {
  font-weight: 600;
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

:deep(.btn-popup-edit) {
  background: var(--brand-600, #2e7d32) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 4px !important;
  padding: 3px 8px !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 3px !important;
  line-height: 1.2 !important;
  transition: background 150ms ease !important;
}

:deep(.btn-popup-edit:hover) {
  background: var(--brand-700, #1b5e20) !important;
}

:deep(.popup-parcel-row:hover) {
  background: #f0fdf4 !important;
  color: #1b5e20 !important;
}

/* Initial Map Loading Overlay */
.map-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}

.loading-card {
  background: var(--bg-elevated, #ffffff);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: var(--radius-lg, 12px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
  padding: 1.75rem 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 280px;
  max-width: 380px;
}

.loading-spinner-ring {
  width: 42px;
  height: 42px;
  border: 3.5px solid rgba(46, 125, 50, 0.18);
  border-top-color: var(--brand-600, #2e7d32);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

.loading-title {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--heading, #0f172a);
  margin-bottom: 0.35rem;
}

.loading-detail {
  font-size: 0.82rem;
  color: var(--text-muted, #64748b);
  font-family: var(--font-mono, monospace);
  min-height: 1.2rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-loading-enter-active,
.fade-loading-leave-active {
  transition: opacity 0.25s ease;
}

.fade-loading-enter-from,
.fade-loading-leave-to {
  opacity: 0;
}

/* Overlap Export Box & Threshold */
.overlap-export-box {
  background: var(--bg-subtle, #f8fafc);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: var(--radius-sm, 6px);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.overlap-threshold-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.overlap-threshold-row .field-label-xs {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted, #64748b);
  white-space: nowrap;
}

.field-control-xs {
  font-size: 0.74rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  border: 1px solid var(--border, #cbd5e1);
  background: var(--bg-elevated, #ffffff);
  color: var(--heading, #0f172a);
  outline: none;
  width: 100%;
  max-width: 180px;
}

.field-control-xs:focus {
  border-color: var(--brand-600, #2e7d32);
}

/* Overlap Report Loading Modal Styles */
.report-loading-overlay {
  z-index: 2000;
}

.report-loading-card {
  min-width: 360px;
  max-width: 440px;
  padding: 2rem 2.25rem;
}

.report-loading-card .loading-subtitle {
  font-size: 0.84rem;
  color: var(--text-muted, #64748b);
  margin-bottom: 1.25rem;
  min-height: 1.2rem;
}

.report-progress-bar-wrap {
  width: 100%;
  height: 8px;
  background: var(--bg-subtle, #f1f5f9);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.report-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 999px;
  transition: width 0.15s ease-out;
}

.report-progress-pct {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--heading, #0f172a);
  font-family: var(--font-mono, monospace);
  margin-bottom: 1.25rem;
}

.report-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  width: 100%;
  background: var(--bg-subtle, #f8fafc);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  padding: 0.75rem 0.5rem;
  margin-bottom: 1.25rem;
}

.report-metrics-grid .metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.report-metrics-grid .metric-val {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--brand-700, #15803d);
  font-family: var(--font-mono, monospace);
}

.report-metrics-grid .metric-lbl {
  font-size: 0.68rem;
  color: var(--text-muted, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-top: 0.15rem;
}

.report-modal-actions {
  display: flex;
  justify-content: center;
  width: 100%;
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
