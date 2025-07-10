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
          <button type="submit" class="btn-primary">Update</button>
          <button type="button" class="btn-secondary" @click="closeAllModals">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Change Email Modal -->
    <div v-if="modals.email" class="modal-overlay">
      <div class="modal-content">
        <h3>Change Email</h3>
        <form @submit.prevent="updateEmail">
          <div class="form-group">
            <label>New Email</label>
            <input type="email" v-model="emailForm.new" required />
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Update</button>
            <button type="button" class="btn-secondary" @click="closeAllModals">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Change Name Modal -->
    <div v-if="modals.name" class="modal-overlay">
      <div class="modal-content">
        <h3>Change Name</h3>
        <form @submit.prevent="updateName">
          <div class="form-group">
            <label>New Name</label>
            <input type="text" v-model="nameForm.new" required />
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Update</button>
            <button type="button" class="btn-secondary" @click="closeAllModals">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const token = localStorage.getItem('token')
const modals = ref({ password: false, email: false, name: false })

const passwordForm = ref({ new: '', confirm: '' })
const emailForm = ref({ new: '' })
const nameForm = ref({ new: '' })

const passwordMismatch = ref(false)

function openModal(type) {
  closeAllModals()
  modals.value[type] = true
}

function closeAllModals() {
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

  const res = await fetch('http://localhost:3000/update_me', {
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
  const res = await fetch('http://localhost:3000/update_me', {
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
  const res = await fetch('http://localhost:3000/update_me', {
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
.account-settings {
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  margin: auto;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.settings-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #eee;
}
.settings-list li {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
}
.settings-list li:hover {
  background: #f6f6f6;
}
.settings-list span {
  font-size: 0.95rem;
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  width: 90%;
  max-width: 480px;
  border-radius: 10px;
  box-shadow: 0 2px 16px #0003;
}
h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
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
  width: 100%;
  padding: 0.6rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.btn-primary {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:hover {
  background: #256128;
}
.btn-secondary {
  background: #eee;
  color: #333;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-secondary:hover {
  background: #ddd;
}
.error {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
}
</style>
