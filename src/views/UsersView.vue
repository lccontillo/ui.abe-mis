<template>
  <div class="users-page app-page">
    <h2>Users</h2>
    <button class="btn btn-primary" type="button" @click="openCreateModal">+ Create User</button>

    <div class="table-wrap users-table">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.name ?? '-' }}</td>
            <td>{{ user.email ?? '-' }}</td>
            <td>{{ user.is_admin ? 'Yes' : 'No' }}</td>
            <td>{{ user.is_active ? 'Yes' : 'No' }}</td>
            <td>
              <button class="btn btn-secondary" type="button" @click="confirmToggle(user)">
                Toggle Active
              </button>
              <button class="btn btn-secondary" type="button" @click="openPasswordModal(user)">
                Update Password
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create User Modal -->
    <Transition name="modal-fade">
      <div v-if="showCreateModal" class="modal">
        <div class="modal-content">
          <h3>Create User</h3>
          <form @submit.prevent="createUser">
            <div><label>Username:</label><input v-model="form.username" required /></div>
            <div><label>Name:</label><input v-model="form.name" /></div>
            <div><label>Email:</label><input v-model="form.email" /></div>
            <div>
              <label>Password:</label><input type="password" v-model="form.password" required />
            </div>
            <div>
              <label><input type="checkbox" v-model="form.is_admin" /> Is Admin</label>
            </div>
            <div class="modal-actions">
              <button class="btn btn-primary" type="submit">Create</button>
              <button class="btn btn-secondary" type="button" @click="closeUserModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Update Password Modal -->
    <Transition name="modal-fade">
      <div v-if="showPasswordModal && selectedUser" class="modal">
        <div class="modal-content">
          <h3>Update Password: {{ selectedUser.username }}</h3>
          <form @submit.prevent="updatePassword">
            <div>
              <label>New Password:</label
              ><input type="password" v-model="passwordForm.new" required />
            </div>
            <div>
              <label>Confirm Password:</label
              ><input type="password" v-model="passwordForm.confirm" required />
            </div>
            <div class="modal-actions">
              <button class="btn btn-primary" type="submit">Update</button>
              <button class="btn btn-secondary" type="button" @click="closeUserModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useHashModal } from '@/composables/useHashModal'

const users = ref([])
const showCreateModal = ref(false)
const showPasswordModal = ref(false)
const selectedUser = ref(null)
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
  try {
    const res = await fetch('https://api-abealcala.duckdns.org/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    users.value = await res.json()
  } catch (err) {
    console.error('Fetch error:', err)
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

function confirmToggle(user) {
  const action = user.is_active ? 'Deactivate' : 'Activate'
  if (confirm(`Are you sure you want to ${action} ${user.username}?`)) {
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
