<template>
  <div class="container app-page">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'FCAs' }]" />
    <TitleBar title="Farmers' Cooperative Associations" :icon="Home20" />

    <!-- Filters -->
    <div class="filters">
      <input v-model="filters.keyword" placeholder="Search..." />
      <select v-model="filters.type">
        <option value="">All Types</option>
        <option value="Cooperative">Cooperative</option>
        <option value="Association">Association</option>
      </select>
      <!-- <select v-model="filters.major_commodity">
        <option value="">All Commodities</option>
        <option value="Rice">Rice</option>
        <option value="Corn">Corn</option>
        <option value="Peanuts">Peanuts</option>
      </select> -->
      <button class="btn btn-secondary" type="button" @click="resetFilters">Reset</button>
      <button class="btn btn-primary" type="button" @click="fetchFcas">Apply</button>
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
      @page-change="p => { pagination.page = p; fetchFcas() }" 
      @per-page-change="l => { pagination.limit = l; pagination.page = 1; fetchFcas() }"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TitleBar from '@/components/TitleBar.vue'
import DataTable from '@/components/DataTable.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { Home20, View20, DocumentExport20, TrashCan20, Launch20 } from '@carbon/icons-vue'

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
  // { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Acronym', key: 'acronym', sortable: true },
  { label: 'Type', key: 'type', sortable: true },
  // { label: 'Municipality', key: 'municipality' },
  // { label: 'Province', key: 'province' },
  { label: 'Major Commodity', key: 'major_commodity' },
  { label: 'Chairman', key: 'chairman' },
  { label: 'Members', key: 'total_members' },
  // { label: 'Repository', key: 'repository' },
]

const totalPages = computed(() => Math.ceil(total.value / pagination.value.limit))

function toggleSort(column) {
  if (sort.value.column === column) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.column = column
    sort.value.order = 'asc'
  }
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

function openLink(url) {
  if (url) {
    window.open(url, '_blank')
  }
}

function generateDocs(id) {
  router.push(`/generate?fca=${id}`)
}

async function deleteFca(id) {
  if (!await confirm('Delete FCA?', 'Are you sure you want to delete this FCA? This action cannot be undone.', 'Delete')) return

  try {
    const res = await fetch(`https://api-abealcala.duckdns.org/fcas/${id}`, {
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
    await fetchFcas() // Refresh the list
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
    const res = await fetch(`https://api-abealcala.duckdns.org/fcas?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const json = await res.json()
    fcas.value = json.data
    total.value = json.total
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
</style>
