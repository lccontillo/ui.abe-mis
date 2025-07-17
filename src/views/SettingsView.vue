<template>
  <div class="settings-container">
    <TitleBar title="Settings" :icon="Settings20" />

    <div class="tabs">
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

    <div class="tab-panel">
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
  padding: 2rem 1rem;
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
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s;
}

.tab-btn:hover {
  background: #d5eddb;
}

.tab-btn.active {
  background: #ffffff;
  color: #1e4f24;
  border-bottom: 2px solid #1e4f24;
}

.tab-panel {
  background: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 8px #0001;
  padding: 2rem;
}
</style>
