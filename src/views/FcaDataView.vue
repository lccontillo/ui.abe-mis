<template>
  <div class="fca-data-view">
    <TitleBar title="FCA Details" :icon="Document20" />

    <!-- Tabs -->
    <div class="tabs">
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
    <div v-if="activeTab === 'profile'" class="profile-tab">
      <div class="flex justify-between items-center mb-4">
        <button class="edit-btn" @click="showEdit = true">Edit FCA</button>
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
              <div class="field"><strong>Position:</strong> {{ bod.position }}</div>
              <div class="field"><strong>Civil Status:</strong> {{ bod.civil_status }}</div>
              <div class="field"><strong>Birth Date:</strong> {{ formatDate(bod.birth_date) }}</div>
              <div class="field"><strong>Mobile No:</strong> {{ bod.mobile_no }}</div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Documents Tab -->
    <div v-if="activeTab === 'documents'" class="documents-tab">
      <div class="filters">
        <input v-model="selectedDocument" placeholder="Filter by Document" class="filter-input" />
        <input v-model="selectedGroup" placeholder="Filter by Group" class="filter-input" />
        <input v-model="selectedUser" placeholder="Filter by User" class="filter-input" />
        <button @click="fetchDocuments">Apply</button>
      </div>

      <DataTable
        :data="documents"
        :columns="columns"
        :sort="{ column: sort, order }"
        :onSort="toggleSort"
      >
        <template #actions="{ row }">
          <a :href="row.download_url" target="_blank" title="Download" class="action-icon">
            <Download20 />
          </a>
        </template>
      </DataTable>

      <div class="pagination">
        <div>
          <button :disabled="page === 1" @click="page-- && fetchDocuments()">Prev</button>
          <span>Page {{ page }} of {{ totalPages }}</span>
          <button :disabled="page >= totalPages" @click="page++ && fetchDocuments()">Next</button>
        </div>
        <div class="limit">
          <label>Rows per page:</label>
          <select v-model="limit" @change="fetchDocuments()">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEdit" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="showEdit = false">&times;</button>
        <FcaForm
          :initialData="fca"
          :editMode="true"
          @close="showEdit = false"
          @updated="handleUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import TitleBar from '@/components/TitleBar.vue'
import DataTable from '@/components/DataTable.vue'
import FcaForm from './FcaForm.vue'
import { Document20 } from '@carbon/icons-vue'

const token = localStorage.getItem('token')
const route = useRoute()
const fcaId = Number(route.params.id) || 2

const activeTab = ref('profile')
const loading = ref(true)
const fca = reactive({ general: {}, organization: {}, officers: [], bods: [] })
const showEdit = ref(false)

function formatDate(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : ''
}

async function fetchFca() {
  loading.value = true
  const res = await fetch(`https://api-ai-portraits.duckdns.org/fca/${fcaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  Object.assign(fca, await res.json())
  loading.value = false
}

function handleUpdate() {
  fetchFca()
  showEdit.value = false
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
  console.log('Fetching documents...', fcaId)
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
  const res = await fetch(`https://api-ai-portraits.duckdns.org/generated_documents?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  documents.value = data.data.map((d) => ({
    ...d,
    download_url: d.download_url || `/api/documents/${d.id}/download`,
  }))
  total.value = data.total
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1f2d16;
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
  background: #e6f4ea;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  font-weight: 600;
  color: #347a3d;
  transition: background 0.2s;
}
.tab-btn.active {
  background: #ffffff;
  color: #1e4f24;
  border-bottom: 2px solid #1e4f24;
}

.profile-tab,
.documents-tab {
  background: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 8px #0001;
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
  color: #2c5e33;
  border-left: 4px solid #72c17f;
  padding-left: 0.5rem;
}

.officer-block,
.bod-block {
  border: 1px solid #cce4cd;
  padding: 12px 16px;
  margin-bottom: 1rem;
  border-radius: 6px;
  background: #f8fdf9;
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
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}
.modal-content {
  background: #fff;
  width: 1000px;
  height: 100vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: -2px 0 16px #0002;
  border-radius: 8px 0 0 8px;
  animation: slideIn 0.2s;
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
  top: 1.2rem;
  right: 2rem;
  font-size: 2rem;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
}
.close-btn:hover {
  color: #347a3d;
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
