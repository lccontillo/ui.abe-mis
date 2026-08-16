<template>
  <div class="fca-data-view app-page">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'FCAs', to: '/fcas' }, { label: fca.general.name || 'FCA Details' }]" />
    <TitleBar :title="fca.general.name || 'FCA Details'" :icon="Document20" />

    <!-- Tabs -->
    <div class="tabs settings-tabs">
      <button
        :class="['tab-btn', activeTab === 'profile' ? 'active' : '']"
        @click="activeTab = 'profile'"
      >
        Profile
      </button>
      <button
        :class="['tab-btn', activeTab === 'documents' ? 'active' : '']"
        @click="activeTab = 'documents'"
      >
        Documents
      </button>
    </div>

    <!-- Profile Tab -->
    <div v-if="activeTab === 'profile'" class="profile-tab panel">
      <div class="flex justify-between items-center mb-4">
        <button class="edit-btn btn btn-primary" type="button" @click="openEditModal">
          Edit FCA
        </button>
      </div>
      <div v-if="loading" class="p-4 text-center">Loading...</div>
      <div v-else>
        <!-- General Info -->
        <section style="margin-top: 20px">
          <h3>General Information</h3>
          <div class="row">
            <div class="field"><strong>Name:</strong> {{ fca.general.name }}</div>
            <div class="field"><strong>Acronym:</strong> {{ fca.general.acronym }}</div>
            <div class="field"><strong>Type:</strong> {{ fca.general.type }}</div>
            <div class="field"><strong>Reg No:</strong> {{ fca.general.reg_no }}</div>
            <div class="field">
              <strong>Year Registered:</strong> {{ fca.general.year_registered }}
            </div>
          </div>
          <div class="row">
            <div class="field"><strong>Barangay:</strong> {{ fca.general.brgy }}</div>
            <div class="field"><strong>Street:</strong> {{ fca.general.street }}</div>
            <div class="field"><strong>Municipality:</strong> {{ fca.general.municipality }}</div>
            <div class="field"><strong>Province:</strong> {{ fca.general.province }}</div>
            <div class="field"><strong>Zip Code:</strong> {{ fca.general.zip_code }}</div>
          </div>
          <div class="row">
            <div class="field">
              <strong>Major Commodity:</strong> {{ fca.general.major_commodity }}
            </div>
            <div class="field"><strong>Total Members:</strong> {{ fca.general.total_members }}</div>
            <div class="field">
              <strong>Business Operation:</strong> {{ fca.general.business_operation }}
            </div>
          </div>
        </section>

        <!-- Contact Info -->
        <section>
          <h3>Organization Contact</h3>
          <div class="row">
            <div class="field"><strong>Landline:</strong> {{ fca.organization.landline }}</div>
            <div class="field"><strong>Email:</strong> {{ fca.organization.email }}</div>
            <div class="field"><strong>Website:</strong> {{ fca.organization.website }}</div>
            <div class="field">
              <strong>Google Drive Repository:</strong> {{ fca.organization.repository }}
            </div>
          </div>
        </section>

        <!-- Officers -->
        <section>
          <h3>Officers</h3>
          <div v-if="fca.officers.length === 0" class="text-gray-500">No officers listed.</div>
          <div v-for="officer in fca.officers" :key="officer.id" class="officer-block">
            <div class="row">
              <div class="field"><strong>Name:</strong> {{ officer.name }}</div>
              <div class="field"><strong>Position:</strong> {{ officer.position }}</div>
              <div class="field"><strong>Civil Status:</strong> {{ officer.civil_status }}</div>
            </div>
            <div class="row">
              <div class="field">
                <strong>Birth Date:</strong> {{ formatDate(officer.birth_date) }}
              </div>
              <div class="field"><strong>Mobile No:</strong> {{ officer.mobile_no }}</div>
            </div>
          </div>
        </section>

        <!-- BODs -->
        <section>
          <h3>Board of Directors (BODs)</h3>
          <div v-if="fca.bods.length === 0" class="text-gray-500">No BODs listed.</div>
          <div v-for="bod in fca.bods" :key="bod.id" class="bod-block">
            <div class="row">
              <div class="field"><strong>Name:</strong> {{ bod.name }}</div>
              <!-- <div class="field"><strong>Position:</strong> {{ bod.position }}</div>
              <div class="field"><strong>Civil Status:</strong> {{ bod.civil_status }}</div>
              <div class="field"><strong>Birth Date:</strong> {{ formatDate(bod.birth_date) }}</div>
              <div class="field"><strong>Mobile No:</strong> {{ bod.mobile_no }}</div> -->
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Documents Tab -->
    <div v-if="activeTab === 'documents'" class="documents-tab panel">
      <div class="filters">
        <input v-model="selectedDocument" placeholder="Filter by Document" class="field-control" />
        <input v-model="selectedGroup" placeholder="Filter by Group" class="field-control" />
        <input v-model="selectedUser" placeholder="Filter by User" class="field-control" />
        <button class="btn btn-primary" @click="fetchDocuments">Apply</button>
      </div>

      <DataTable
        :data="documents"
        :columns="columns"
        :sort="{ column: sort, order }"
        :onSort="toggleSort"
        :loading="isLoading"
      >
        <template #actions="{ row }">
          <a :href="row.download_url" target="_blank" title="Download" class="action-icon">
            <Download20 />
          </a>
        </template>
      </DataTable>

      <PaginationBar 
        :currentPage="page" 
        :totalPages="totalPages" 
        :perPage="limit"
        @page-change="p => { page = p; fetchDocuments() }" 
        @per-page-change="l => { limit = l; page = 1; fetchDocuments() }"
      />
    </div>

    <!-- Edit Modal -->
    <Modal v-if="showEdit" title="Edit FCA Profile" size="xl" @close="closeEditModal">
      <FcaForm
        :initialData="fca"
        :editMode="true"
        @close="closeEditModal"
        @updated="handleUpdate"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import TitleBar from '@/components/TitleBar.vue'
import DataTable from '@/components/DataTable.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import Modal from '@/components/Modal.vue'
import FcaForm from './FcaForm.vue'
import { Document20, Download20 } from '@carbon/icons-vue'
import { useHashModal } from '@/composables/useHashModal'

const token = localStorage.getItem('token')
const route = useRoute()
const fcaId = Number(route.params.id) || 2

const activeTab = ref('profile')
const loading = ref(true)
const isLoading = ref(false)
const fca = reactive({ general: {}, organization: {}, officers: [], bods: [] })
const showEdit = ref(false)
const { openHashModal, closeHashModal } = useHashModal({
  'edit-fca': (isOpen) => {
    showEdit.value = isOpen
  },
})

function openEditModal() {
  showEdit.value = true
  openHashModal('edit-fca')
}

function closeEditModal() {
  closeHashModal('edit-fca')
  showEdit.value = false
}

function formatDate(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : ''
}

async function fetchFca() {
  loading.value = true
  const res = await fetch(`https://api-abealcala.duckdns.org/fca/${fcaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  Object.assign(fca, await res.json())
  loading.value = false
}

function handleUpdate() {
  fetchFca()
  closeEditModal()
}

// Documents logic
const documents = ref([])
const selectedDocument = ref('')
const selectedUser = ref('')
const selectedGroup = ref('')
const page = ref(1)
const limit = ref(10)
const sort = ref('updated_at')
const order = ref('desc')
const total = ref(0)

async function fetchDocuments() {
  isLoading.value = true
  const params = new URLSearchParams()
  params.append('fca_id', fcaId)
  if (selectedDocument.value) params.append('document_name', selectedDocument.value)
  if (selectedUser.value) params.append('user_name', selectedUser.value)
  if (selectedGroup.value) params.append('group_name', selectedGroup.value)
  params.append('sort', sort.value)
  params.append('order', order.value)
  params.append('page', page.value)
  params.append('limit', limit.value)
  console.log('Params:', params.toString())
  const res = await fetch(`https://api-abealcala.duckdns.org/generated_documents?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  documents.value = data.data.map((d) => ({
    ...d,
    download_url: d.download_url || `/api/documents/${d.id}/download`,
  }))
  total.value = data.total
  isLoading.value = false
}

const columns = [
  { label: 'Document', key: 'document_name' },
  { label: 'Group', key: 'group_name' },
  { label: 'User', key: 'created_by_username' },
  { label: 'Updated At', key: 'updated_at', sortable: true },
]

const totalPages = computed(() => Math.ceil(total.value / limit.value))

function toggleSort(column) {
  if (sort.value === column) {
    order.value = order.value === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value = column
    order.value = 'asc'
  }
  fetchDocuments()
}

watch([page, limit, sort, order], fetchDocuments)
onMounted(() => {
  fetchFca()
  fetchDocuments()
})
</script>

<style scoped>
.fca-data-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: var(--text);
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #cce4cd;
}

.tab-btn {
  padding: 0.6rem 1.5rem;
  border: none;
  background: var(--bg-muted);
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  font-weight: 600;
  color: var(--text);
  transition: background 0.2s;
}
.tab-btn.active {
  background: var(--bg-elevated);
  color: var(--heading);
  border-bottom: 2px solid var(--brand-600);
}

.profile-tab,
.documents-tab {
  background: var(--bg-elevated);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 0 0 8px 8px;
  box-shadow: var(--shadow-sm);
  padding: 2rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1rem;
}
.field {
  min-width: 180px;
  margin-bottom: 0.5rem;
}

section {
  margin-bottom: 2rem;
}
section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: var(--heading);
  border-left: 4px solid var(--brand-600);
  padding-left: 0.5rem;
}

.officer-block,
.bod-block {
  border: 1px solid var(--border);
  padding: 12px 16px;
  margin-bottom: 1rem;
  border-radius: var(--radius-sm);
  background: var(--bg-muted);
  color: var(--text);
}

.officer-block strong,
.bod-block strong {
  color: var(--heading);
}

.edit-btn {
  background: #347a3d;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.edit-btn:hover {
  background: #285b2f;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  padding: 0;
}
.modal-content {
  background: var(--bg-elevated);
  width: min(100vw, 1000px);
  height: 100vh;
  height: 100dvh;
  max-height: none;
  overflow-y: auto;
  padding: 0;
  position: relative;
  box-shadow: -2px 0 16px rgba(0, 0, 0, 0.18);
  border-radius: 0;
  animation: slideIn 0.2s;
}

.modal-content :deep(.fca-form) {
  max-width: none;
  min-height: 100%;
  margin: 0;
  padding: 2rem;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  z-index: 2;
  font-size: 2rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}
.close-btn:hover {
  color: var(--brand-700);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.filter-input {
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
</style>
