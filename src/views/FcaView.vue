<template>
  <div class="container app-page">
    <div class="page-header">
      <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'FCAs' }]" />
      <button class="btn btn-primary" type="button" @click="router.push('/fca')">
        <Add20 class="btn-icon" />
        <span>New FCA</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-card panel">
      <form class="filters-form" @submit.prevent="applyFilters">
        <div class="filter-field search-field">
          <label class="filter-label">Search</label>
          <div class="input-with-icon">
            <Search20 class="input-icon" />
            <input
              v-model="filters.keyword"
              type="search"
              class="field-control has-icon"
              placeholder="Search by name, acronym, chairman..."
              @keyup.enter="applyFilters"
            />
          </div>
        </div>

        <div class="filter-field type-field">
          <label class="filter-label">FCA Type</label>
          <select v-model="filters.type" class="field-control" @change="applyFilters">
            <option value="">All Types</option>
            <option value="Cooperative">Cooperative</option>
            <option value="Association">Association</option>
          </select>
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
      :data="fcas"
      :columns="columns"
      :sort="sort"
      :onSort="toggleSort"
      :loading="isLoading"
      emptyTitle="No FCAs Match Filters"
      @view="viewFca($event.id)"
    >
      <template #actions="{ row }">
        <View20 title="View" class="action-icon" @click="viewFca(row.id)" />
        <Launch20
          title="Open Repository"
          :class="['action-icon', { disabled: !row.repository }]"
          @click="openLink(row.repository)"
        />
        <TrashCan20 title="Delete" class="action-icon text-red" @click="deleteFca(row.id)" />
      </template>
    </DataTable>

    <!-- Pagination -->
    <PaginationBar 
      :currentPage="pagination.page" 
      :totalPages="totalPages" 
      :perPage="pagination.limit"
      @page-change="p => { pagination.page = p; fetchFcas() }" 
      @per-page-change="l => { pagination.limit = l; pagination.page = 1; fetchFcas() }"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '@/components/DataTable.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { Add20, Search20, View20, TrashCan20, Launch20 } from '@carbon/icons-vue'
import { API_BASE } from '@/config/api'

const router = useRouter()
const token = localStorage.getItem('token')

const fcas = ref([])
const total = ref(0)
const isLoading = ref(false)
const { confirm } = useConfirmDialog()

const filters = ref({
  keyword: '',
  type: '',
  major_commodity: '',
})

const sort = ref({
  column: 'name',
  order: 'asc',
})

const pagination = ref({
  page: 1,
  limit: 10,
})

const columns = [
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Acronym', key: 'acronym', sortable: true },
  { label: 'Type', key: 'type', sortable: true },
  { label: 'Major Commodity', key: 'major_commodity' },
  { label: 'Chairman', key: 'chairman' },
  { label: 'Members', key: 'total_members' },
]

const totalPages = computed(() => Math.ceil(total.value / pagination.value.limit) || 1)

function toggleSort(column) {
  if (sort.value.column === column) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.column = column
    sort.value.order = 'asc'
  }
  fetchFcas()
}

function applyFilters() {
  pagination.value.page = 1
  fetchFcas()
}

function resetFilters() {
  filters.value = { keyword: '', type: '', major_commodity: '' }
  pagination.value.page = 1
  fetchFcas()
}

function viewFca(id) {
  router.push(`/fca/${id}`)
}

function openWebsite(url) {
  if (url) {
    window.open(url, '_blank')
  }
}

async function deleteFca(id) {
  if (!await confirm('Delete FCA?', 'Are you sure you want to delete this FCA? This action cannot be undone.', 'Delete')) return

  try {
    const res = await fetch(`${API_BASE}/fcas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to delete FCA.')
    }

    alert(`Deleted FCA ${id}`)
    await fetchFcas()
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

async function fetchFcas() {
  isLoading.value = true
  const params = new URLSearchParams()
  if (filters.value.keyword) params.append('filters', filters.value.keyword)
  if (filters.value.type) params.append('type', filters.value.type)
  if (filters.value.major_commodity) params.append('major_commodity', filters.value.major_commodity)
  params.append('sort', sort.value.column)
  params.append('order', sort.value.order)
  params.append('page', pagination.value.page)
  params.append('limit', pagination.value.limit)

  try {
    const res = await fetch(`${API_BASE}/fcas?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const json = await res.json()
    fcas.value = json.data || []
    total.value = json.total || 0
  } catch (err) {
    alert('Error: ' + err.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchFcas)
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

.filters-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.filter-field.search-field {
  flex: 1 1 300px;
  min-width: 220px;
}

.filter-field.type-field {
  flex: 0 1 220px;
  min-width: 160px;
}

.filter-label {
  font-size: 0.78rem;
  font-weight: 650;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  width: 18px;
  height: 18px;
  color: var(--text-soft);
  pointer-events: none;
}

.field-control.has-icon {
  padding-left: 2.35rem;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.filter-actions .btn {
  min-width: 84px;
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

.action-icon.disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

.text-red {
  color: var(--danger-strong);
}

@media (max-width: 768px) {
  .filters-form {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-field.search-field,
  .filter-field.type-field {
    flex: 1 1 100%;
    width: 100%;
  }

  .filter-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
