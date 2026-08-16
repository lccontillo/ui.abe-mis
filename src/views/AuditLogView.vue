<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import TitleBar from '@/components/TitleBar.vue'
import DataTable from '@/components/DataTable.vue'
import PaginationBar from '@/components/PaginationBar.vue'

const logs = ref([])
const users = ref([])
const actionIds = ref([])
const filterUser = ref('')
const filterAction = ref('')
const sort = ref('created_at')
const order = ref('desc')
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const isLoading = ref(false)

const columns = [
  { label: 'Action', key: 'action_id' },
  { label: 'Metadata', key: 'metadata' },
  { label: 'User', key: 'username' },
  { label: 'Created At', key: 'created_at', sortable: true },
]

const token = localStorage.getItem('token')

const fetchLogs = async () => {
  isLoading.value = true
  const params = new URLSearchParams({
    page: page.value,
    limit: limit.value,
    sort: sort.value,
    order: order.value,
  })

  if (filterUser.value) params.append('username', filterUser.value)
  if (filterAction.value) params.append('action_id', filterAction.value)

  try {
    const res = await fetch(`https://api-abealcala.duckdns.org/audit_logs?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()
    logs.value = data.data
    total.value = data.total
    extractFilters(data.data)
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

function extractFilters(data) {
  users.value = [...new Set(data.map((d) => d.username))]
  actionIds.value = [...new Set(data.map((d) => d.action_id))]
}

function handleSort(col) {
  sort.value = col
  order.value = order.value === 'asc' ? 'desc' : 'asc'
  page.value = 1
  fetchLogs()
}

watch([filterUser, filterAction], () => {
  page.value = 1
  fetchLogs()
})

onMounted(fetchLogs)
</script>

<template>
  <div class="audit-log app-page">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Settings', to: '/settings' }, { label: 'Audit Logs' }]" />
    <TitleBar title="Audit Logs" />

    <!-- Filters -->
    <div class="filters">
      <select v-model="filterUser" class="field-control">
        <option value="">All Users</option>
        <option v-for="u in users" :key="u" :value="u">{{ u }}</option>
      </select>
      <select v-model="filterAction" class="field-control">
        <option value="">All Actions</option>
        <option v-for="a in actionIds" :key="a" :value="a">{{ a }}</option>
      </select>
    </div>

    <!-- Table -->
    <DataTable
      :data="logs"
      :columns="columns"
      :sort="{ column: sort, order }"
      :onSort="handleSort"
      :loading="isLoading"
    />

    <!-- Pagination -->
    <PaginationBar 
      :currentPage="page" 
      :totalPages="Math.ceil(total / limit)" 
      :perPage="limit"
      @page-change="p => { page = p; fetchLogs() }" 
      @per-page-change="l => { limit = l; page = 1; fetchLogs() }"
    />
  </div>
</template>

<style scoped>
.audit-log {
  padding: 0;
}
</style>
