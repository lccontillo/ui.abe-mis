<template>
  <div class="container app-page">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'GIS Tools' }]" />
    <TitleBar title="GIS Tools" :icon="Earth20" />

    <!-- Filters -->
    <div class="filters">
      <button class="btn btn-primary" type="button" @click="openModal('gpxToShp')">
        + GPX to SHP
      </button>
      <button class="btn btn-primary" type="button" @click="openModal('shpToGpx')">
        + SHP to GPX
      </button>
    </div>

    <!-- Table -->
    <DataTable :data="conversions" :columns="columns" :sort="sort" :onSort="toggleSort" :loading="isLoading">
    </DataTable>

    <!-- Pagination -->
    <PaginationBar 
      :currentPage="pagination.page" 
      :totalPages="totalPages" 
      :perPage="pagination.limit"
      @page-change="p => { pagination.page = p; fetchConversions() }" 
      @per-page-change="l => { pagination.limit = l; pagination.page = 1; fetchConversions() }"
    />
  </div>

  <Modal v-if="modals.gpxToShp" title="GPX to SHP Conversion" size="sm" @close="closeAllModals">
    <form @submit.prevent="convertGPX">
      <div class="form-group">
        <label>Upload ZIP containing GPX files</label>
        <input type="file" accept=".zip" ref="gpxFileInput" class="field-control" required />
      </div>
      <div class="modal-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isConvertingGpx"
        >
          {{ isConvertingGpx ? 'Converting...' : 'Convert' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="closeAllModals">Cancel</button>
      </div>
    </form>
  </Modal>

  <Modal v-if="modals.shpToGpx" title="SHP to GPX Conversion" size="sm" @close="closeAllModals">
    <form @submit.prevent="convertSHP">
      <div class="form-group">
        <label>Upload ZIP containing Shapefiles (cpg,dbf,prj,shp,shx)</label>
        <input type="file" accept=".zip" ref="shpFileInput" class="field-control" required />
      </div>

      <div class="modal-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isConvertingShp"
        >
          {{ isConvertingShp ? 'Converting...' : 'Convert' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="closeAllModals">Cancel</button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
const { error, warning } = useToast()
import { useRouter } from 'vue-router'
import TitleBar from '@/components/TitleBar.vue'
import DataTable from '@/components/DataTable.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import Modal from '@/components/Modal.vue'
import { Earth20, View20, DocumentExport20, TrashCan20, Launch20 } from '@carbon/icons-vue'
import { useHashModal } from '@/composables/useHashModal'

const modals = ref({ gpxToShp: false, shpToGpx: false })
const passwordForm = ref({ new: '', confirm: '' })
const { openHashModal, closeHashModal } = useHashModal({
  'gpx-to-shp': (isOpen) => {
    modals.value.gpxToShp = isOpen
  },
  'shp-to-gpx': (isOpen) => {
    modals.value.shpToGpx = isOpen
  },
})

const router = useRouter()
const token = localStorage.getItem('token')

const conversions = ref([])
const total = ref(0)
const isLoading = ref(false)

const filters = ref({
  tool: '',
  keyword: '', // if you implement general keyword filtering later
})

const sort = ref({
  column: 'conversion_date',
  order: 'desc',
})

const pagination = ref({
  page: 1,
  limit: 10,
})

const columns = [
  { label: 'Filename', key: 'input_filename', sortable: false },
  { label: 'Tool', key: 'tool', sortable: false },
  { label: 'Converted By', key: 'username', sortable: false },
  { label: 'Date', key: 'conversion_date', sortable: true },
]

const totalPages = computed(() => Math.ceil(total.value / pagination.value.limit))

function toggleSort(column) {
  if (sort.value.column === column) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.column = column
    sort.value.order = 'asc'
  }
  fetchConversions()
}

async function fetchConversions() {
  isLoading.value = true
  const params = new URLSearchParams()
  if (filters.value.tool) params.append('tool', filters.value.tool)
  params.append('sort', sort.value.column)
  params.append('order', sort.value.order)
  params.append('page', pagination.value.page)
  params.append('limit', pagination.value.limit)

  try {
    const res = await fetch(`https://api-abealcala.duckdns.org/conversions?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`, // make sure `token` is defined in your setup
      },
    })

    const json = await res.json()
    conversions.value = json.data
    total.value = json.total
  } catch (err) {
    error('Error: ' + err.message)
  } finally {
    isLoading.value = false
  }
}

function openModal(type) {
  modals.value[type] = true
  openHashModal(type === 'gpxToShp' ? 'gpx-to-shp' : 'shp-to-gpx')
}

function closeAllModals() {
  closeHashModal('gpx-to-shp')
  closeHashModal('shp-to-gpx')
  modals.value = { gpxToShp: false, shpToGpx: false }
  passwordForm.value = { new: '', confirm: '' }
}

const gpxFileInput = ref(null)
const isConvertingGpx = ref(false)

async function convertGPX() {
  const file = gpxFileInput.value?.files?.[0]

  if (!file || !file.name.endsWith('.zip')) {
    warning('Please select a .zip file.')
    return
  }

  isConvertingGpx.value = true

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('https://api-abealcala.duckdns.org/gpx_to_shp', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Upload failed')
    }

    const blob = await response.blob()
    const contentDisposition = response.headers.get('Content-Disposition')
    const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
    const filename = filenameMatch ? filenameMatch[1] : 'converted.zip'

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    closeAllModals()
    gpxFileInput.value = null // reset file input
  } catch (err) {
    error('Error: ' + err.message)
  } finally {
    isConvertingGpx.value = false
    fetchConversions()
  }
}

const shpFileInput = ref(null)
const isConvertingShp = ref(false)

async function convertSHP() {
  const file = shpFileInput.value?.files?.[0]

  if (!file) {
    warning('Please select a .shp or .zip file.')
    return
  }

  isConvertingShp.value = true

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('https://api-abealcala.duckdns.org/shp_to_gpx', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Failed to convert.')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const filename = file.name.replace(/\.(zip|shp)$/i, '_gpx.zip')

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)

    closeAllModals()
    shpFileInput.value.value = null
  } catch (err) {
    error('Error: ' + err.message)
  } finally {
    isConvertingShp.value = false
    fetchConversions()
  }
}

onMounted(fetchConversions)
</script>

<style scoped>
.container {
  padding: 1rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.filters input,
.filters select {
  padding: 6px 10px;
  font-size: 0.9rem;
}
.filters button {
  padding: 6px 12px;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}
.filters button:hover {
  background-color: #256128;
}

.action-icon.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.25rem;
  gap: 1rem;
}
.pagination button {
  padding: 5px 10px;
  font-size: 0.85rem;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
}
.pagination button:disabled {
  background: #ccc;
}
.limit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}
.action-icon {
  cursor: pointer;
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
.action-icon:hover {
  opacity: 0.8;
}
.text-red {
  color: #d32f2f;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  width: 90%;
  max-width: 480px;
  border-radius: 10px;
  box-shadow: 0 2px 16px #0003;
}
h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
input {
  width: 100%;
  padding: 0.6rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.btn-primary {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:hover {
  background: #256128;
}
.btn-secondary {
  background: #eee;
  color: #333;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-secondary:hover {
  background: #ddd;
}
.error {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
}
</style>
