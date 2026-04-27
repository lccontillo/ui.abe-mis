<template>
  <ul class="settings-list">
    <li @click="openModal('password')">
      <span>Change Password</span>
    </li>
    <li @click="openModal('email')">
      <span>Change Email</span>
    </li>
    <li @click="openModal('name')">
      <span>Change Name</span>
    </li>
  </ul>

  <!-- Change Password Modal -->
  <Transition name="modal-fade">
    <div v-if="modals.password" class="modal-overlay">
      <div class="modal-content">
        <h3>Change Password</h3>
        <form @submit.prevent="updatePassword">
          <div class="form-group">
            <label>New Password</label>
            <input type="password" v-model="passwordForm.new" required />
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" v-model="passwordForm.confirm" required />
          </div>
          <div v-if="passwordMismatch" class="error">Passwords do not match</div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">Update</button>
            <button type="button" class="btn btn-secondary" @click="closeAllModals">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>

  <!-- Change Email Modal -->
  <Transition name="modal-fade">
    <div v-if="modals.email" class="modal-overlay">
      <div class="modal-content">
        <h3>Change Email</h3>
        <form @submit.prevent="updateEmail">
          <div class="form-group">
            <label>New Email</label>
            <input type="email" v-model="emailForm.new" required />
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">Update</button>
            <button type="button" class="btn btn-secondary" @click="closeAllModals">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>

  <!-- Change Name Modal -->
  <Transition name="modal-fade">
    <div v-if="modals.name" class="modal-overlay">
      <div class="modal-content">
        <h3>Change Name</h3>
        <form @submit.prevent="updateName">
          <div class="form-group">
            <label>New Name</label>
            <input type="text" v-model="nameForm.new" required />
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">Update</button>
            <button type="button" class="btn btn-secondary" @click="closeAllModals">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useHashModal } from '@/composables/useHashModal'

const token = localStorage.getItem('token')
const modals = ref({ password: false, email: false, name: false })

const passwordForm = ref({ new: '', confirm: '' })
const emailForm = ref({ new: '' })
const nameForm = ref({ new: '' })

const passwordMismatch = ref(false)
const { openHashModal, closeHashModal } = useHashModal({
  'account-password': (isOpen) => {
    modals.value.password = isOpen
  },
  'account-email': (isOpen) => {
    modals.value.email = isOpen
  },
  'account-name': (isOpen) => {
    modals.value.name = isOpen
  },
})

function openModal(type) {
  modals.value = { password: false, email: false, name: false }
  modals.value[type] = true
  openHashModal(`account-${type}`)
}

function closeAllModals() {
  closeHashModal('account-password')
  closeHashModal('account-email')
  closeHashModal('account-name')
  modals.value = { password: false, email: false, name: false }
  passwordForm.value = { new: '', confirm: '' }
  emailForm.value = { new: '' }
  nameForm.value = { new: '' }
  passwordMismatch.value = false
}

async function updatePassword() {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    passwordMismatch.value = true
    return
  }
  passwordMismatch.value = false

  const res = await fetch('https://api-abealcala.duckdns.org/update_me', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: passwordForm.value.new }),
  })

  const result = await res.json()
  alert(result.message || 'Password updated.')
  closeAllModals()
}

async function updateEmail() {
  const res = await fetch('https://api-abealcala.duckdns.org/update_me', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: emailForm.value.new }),
  })

  const result = await res.json()
  alert(result.message || 'Email updated.')
  closeAllModals()
}

async function updateName() {
  const res = await fetch('https://api-abealcala.duckdns.org/update_me', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: nameForm.value.new }),
  })

  const result = await res.json()
  alert(result.message || 'Name updated.')
  closeAllModals()
}
</script>

<style scoped>
.section-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.settings-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--border);
}
.settings-list li {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background-color 0.2s;
}
.settings-list li:hover {
  background: var(--bg-muted);
}
.settings-list span {
  font-size: 0.95rem;
  font-weight: 700;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--heading);
  font-weight: 800;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
input {
  font-size: 0.9rem;
}
.error {
  color: var(--danger-strong);
  font-size: 0.85rem;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
}
</style>
