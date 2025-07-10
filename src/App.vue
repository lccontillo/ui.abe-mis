<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { Home20, Document20, Settings20, Logout20, UserProfile20, Add20 } from '@carbon/icons-vue'

const router = useRouter()
const route = useRoute()
const user = ref(null)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  const res = await fetch('https://api-ai-portraits.duckdns.org/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  if (data.code === 200) {
    user.value = data.user
  }
})

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <div v-if="route.path === '/login'">
    <RouterView />
  </div>
  <div v-else class="layout">
    <aside class="sidebar">
      <div class="sidebar-top">
        <!-- Logo + Project Name -->
        <div class="logo-title">
          <!-- Replace with actual logo -->
          <div class="logo-icon">
            <img src="@/assets/logo-darkmode.svg" alt="ABE Logo" width="45" height="45" />
          </div>
          <div class="header-text">
            <div class="project-name">ABE Alcala MIS</div>
            <div class="user-info" v-if="user">
              <span class="user-name">{{ user.username }}</span>
            </div>
          </div>
        </div>

        <nav class="nav">
          <RouterLink to="/" class="nav-item" :class="{ active: route.path === '/' }">
            <Home20 class="icon" />
            <span>Dashboard</span>
          </RouterLink>

          <RouterLink
            to="/fcas"
            class="nav-item"
            :class="{ active: route.path.startsWith('/fca') }"
          >
            <UserProfile20 class="icon" />
            <span>FCA Profiles</span>
            <Add20 class="plus-icon" @click.stop="router.push('/fca')" />
          </RouterLink>

          <RouterLink
            to="/documents"
            class="nav-item"
            :class="{ active: route.path === '/documents' }"
          >
            <Document20 class="icon" />
            <span>Documents</span>
            <Add20 class="plus-icon" @click.stop="router.push('/generate')" />
          </RouterLink>

          <RouterLink
            to="/settings"
            class="nav-item"
            :class="{ active: route.path.startsWith('/settings') }"
          >
            <Settings20 class="icon" />
            <span>Settings</span>
          </RouterLink>
        </nav>
      </div>

      <div class="logout-section">
        <button class="logout-btn" @click="logout">
          <Logout20 class="icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
}

.main-content {
  width: calc(100% - 250px);
  overflow-y: auto;
}

.sidebar {
  width: 250px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #ddd;
}

.user-name {
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
  margin-top: 4px;
}

.sidebar-top {
  padding-top: 1rem;
}

.logo-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem 1.25rem;
  border-bottom: 1px solid #e0e0e0;
}

.logo-icon {
  background-color: #2e7d32;
  border-radius: 6px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-name {
  font-weight: bold;
  font-size: 1rem;
  color: #2e7d32; /* Neutral text color */
}

.nav {
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
  position: relative;
  transition: background 0.2s;
  font-size: 0.95rem;
}

.nav-item:hover {
  background-color: #eef6ee;
}

.nav-item.active {
  font-weight: 600;
  background-color: #d9ead3;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #2e7d32;
}

.icon {
  color: #2e7d32;
}

.plus-icon {
  margin-left: auto;
  cursor: pointer;
  color: #2e7d32;
}

.logout-section {
  border-top: 1px solid #ddd;
  padding: 1rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: #444;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.logout-btn:hover {
  background-color: #faeaea;
  color: #b71c1c;
}

.logout-btn .icon {
  color: #b71c1c;
}
</style>
