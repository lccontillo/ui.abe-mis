<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Home20, Add20, ArrowRight20 } from '@carbon/icons-vue'
import TitleBar from '@/components/TitleBar.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useUserStore } from '@/stores/user'
import { API_BASE } from '@/config/api'
const userStore = useUserStore()

const token = localStorage.getItem('token')
const stats = ref({})
const logs = ref([])
const isLoading = ref(true)
const router = useRouter()

const fetchStats = async () => {
  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  stats.value = await res.json()
}

const fetchRecentLogs = async () => {
  const params = new URLSearchParams({ page: 1, limit: 10, sort: 'created_at', order: 'desc' })
  const res = await fetch(`${API_BASE}/audit_logs?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  logs.value = data.data
}

onMounted(async () => {
  isLoading.value = true
  userStore.fetchMe()
  await Promise.all([fetchStats(), fetchRecentLogs()])
  isLoading.value = false
})
</script>

<template>
  <div class="dashboard app-page">
    <TitleBar title="Dashboard" />

    <div v-if="isLoading" class="dashboard-loading">
      <div class="stat-row">
        <SkeletonLoader type="card" v-for="i in 2" :key="i" />
      </div>
      <SkeletonLoader type="table" />
    </div>

    <div v-else class="fade-in">
      <!-- Action + Stats -->
      <div class="stat-row">
        <button class="btn btn-primary" @click="router.push('/fca')">
          <Add20 class="btn-icon" />
          New FCA
        </button>
        <button class="btn btn-secondary" @click="router.push('/generate')">
          <Add20 class="btn-icon" />
          Generate Document
        </button>

        <div class="stat-card panel clickable" @click="router.push('/fcas')">
          <div class="stat-label">Total FCAs</div>
          <div class="stat-value">
            {{ stats.total_fcas }}
            <ArrowRight20 class="arrow-icon" />
          </div>
        </div>

        <div class="stat-card panel clickable" @click="router.push('/documents')">
          <div class="stat-label">Documents Generated</div>
          <div class="stat-value">
            {{ stats.total_generated_documents }}
            <ArrowRight20 class="arrow-icon" />
          </div>
        </div>
      </div>

      <!-- Recent Logs -->
      <div class="card panel">
        <div class="card-header">
          <h2>Recent Activity</h2>
          <button v-if="logs.length" class="view-all" @click="router.push('/settings/logs')">View All</button>
        </div>
        <div v-if="logs.length" class="table-wrap">
          <table class="log-table table">
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
        <EmptyState 
          v-else 
          title="No recent activity" 
          description="Actions performed in the system will appear here."
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader-center {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  min-width: 0;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.stat-card {
  padding: 1rem;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 850;
  color: var(--heading);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: var(--brand-600);
}

.clickable {
  cursor: pointer;
}

.card {
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-header h2 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--heading);
}

.view-all {
  background: none;
  border: none;
  font-size: 0.9rem;
  color: var(--accent-blue);
  cursor: pointer;
  font-weight: 700;
}

.view-all:hover {
  text-decoration: underline;
}

.log-table {
  font-size: 0.88rem;
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
