<template>
  <div class="settings-container app-page">
    <TitleBar title="Settings" :icon="Settings20" />

    <div class="tabs settings-tabs">
      <RouterLink to="/settings" class="tab-btn" exact-active-class="active">Account</RouterLink>
      <RouterLink
        v-if="userStore.user?.is_admin"
        to="/settings/templates"
        class="tab-btn"
        exact-active-class="active"
      >
        Templates
      </RouterLink>

      <RouterLink
        v-if="userStore.user?.is_admin"
        to="/settings/users"
        class="tab-btn"
        exact-active-class="active"
      >
        Users
      </RouterLink>
      <RouterLink to="/settings/logs" class="tab-btn" exact-active-class="active"
        >Activity Log</RouterLink
      >
    </div>

    <div class="tab-panel panel">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TitleBar from '@/components/TitleBar.vue'
import { Settings20 } from '@carbon/icons-vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
// const user = ref(null)

// onMounted(async () => {
//   const token = localStorage.getItem('token')
//   if (!token) return

//   try {
//     const res = await fetch('https://api-abealcala.duckdns.org/me', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//     const data = await res.json()
//     if (data.code === 200) {
//       user.value = data.user
//     }
//   } catch (err) {
//     console.error('Failed to fetch user:', err)
//   }
// })
</script>

<style scoped>
.settings-container {
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--border);
}

.tab-btn {
  padding: 0.6rem 1.5rem;
  border: none;
  background: var(--bg-muted);
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  font-weight: 700;
  color: var(--text-muted);
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.tab-btn:hover {
  background: var(--brand-50);
}

.tab-btn.active {
  background: var(--brand-50);
  color: var(--brand-700);
  border-bottom: 2px solid var(--brand-600);
}

.tab-panel {
  border-radius: 0 0 8px 8px;
  padding: 2rem;
}

@media (max-width: 720px) {
  .tab-panel {
    padding: 1rem;
  }
}
</style>
