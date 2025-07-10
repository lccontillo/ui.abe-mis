<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo + Project Name -->
      <div class="logo">
        <!-- Replace with actual <img> or <svg> -->
        <!-- <svg width="48" height="48" viewBox="0 0 24 24" fill="green">
          <circle cx="12" cy="12" r="10" />
        </svg> -->
        <img src="@/assets/logo.svg" alt="ABE Logo" width="75" height="75" />
        <h1>ABE Alcala MIS</h1>
        <p class="subtitle">
          Management Information System for Agricultural and Biosystems Engineers in Alcala
        </p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <UserNameField v-model="username" />
        <PasswordField v-model="password" />

        <button class="login-button" :disabled="loading" type="submit">
          <template v-if="loading">
            Signing In...
            <!-- <DonutLoader color="white" size="1.5rem" :multi="false" /> -->
          </template>
          <template v-else>Login</template>
        </button>

        <div class="forgot" @click="showForgotToast">Forgot Password?</div>

        <div v-if="error" class="error-msg">{{ error }}</div>
      </form>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import UserNameField from '@/components/UserNameField.vue'
import PasswordField from '@/components/PasswordField.vue'
import Toast from '@/components/Toast.vue'
import DonutLoader from '@/components/DonutLoader.vue'
const { proxy } = getCurrentInstance()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()

async function login() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('https://api-ai-portraits.duckdns.org/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    if (!res.ok) throw new Error('Invalid username or password')
    const data = await res.json()
    localStorage.setItem('token', data.token)
    router.push('/')
  } catch (err) {
    proxy.$toast({ message: err.message, type: 'error' })
  } finally {
    loading.value = false
  }
}

function showForgotToast() {
  proxy.$toast({
    type: 'info',
    message: 'Please contact the system administrator to reset your password.',
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f4f1;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo {
  text-align: center;
  margin-bottom: 1rem;
}

.logo h1 {
  margin: 0.5rem 0 0.25rem;
  font-size: 1.5rem;
  color: #2e7d32;
  font-weight: bold;
}

.subtitle {
  font-size: 0.875rem;
  color: #555;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-button {
  background-color: #2e7d32;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.forgot {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #1b5e20;
  text-align: right;
  cursor: pointer;
}

.error-msg {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
