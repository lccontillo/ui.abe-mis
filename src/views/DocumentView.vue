<template>
  <div class="container app-page">
    <div class="page-header">
      <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Documents' }]" />
      <button class="btn btn-primary" type="button" @click="router.push('/generate')">
        <Add20 class="btn-icon" />
        <span>Generate Document</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-card panel">
      <form class="filters-grid" @submit.prevent="applyFilters">
        <div class="filter-field">
          <label class="filter-label">Document</label>
          <v-select
            v-model="selectedDocument"
            :options="docs"
            label="name"
            :reduce="(g) => g"
            placeholder="All Documents"
          ></v-select>
        </div>

        <div class="filter-field">
          <label class="filter-label">FCA</label>
          <v-select
            v-model="selectedFca"
            :options="fcas"
            label="name"
            :reduce="(g) => g"
            placeholder="All FCAs"
          ></v-select>
        </div>

        <div class="filter-field">
          <label class="filter-label">Group</label>
          <v-select
            v-model="selectedGroup"
            :options="groups"
            label="name"
            :reduce="(g) => g"
            placeholder="All Groups"
          ></v-select>
        </div>

        <div class="filter-field">
          <label class="filter-label">User</label>
          <v-select
            v-model="selectedUser"
            :options="users"
            label="name"
            :reduce="(g) => g"
            placeholder="All Users"
          ></v-select>
        </div>

        <div class="filter-actions">
          <button class="btn btn-primary" type="submit">
            Apply
          </button>
          <button class="btn btn-secondary" type="button" @click="resetFilters">
            Reset
          </button>
        </div>
      </form>
    </div>

    <!-- Table -->
    <DataTable
      :data="documents"
      :columns="columns"
      :sort="{ column: sort, order }"
      :onSort="toggleSort"
      :loading="isLoading"
      emptyTitle="No Documents Found"
      @view="viewDocument($event.document_id, $event.fca_name, $event.group_name)"
    >
      <template #actions="{ row }">
        <View20
          title="View"
          class="action-icon"
          @click="viewDocument(row.document_id, row.fca_name, row.group_name)"
        />
        <TrashCan20 title="Delete" class="action-icon text-red" @click="deleteDocument(row.id)" />
      </template>
    </DataTable>

    <!-- Pagination -->
    <PaginationBar 
      :currentPage="page" 
      :totalPages="totalPages" 
      :perPage="limit"
      @page-change="p => { page = p; fetchDocuments() }" 
      @per-page-change="l => { limit = l; page = 1; fetchDocuments() }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Add20, View20, TrashCan20 } from '@carbon/icons-vue'
import DataTable from '@/components/DataTable.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { API_BASE } from '@/config/api'

const token = localStorage.getItem('token')
const router = useRouter()
const route = useRoute()

const documents = ref([])
const total = ref(0)
const isLoading = ref(false)
const { confirm } = useConfirmDialog()

const selectedDocument = ref(null)
const selectedFca = ref(null)
const selectedUser = ref(null)
const selectedGroup = ref(null)

const docs = ref([])
const fcas = ref([])
const groups = ref([])
const users = ref([])

const page = ref(Number(route.query.page) || 1)
const limit = ref(Number(route.query.limit) || 10)
const sort = ref(route.query.sort || 'updated_at')
const order = ref(route.query.order || 'desc')

const totalPages = computed(() => Math.ceil(total.value / limit.value) || 1)

const columns = [
  { label: 'Document', key: 'document_name' },
  { label: 'FCA', key: 'fca_name' },
  { label: 'Group', key: 'group_name' },
  { label: 'User', key: 'created_by_username' },
  { label: 'Updated At', key: 'updated_at', sortable: true },
]

function toggleSort(column) {
  if (sort.value === column) {
    order.value = order.value === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value = column
    order.value = 'asc'
  }
  fetchDocuments()
}

function applyFilters() {
  page.value = 1
  fetchDocuments()
}

function resetFilters() {
  selectedDocument.value = null
  selectedFca.value = null
  selectedGroup.value = null
  selectedUser.value = null
  page.value = 1
  fetchDocuments()
}

function viewDocument(id, fca, group) {
  router.push(
    `/generate?document_id=${id}&fca=${encodeURIComponent(fca || '')}&group=${encodeURIComponent(group || '')}`,
  )
}

async function deleteDocument(id) {
  if (!await confirm('Delete Document?', 'Are you sure you want to delete this document? This action cannot be undone.', 'Delete')) return

  try {
    const res = await fetch(`${API_BASE}/generated_document/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to delete document.')
    }

    alert(`Deleted document ${id}`)
    await fetchDocuments()
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

async function fetchDocuments() {
  isLoading.value = true
  const params = new URLSearchParams()
  if (selectedDocument.value && selectedDocument.value.name) params.append('document_name', selectedDocument.value.name)
  if (selectedFca.value && selectedFca.value.name) params.append('fca_name', selectedFca.value.name)
  if (selectedUser.value && selectedUser.value.name) params.append('user_name', selectedUser.value.name)
  if (selectedGroup.value && selectedGroup.value.name) params.append('group_name', selectedGroup.value.name)
  params.append('sort', sort.value)
  params.append('order', order.value)
  params.append('page', page.value)
  params.append('limit', limit.value)

  try {
    const res = await fetch(`${API_BASE}/generated_documents?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    documents.value = data.data || []
    total.value = data.total || 0
  } catch (err) {
    console.error('Failed to fetch documents:', err)
  } finally {
    isLoading.value = false
  }
}

const fetchDocs = async () => {
  try {
    const res = await fetch(`${API_BASE}/documents?limit=all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    docs.value = data.data || []
  } catch (err) {
    console.error('Failed to fetch docs:', err)
  }
}

const fetchFcas = async () => {
  try {
    const res = await fetch(`${API_BASE}/fcas?limit=all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    fcas.value = data.data || []
  } catch (err) {
    console.error('Failed to fetch FCAs:', err)
  }
}

const fetchGroups = async () => {
  try {
    const res = await fetch(`${API_BASE}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    groups.value = data || []
  } catch (err) {
    console.error('Failed to fetch groups:', err)
  }
}

const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    users.value = data || []
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
}

watch([page, limit, sort, order], () => {
  router.replace({
    query: {
      page: page.value,
      limit: limit.value,
      sort: sort.value,
      order: order.value,
    },
  })
})

onMounted(() => {
  fetchDocuments()
  fetchFcas()
  fetchGroups()
  fetchUsers()
  fetchDocs()
})
</script>

<style scoped>
.container {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.filters-card {
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto;
  gap: 1rem;
  align-items: flex-end;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.filter-label {
  font-size: 0.78rem;
  font-weight: 650;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
}

.filter-actions .btn {
  min-width: 80px;
  height: 40px;
}

.action-icon {
  cursor: pointer;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--duration-fast) ease, opacity var(--duration-fast) ease;
}

.action-icon:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.text-red {
  color: var(--danger-strong);
}

:deep(.v-select .vs__dropdown-toggle) {
  min-height: 40px;
  height: 40px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
}

:deep(.v-select .vs__selected) {
  color: var(--text);
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
}

:deep(.v-select .vs__search) {
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
  color: var(--text);
}

:deep(.v-select .vs__search::placeholder) {
  color: var(--text-soft);
  font-size: 0.9rem;
}

:deep(.v-select .vs__actions) {
  padding: 0 0 0 0.25rem;
}

:deep(.v-select .vs__clear),
:deep(.v-select .vs__open-indicator) {
  fill: var(--text-soft);
}

@media (max-width: 1200px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .filter-actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  .filter-actions {
    grid-column: 1 / -1;
    justify-content: stretch;
  }
  .filter-actions .btn {
    flex: 1;
  }
}
</style>
