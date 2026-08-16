import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PreviewView from '../views/PreviewView.vue'
import FcaForm from '@/views/FcaForm.vue'
import LoginView from '@/views/LoginView.vue'
import UsersView from '@/views/UsersView.vue'
import FcaView from '@/views/FcaView.vue'
import DocumentSettings from '@/views/DocumentSettings.vue'
import DocumentSchema from '@/views/DocumentSchema.vue'
import AuditLogView from '@/views/AuditLogView.vue'
import DocumentGenerator from '@/views/DocumentGenerator.vue'
import DocumentView from '@/views/DocumentView.vue'
import FcaDataView from '@/views/FcaDataView.vue'
import Dashboard from '@/views/Dashboard.vue'
import SettingsView from '@/views/SettingsView.vue'
import AccountSettings from '@/views/AccountSettings.vue'
import NetworkPlanView from '@/views/NetworkPlanView.vue'
// GISToolsView is deprecated in favor of NetworkPlanView
// import GISToolsView from '@/views/GISToolsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: Dashboard,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreviewView,
    },
    {
      path: '/fcas',
      name: 'fcas',
      component: FcaView,
    },
    {
      path: '/fca/:id',
      name: 'fca-data',
      component: FcaDataView,
    },
    {
      path: '/fca',
      name: 'fca',
      component: FcaForm,
    },
    {
      path: '/documents',
      name: 'documents',
      component: DocumentView,
    },
    {
      path: '/settings/document',
      name: 'document-settings',
      component: DocumentSettings,
    },
    {
      path: '/settings/document/:id',
      name: 'document-schema',
      component: DocumentSchema,
    },
    {
      path: '/fmr-network-plan',
      name: 'fmr-network-plan',
      component: NetworkPlanView,
    },
    {
      path: '/settings',
      component: SettingsView,
      children: [
        {
          path: '',
          name: 'AccountSettings',
          component: AccountSettings,
        },
        {
          path: 'templates',
          name: 'TemplatesSettings',
          component: DocumentSettings,
        },
        {
          path: 'users',
          name: 'UsersSettings',
          component: UsersView,
        },
        {
          path: 'logs',
          name: 'LogsSettings',
          component: AuditLogView,
        },
      ],
    },
    {
      path: '/generate',
      name: 'generate',
      component: DocumentGenerator,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// Route guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.name === 'login' && token) {
    // If logged in and trying to access login, redirect to home
    next({ name: 'home' })
  } else if (to.name === 'home' && !token) {
    // If not logged in and trying to access home, redirect to login
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
