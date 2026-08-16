<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import {
  Home20,
  Document20,
  Settings20,
  Logout20,
  UserProfile20,
  Add20,
  Road20,
  Map20,
  Menu20,
  Close20,
  ChevronLeft20,
} from '@carbon/icons-vue'
import { useUserStore } from '@/stores/user'
import ConfirmDialog from './components/ConfirmDialog.vue'
import Toast from './components/Toast.vue'

const userStore = useUserStore()

const router = useRouter()
const route = useRoute()
const user = ref(null)
const isSidebarCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
const isMobileMenuOpen = ref(false)
const isLoginRoute = computed(() => route.path === '/login')

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  const res = await fetch('https://api-abealcala.duckdns.org/me', {
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
  userStore.clearUser()

  router.push('/login')
}

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('sidebar-collapsed', String(isSidebarCollapsed.value))
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
  },
)
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div v-if="isLoginRoute">
    <RouterView />
  </div>

  <div v-else class="layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <header class="mobile-topbar">
      <button class="icon-btn" type="button" aria-label="Open navigation" @click="toggleMobileMenu">
        <Menu20 />
      </button>
      <div class="mobile-brand">
        <img src="@/assets/logo.svg" alt="ABE Logo" width="34" height="34" />
        <span>ABE Alcala MIS</span>
      </div>
    </header>

    <Transition name="drawer-fade">
      <button
        v-if="isMobileMenuOpen"
        class="mobile-scrim"
        type="button"
        aria-label="Close navigation"
        @click="closeMobileMenu"
      />
    </Transition>

    <aside class="sidebar" :class="{ open: isMobileMenuOpen }">
      <div class="sidebar-top">
        <div class="logo-title">
          <div class="logo-icon">
            <img src="@/assets/logo.svg" alt="ABE Logo" width="42" height="42" />
          </div>
          <div class="header-text">
            <div class="project-name">ABE Alcala MIS</div>
            <div class="user-info" v-if="userStore.user">
              <span class="user-name">{{ userStore.user.username }}</span>
            </div>
          </div>
          <button
            class="mobile-close icon-btn"
            type="button"
            aria-label="Close navigation"
            @click="closeMobileMenu"
          >
            <Close20 />
          </button>
        </div>

        <nav class="nav" aria-label="Primary navigation">
          <div class="nav-item" :class="{ active: route.path === '/' }">
            <RouterLink to="/" class="nav-link" title="Dashboard">
              <Home20 class="icon" />
              <span>Dashboard</span>
            </RouterLink>
          </div>

          <div class="nav-item" :class="{ active: route.path.startsWith('/fca') }">
            <RouterLink to="/fcas" class="nav-link" title="FCA Profiles">
              <UserProfile20 class="icon" />
              <span>FCA Profiles</span>
            </RouterLink>
            <button
              class="nav-action"
              type="button"
              aria-label="Add FCA profile"
              @click="router.push('/fca')"
            >
              <Add20 />
            </button>
          </div>

          <div class="nav-item" :class="{ active: route.path === '/documents' }">
            <RouterLink to="/documents" class="nav-link" title="Documents">
              <Document20 class="icon" />
              <span>Documents</span>
            </RouterLink>
            <button
              class="nav-action"
              type="button"
              aria-label="Generate document"
              @click="router.push('/generate')"
            >
              <Add20 />
            </button>
          </div>

          <div class="nav-item" :class="{ active: route.path.startsWith('/fmr-network-plan') }">
            <RouterLink to="/fmr-network-plan" class="nav-link" title="FMR Network Plan">
              <Road20 class="icon" />
              <span>FMR Network Plan</span>
            </RouterLink>
          </div>

          <div class="nav-item" :class="{ active: route.path.startsWith('/farm-area-gis') }">
            <RouterLink to="/farm-area-gis" class="nav-link" title="Farm Area GIS">
              <Map20 class="icon" />
              <span>Farm Area GIS</span>
            </RouterLink>
          </div>

          <div class="nav-item" :class="{ active: route.path.startsWith('/settings') }">
            <RouterLink to="/settings" class="nav-link" title="Settings">
              <Settings20 class="icon" />
              <span>Settings</span>
            </RouterLink>
          </div>
        </nav>
      </div>

      <div class="logout-section">
        <button
          class="collapse-btn"
          type="button"
          :aria-label="isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'"
          @click="toggleSidebar"
        >
          <ChevronLeft20 class="icon collapse-icon" />
          <span>Collapse menu</span>
        </button>
        <button class="logout-btn" type="button" title="Logout" @click="logout">
          <Logout20 class="icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <main id="main-content" class="main-content">
      <RouterView />
    </main>
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  background: var(--bg);
  transition: grid-template-columns 180ms ease;
}

.layout.sidebar-collapsed {
  grid-template-columns: var(--sidebar-collapsed-width) minmax(0, 1fr);
}

.main-content {
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
  background: var(--bg);
}

.sidebar {
  min-width: 0;
  background: var(--bg-elevated);
  color: var(--text);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  z-index: var(--z-overlay);
  transition:
    transform 200ms ease,
    width 180ms ease;
}

.user-name {
  display: block;
  max-width: 150px;
  overflow: hidden;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-top {
  padding-top: 1rem;
}

.logo-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.logo-icon {
  flex: 0 0 auto;
  background: var(--brand-50);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-name {
  color: var(--heading);
  font-size: 1rem;
  font-weight: 800;
  white-space: nowrap;
}

.header-text {
  min-width: 0;
  flex: 1;
}

.mobile-close,
.mobile-topbar,
.mobile-scrim {
  display: none;
}

.nav {
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text);
  position: relative;
  transition:
    background-color 160ms ease,
    color 160ms ease;
  font-size: 0.95rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: inherit;
  flex: 1;
  min-width: 0;
}

.nav-link span,
.logout-btn span,
.header-text {
  transition:
    opacity 160ms ease,
    width 160ms ease;
}

.nav-item:hover {
  background: var(--brand-50);
}

.nav-item.active {
  background: var(--brand-100);
  color: var(--heading);
  font-weight: 700;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--brand-600);
}

.icon {
  flex: 0 0 auto;
  color: var(--brand-600);
}

.nav-action {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  color: var(--brand-600);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-action:hover {
  background: var(--bg-elevated);
}

.logout-section {
  border-top: 1px solid var(--border);
  padding: 1rem;
  display: grid;
  gap: 0.35rem;
}

.logout-btn,
.collapse-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}

.logout-btn:hover {
  background: color-mix(in srgb, var(--danger-strong) 10%, transparent);
  color: var(--danger-strong);
}

.logout-btn:hover .icon {
  color: var(--danger-strong);
}

.collapse-btn:hover {
  background: var(--brand-50);
  color: var(--heading);
}

.collapse-icon {
  transition: transform 180ms ease;
}

.sidebar-collapsed .header-text,
.sidebar-collapsed .nav-link span,
.sidebar-collapsed .logout-btn span,
.sidebar-collapsed .collapse-btn span {
  width: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  display: none;
}

.sidebar-collapsed .logo-title {
  justify-content: center;
  padding: 0 0 1.25rem;
}

.sidebar-collapsed .collapse-icon {
  transform: rotate(180deg);
}

.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.sidebar-collapsed .nav-link {
  justify-content: center;
  gap: 0;
  flex: 1;
  width: 100%;
}

.sidebar-collapsed .nav-action {
  display: none;
}

.sidebar-collapsed .logout-section {
  padding: 1rem 0;
}

.sidebar-collapsed .logout-btn,
.sidebar-collapsed .collapse-btn {
  justify-content: center;
  gap: 0;
  width: 100%;
  padding: 0.5rem 0;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 180ms ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

@media (max-width: 860px) {
  .layout,
  .layout.sidebar-collapsed {
    display: block;
    padding-top: var(--topbar-height);
  }

  .main-content {
    height: calc(100vh - var(--topbar-height));
  }

  .mobile-topbar {
    position: fixed;
    inset: 0 0 auto;
    height: var(--topbar-height);
    z-index: var(--z-sticky);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1rem;
    background: var(--bg-elevated);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    color: var(--heading);
    font-weight: 800;
  }

  .mobile-scrim {
    position: fixed;
    inset: 0;
    z-index: var(--z-overlay);
    display: block;
    border: 0;
    background: rgba(8, 13, 10, 0.58);
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: min(86vw, var(--sidebar-width));
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .collapse-btn {
    display: none;
  }

  .mobile-close {
    display: inline-flex;
    margin-left: auto;
  }

  .sidebar-collapsed .header-text,
  .sidebar-collapsed .nav-link span,
  .sidebar-collapsed .logout-btn span {
    width: auto;
    opacity: 1;
    overflow: visible;
    pointer-events: auto;
  }

  .sidebar-collapsed .nav-action {
    display: inline-flex;
  }
}
</style>
