<template>
  <div>
    <h2>Users</h2>
    <button @click="showCreateModal = true">+ Create User</button>

    <table border="1" cellpadding="6" cellspacing="0" style="margin-top: 1rem">
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
            <button @click="confirmToggle(user)">Toggle Active</button>
            <button @click="openPasswordModal(user)">Update Password</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create User Modal -->
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
          <div style="margin-top: 1rem">
            <button type="submit">Create</button>
            <button type="button" @click="showCreateModal = false" style="margin-left: 1rem">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Update Password Modal -->
    <div v-if="showPasswordModal" class="modal">
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
          <div style="margin-top: 1rem">
            <button type="submit">Update</button>
            <button type="button" @click="showPasswordModal = false" style="margin-left: 1rem">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const users = ref([])
const showCreateModal = ref(false)
const showPasswordModal = ref(false)
const selectedUser = ref(null)

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
    const res = await fetch('https://api-ai-portraits.duckdns.org/users', {
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
    const res = await fetch('https://api-ai-portraits.duckdns.org/create_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    if (!res.ok) throw new Error('Creation failed')

    alert('User created')
    showCreateModal.value = false
    resetCreateForm()
    await fetchUsers()
  } catch (err) {
    alert('Create error: ' + err.message)
  }
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
    const res = await fetch(`https://api-ai-portraits.duckdns.org/toggle_user/${user.id}`, {
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
}

async function updatePassword() {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('Passwords do not match')
    return
  }

  try {
    const res = await fetch(`https://api-ai-portraits.duckdns.org/update_password`, {
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
    showPasswordModal.value = false
  } catch (err) {
    alert('Update error: ' + err.message)
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 2rem;
  width: 350px;
  border-radius: 4px;
}
</style>
