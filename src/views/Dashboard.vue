<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Home20, Add20, ArrowRight20 } from '@carbon/icons-vue'
import TitleBar from '@/components/TitleBar.vue'

const token = localStorage.getItem('token')
const stats = ref({})
const logs = ref([])
const router = useRouter()

const fetchStats = async () => {
  const res = await fetch('http://localhost:3000/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  })
  stats.value = await res.json()
}

const fetchRecentLogs = async () => {
  const params = new URLSearchParams({ page: 1, limit: 10, sort: 'created_at', order: 'desc' })
  const res = await fetch(`http://localhost:3000/audit_logs?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  logs.value = data.data
}

onMounted(() => {
  fetchStats()
  fetchRecentLogs()
})
</script>

<template>
  <div class="dashboard">
    <TitleBar title="Dashboard" />

    <div v-if="!stats.total_fcas && !logs.length" class="loader-center">
      <DonutLoader color="#2e7d32" size="1.5rem" :multi="false" />
    </div>

    <div v-else>
      <!-- Action + Stats -->
      <div class="stat-row">
        <button class="btn btn-green" @click="router.push('/fca')">
          <Add20 class="btn-icon" />
          New FCA
        </button>
        <button class="btn btn-blue" @click="router.push('/generate')">
          <Add20 class="btn-icon" />
          Generate Document
        </button>

        <div class="stat-card clickable" @click="router.push('/fcas')">
          <div class="stat-label">Total FCAs</div>
          <div class="stat-value">
            {{ stats.total_fcas }}
            <ArrowRight20 class="arrow-icon" />
          </div>
        </div>

        <div class="stat-card clickable" @click="router.push('/documents')">
          <div class="stat-label">Documents Generated</div>
          <div class="stat-value">
            {{ stats.total_generated_documents }}
            <ArrowRight20 class="arrow-icon" />
          </div>
        </div>
      </div>

      <!-- Recent Logs -->
      <div class="card">
        <div class="card-header">
          <h2>Recent Activity</h2>
          <button class="view-all" @click="router.push('/settings/logs')">View All</button>
        </div>
        <table class="log-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Metadata</th>
              <th>User</th>
              <th>Date</th>
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1.5rem;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.loader-center {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  flex: 1 1 200px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.9rem;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-green {
  background-color: #2e7d32;
}

.btn-green:hover {
  background-color: #256128;
}

.btn-blue {
  background-color: #1976d2;
}

.btn-blue:hover {
  background-color: #125a9e;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.stat-card {
  flex: 1 1 200px;
  background: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.stat-label {
  color: #666;
  font-size: 0.85rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: #999;
}

.clickable {
  cursor: pointer;
}

.card {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2e7d32;
}

.view-all {
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #1976d2;
  cursor: pointer;
}

.view-all:hover {
  text-decoration: underline;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.log-table thead th {
  background-color: #f0f4f0;
  padding: 0.5rem;
  text-align: left;
  color: #444;
  font-weight: 600;
}

.log-table tbody td {
  padding: 0.5rem;
  color: #333;
  border-top: 1px solid #eee;
}

.log-table tbody tr:hover {
  background-color: #f8fdf8;
}
</style>
