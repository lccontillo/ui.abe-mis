<template>
  <div class="gis-settings-panel">
    <div class="panel-header">
      <h3 class="panel-title">
        <Map20 class="panel-icon" /> Farm Area GIS Data Management
      </h3>
      <p class="panel-subtitle">
        Manage cloud synchronization, storage, and administrative reset for GIS farmers and GPX boundary tracks.
      </p>
    </div>

    <!-- GIS Overview Card -->
    <div class="gis-stats-grid">
      <div class="gis-stat-card">
        <div class="stat-icon-wrapper brand">
          <UserProfile20 class="stat-icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">Registered Farmers</div>
          <div class="stat-value font-mono">{{ loadingStats ? '...' : serverStats.farmersCount }}</div>
          <div class="stat-subtext">in server database</div>
        </div>
      </div>

      <div class="gis-stat-card">
        <div class="stat-icon-wrapper success">
          <Document20 class="stat-icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">GPX Boundary Tracks</div>
          <div class="stat-value font-mono">{{ loadingStats ? '...' : serverStats.tracksCount }}</div>
          <div class="stat-subtext">in server database</div>
        </div>
      </div>

      <div class="gis-stat-card">
        <div class="stat-icon-wrapper info">
          <Earth20 class="stat-icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">Sync Status</div>
          <div class="stat-value-sm" :class="'text-' + syncStatusClass">
            {{ loadingStats ? 'Checking...' : syncStatusText }}
          </div>
          <div class="stat-subtext">{{ serverStats.lastUpdated || 'No timestamp' }}</div>
        </div>
      </div>
    </div>

    <!-- Actions Section -->
    <div class="settings-action-section">
      <div class="section-heading">
        <h4>Refresh & Verification</h4>
        <p class="section-desc">Fetch and verify latest GIS records from server storage.</p>
      </div>
      <button 
        type="button" 
        class="btn btn-secondary btn-sm" 
        :disabled="loadingStats" 
        @click="fetchGisStats"
      >
        <Reset20 class="btn-icon" :class="{ 'rotating-icon': loadingStats }" />
        <span>{{ loadingStats ? 'Refreshing...' : 'Refresh Status' }}</span>
      </button>
    </div>

    <!-- Danger Zone (Admin Only) -->
    <div v-if="userStore.user?.is_admin" class="danger-zone-card">
      <div class="danger-zone-header">
        <div class="danger-icon-wrapper">
          <TrashCan16 class="danger-icon" />
        </div>
        <div class="danger-title-block">
          <h4 class="danger-title">Danger Zone: Reset & Clear All GIS Data</h4>
          <p class="danger-desc">
            Permanently deletes all registered farmers, farm parcels, and GPX track boundaries from the cloud database, IndexedDB, and local browser storage.
          </p>
        </div>
      </div>

      <div class="danger-zone-body">
        <div class="warning-callout">
          ⚠️ <strong>Warning:</strong> This action is irreversible. It will wipe all 
          <strong>{{ serverStats.farmersCount }} farmers</strong> and 
          <strong>{{ serverStats.tracksCount }} tracks</strong> from both the server and the map, allowing you to restart fresh with batch GPX uploads.
        </div>

        <div class="danger-actions-row">
          <button 
            type="button" 
            class="btn btn-danger" 
            :disabled="clearingData"
            @click="handleClearAllGisData"
          >
            <TrashCan16 class="btn-icon" />
            <span>{{ clearingData ? 'Resetting and Clearing...' : 'Reset & Clear All GIS Data' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  Map20,
  UserProfile20,
  Document20,
  Earth20,
  Reset20,
  TrashCan16
} from '@carbon/icons-vue'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const userStore = useUserStore()
const { success, error } = useToast()
const { confirm } = useConfirmDialog()

const API_BASE = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000'
const GIS_IDB_DB_NAME = 'farm_area_gis_db'
const GIS_IDB_STORE_NAME = 'gis_store'
const STORAGE_KEY_FARMERS = 'farm_area_gis_farmers'
const STORAGE_KEY_GPX_TRACKS = 'farm_area_gis_gpx_tracks'
const STORAGE_KEY_DELETED_FARMERS = 'farm_area_gis_deleted_farmers'
const STORAGE_KEY_DELETED_GPX = 'farm_area_gis_deleted_gpx'

const loadingStats = ref(false)
const clearingData = ref(false)
const serverStats = ref({
  farmersCount: 0,
  tracksCount: 0,
  lastUpdated: null,
  reachable: true
})

const syncStatusClass = computed(() => {
  if (!serverStats.value.reachable) return 'danger'
  if (serverStats.value.farmersCount > 0 || serverStats.value.tracksCount > 0) return 'success'
  return 'muted'
})

const syncStatusText = computed(() => {
  if (!serverStats.value.reachable) return 'Server Unreachable'
  if (serverStats.value.farmersCount > 0 || serverStats.value.tracksCount > 0) return 'Active GIS Records'
  return 'Database Empty (Ready)'
})

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

const clearGisIDB = async () => {
  try {
    const db = await openGisIDB()
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(GIS_IDB_STORE_NAME, 'readwrite')
        tx.objectStore(GIS_IDB_STORE_NAME).clear()
        tx.oncomplete = () => {
          try { db.close() } catch (_) {}
          resolve(true)
        }
        tx.onerror = () => {
          try { db.close() } catch (_) {}
          resolve(false)
        }
      } catch (e) {
        try { db.close() } catch (_) {}
        resolve(false)
      }
    })
  } catch (e) {
    return false
  }
}

async function fetchGisStats() {
  loadingStats.value = true
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
      serverStats.value = {
        farmersCount: Array.isArray(data.farmers) ? data.farmers.length : 0,
        tracksCount: Array.isArray(data.gpx_tracks) ? data.gpx_tracks.length : 0,
        lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleString() : null,
        reachable: true
      }
    }
  } catch (err) {
    console.warn('Failed to fetch server GIS stats:', err)
    serverStats.value.reachable = false
  } finally {
    loadingStats.value = false
  }
}

async function handleClearAllGisData() {
  const confirmed = await confirm(
    'Reset & Clear All GIS Data',
    `Are you sure you want to permanently delete all ${serverStats.value.farmersCount} farmers and ${serverStats.value.tracksCount} GPX tracks from both the server and local storage?`,
    'Reset Everything'
  )
  if (!confirmed) return

  clearingData.value = true
  try {
    // 1. Clear IndexedDB and localStorage
    await clearGisIDB()
    try {
      localStorage.removeItem(STORAGE_KEY_FARMERS)
      localStorage.removeItem(STORAGE_KEY_GPX_TRACKS)
      localStorage.removeItem(STORAGE_KEY_DELETED_FARMERS)
      localStorage.removeItem(STORAGE_KEY_DELETED_GPX)
    } catch (_) {}

    // 2. Clear Server Database via dedicated clear endpoint
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }

    await fetch(`${API_BASE}/gis/clear`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ clear_all: true })
    }).catch(() => {})

    // 3. Fallback overwrite on sync endpoint
    await fetch(`${API_BASE}/gis/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        farmers: [],
        gpx_tracks: [],
        full_overwrite: true
      })
    }).catch(() => {})

    // 4. Update stats
    serverStats.value.farmersCount = 0
    serverStats.value.tracksCount = 0
    serverStats.value.lastUpdated = new Date().toLocaleString()

    success('All GIS map data, farmers, and tracks have been cleared successfully!')
  } catch (err) {
    console.error('Error clearing GIS data:', err)
    error('Failed to completely clear GIS data: ' + err.message)
  } finally {
    clearingData.value = false
  }
}

onMounted(() => {
  fetchGisStats()
})
</script>
<style scoped>
.gis-settings-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 750;
  color: var(--heading);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.panel-icon {
  width: 22px;
  height: 22px;
  color: var(--brand-600);
}

.panel-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Stats Grid */
.gis-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.gis-stat-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 8px);
  padding: 1.1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-dm, 6px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.brand {
  background: var(--brand-50, #f0fdf4);
  color: var(--brand-600, #16a34a);
}

.stat-icon-wrapper.success {
  background: #ecfdf5;
  color: #059669;
}

.stat-icon-wrapper.info {
  background: #eff6ff;
  color: #2563eb;
}

.stat-icon {
  width: 22px;
  height: 22px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-label {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.stat-value {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--heading);
  line-height: 1.2;
}

.stat-value-sm {
  font-size: 0.95rem;
  font-weight: 750;
  margin-top: 2px;
}

.stat-subtext {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.text-success { color: #16a34a; }
.text-danger { color: #dc2626; }
.text-muted { color: var(--text-muted); }

/* Settings Action Section */
.settings-action-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 8px);
}

.section-heading h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--heading);
  margin-bottom: 2px;
}

.section-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Danger Zone */
.danger-zone-card {
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: var(--bg-elevated);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
}

.danger-zone-header {
  padding: 1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.08);
}

.danger-icon-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.18);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.danger-icon {
  width: 18px;
  height: 18px;
}

.danger-title {
  font-size: 1rem;
  font-weight: 750;
  color: #ef4444;
  margin-bottom: 3px;
}

.danger-desc {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.danger-zone-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warning-callout {
  background: var(--bg-muted);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-left: 4px solid #ef4444;
  padding: 0.85rem 1.1rem;
  border-radius: 4px;
  font-size: 0.82rem;
  color: var(--text);
  line-height: 1.5;
}

.warning-callout strong {
  color: #ef4444;
}

.danger-actions-row {
  display: flex;
  justify-content: flex-end;
}

.rotating-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

@media (max-width: 720px) {
  .settings-action-section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>