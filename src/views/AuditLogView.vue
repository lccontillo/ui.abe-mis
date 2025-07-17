<script setup>
import { ref, onMounted, watch } from 'vue'

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

const token = localStorage.getItem('token')

const fetchLogs = async () => {
  const params = new URLSearchParams({
    page: page.value,
    limit: limit.value,
    sort: sort.value,
    order: order.value,
  })

  if (filterUser.value) params.append('username', filterUser.value)
  if (filterAction.value) params.append('action_id', filterAction.value)

  const res = await fetch(`https://api-abealcala.duckdns.org/audit_logs?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  logs.value = data.data
  total.value = data.total
  extractFilters(data.data)
}

function extractFilters(data) {
  users.value = [...new Set(data.map((d) => d.username))]
  actionIds.value = [...new Set(data.map((d) => d.action_id))]
}

function toggleSort() {
  order.value = order.value === 'asc' ? 'desc' : 'asc'
  page.value = 1
  fetchLogs()
}

watch([filterUser, filterAction, page, limit], fetchLogs)

onMounted(fetchLogs)
</script>

<template>
  <div>
    <!-- Filters -->
    <div class="filters">
      <select v-model="filterUser">
        <option value="">All Users</option>
        <option v-for="u in users" :key="u" :value="u">{{ u }}</option>
      </select>
      <select v-model="filterAction">
        <option value="">All Actions</option>
        <option v-for="a in actionIds" :key="a" :value="a">{{ a }}</option>
      </select>
    </div>

    <!-- Table -->
    <table class="table">
      <thead>
        <tr>
          <th>Action</th>
          <th>Metadata</th>
          <th>User</th>
          <th @click="toggleSort">
            Created At
            <span style="float: right">{{ order === 'asc' ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <td>{{ log.action_id }}</td>
          <td>{{ log.metadata }}</td>
          <td>{{ log.username }}</td>
          <td>{{ new Date(log.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <label>
        Per page:
        <select v-model.number="limit">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </label>
      <div class="pages">
        <button :disabled="page === 1" @click="page--">Prev</button>
        <span>Page {{ page }}</span>
        <button :disabled="page * limit >= total" @click="page++">Next</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.pagination {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.pages button {
  padding: 0.3rem 0.6rem;
}
</style>
