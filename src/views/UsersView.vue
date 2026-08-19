<template>
  <div class="users-page app-page">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Settings', to: '/settings' }, { label: 'Users' }]" />
    <TitleBar title="Users" />
    
    <div class="page-actions" style="margin-bottom: 10px">
      <button class="btn btn-primary" type="button" @click="openCreateModal">+ Create User</button>
    </div>

    <DataTable
      :data="users"
      :columns="columns"
      :loading="isLoading"
    >
      <template #actions="{ row }">
        <button class="btn btn-secondary btn-sm" type="button" @click="confirmToggle(row)">
          {{ row.is_active ? 'Deactivate' : 'Activate' }}
        </button>
        <button class="btn btn-secondary btn-sm" type="button" @click="openPasswordModal(row)">
          Update Password
        </button>
      </template>
    </DataTable>

    <!-- Create User Modal -->
    <Modal v-if="showCreateModal" title="Create User" @close="closeUserModal">
      <form @submit.prevent="createUser">
        <div class="form-group">
          <label>Username</label>
          <input v-model="form.username" class="field-control" required />
        </div>
        <div class="form-group">
          <label>Name</label>
          <input v-model="form.name" class="field-control" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" class="field-control" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="form.password" class="field-control" required />
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.is_admin" /> Is Admin
          </label>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" type="submit">Create</button>
          <button class="btn btn-secondary" type="button" @click="closeUserModal">Cancel</button>
        </div>
      </form>
    </Modal>

    <!-- Update Password Modal -->
    <Modal 
      v-if="showPasswordModal && selectedUser" 
      :title="`Update Password: ${selectedUser.username}`" 
      @close="closeUserModal"
    >
      <form @submit.prevent="updatePassword">
        <div class="form-group">
          <label>New Password</label>
          <input type="password" v-model="passwordForm.new" class="field-control" required />
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" v-model="passwordForm.confirm" class="field-control" required />
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" type="submit">Update</button>
          <button class="btn btn-secondary" type="button" @click="closeUserModal">Cancel</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import TitleBar from '@/components/TitleBar.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useHashModal } from '@/composables/useHashModal'

const users = ref([])
const total = ref(0)
const isLoading = ref(false)
const showCreateModal = ref(false)
const showPasswordModal = ref(false)
const selectedUser = ref(null)
const { confirm } = useConfirmDialog()

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Username', key: 'username' },
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Admin', key: 'is_admin' },
  { label: 'Active', key: 'is_active' },
]
const { openHashModal, closeHashModal } = useHashModal({
  'create-user': (isOpen) => {
    showCreateModal.value = isOpen
  },
  'update-user-password': (isOpen) => {
    showPasswordModal.value = isOpen && Boolean(selectedUser.value)
  },
})

const token = localStorage.getItem('token')

// Create User form
const form = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  is_admin: false,
})

// Password update form
const passwordForm = reactive({
  new: '',
  confirm: '',
})

async function fetchUsers() {
  isLoading.value = true
  try {
    const res = await fetch('https://api-abealcala.duckdns.org/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    users.value = await res.json()
  } catch (err) {
    console.error('Fetch error:', err)
  } finally {
    isLoading.value = false
  }
}

async function createUser() {
  try {
    const res = await fetch('https://api-abealcala.duckdns.org/create_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    if (!res.ok) throw new Error('Creation failed')

    alert('User created')
    closeUserModal()
    resetCreateForm()
    await fetchUsers()
  } catch (err) {
    alert('Create error: ' + err.message)
  }
}

function openCreateModal() {
  showCreateModal.value = true
  openHashModal('create-user')
}

function closeUserModal() {
  closeHashModal('create-user')
  closeHashModal('update-user-password')
  showCreateModal.value = false
  showPasswordModal.value = false
}

function resetCreateForm() {
  form.username = ''
  form.name = ''
  form.email = ''
  form.password = ''
  form.is_admin = false
}

async function confirmToggle(user) {
  const action = user.is_active ? 'Deactivate' : 'Activate'
  if (await confirm(`${action} User?`, `Are you sure you want to ${action} ${user.username}?`, action)) {
    toggleActivation(user)
  }
}

async function toggleActivation(user) {
  try {
    const res = await fetch(`https://api-abealcala.duckdns.org/toggle_user/${user.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error('Toggle failed')
    await fetchUsers()
  } catch (err) {
    alert('Toggle error: ' + err.message)
  }
}

function openPasswordModal(user) {
  selectedUser.value = user
  passwordForm.new = ''
  passwordForm.confirm = ''
  showPasswordModal.value = true
  openHashModal('update-user-password')
}

async function updatePassword() {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('Passwords do not match')
    return
  }

  try {
    const res = await fetch(`https://api-abealcala.duckdns.org/update_password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: selectedUser.value.id,
        new_password: passwordForm.new,
      }),
    })
    if (!res.ok) throw new Error('Password update failed')
    alert('Password updated')
    closeUserModal()
  } catch (err) {
    alert('Update error: ' + err.message)
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.users-page {
  padding: 0;
}

h2 {
  margin: 0 0 1rem;
  color: var(--heading);
  font-weight: 800;
}

.users-table {
  margin-top: 1rem;
}

td .btn + .btn {
  margin-left: 0.4rem;
}
</style>
