<template>
  <div class="login-container">
    <div class="login-shell">
      <section class="login-brand" aria-label="Application information">
        <img src="@/assets/logo.svg" alt="ABE Logo" width="128" height="128" />
        <h1>ABE Alcala MIS</h1>
        <p>
          Management tools for agricultural and biosystems engineering records, documents, and
          activity tracking.
        </p>
      </section>

      <div class="login-card panel">
        <div class="login-heading">
          <h2>Sign in</h2>
          <p>Use your assigned account credentials.</p>
        </div>

        <form @submit.prevent="login" class="login-form">
          <UserNameField v-model="username" />
          <PasswordField v-model="password" />

          <button class="btn btn-primary login-button" :disabled="loading" type="submit">
            <span>{{ loading ? 'Signing in...' : 'Login' }}</span>
          </button>

          <button class="forgot" type="button" @click="showForgotToast">Forgot Password?</button>

          <div v-if="error" class="error-msg" role="alert">{{ error }}</div>
        </form>
      </div>
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
import { useUserStore } from '@/stores/user'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()

async function login() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('https://api-abealcala.duckdns.org/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    if (!res.ok) throw new Error('Invalid username or password')

    const data = await res.json()
    localStorage.setItem('token', data.token)

    // ✅ Call Pinia store to fetch user info
    const userStore = useUserStore()
    await userStore.fetchMe()

    router.push('/')
  } catch (err) {
    error.value = err.message
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
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(
      circle at 20% 20%,
      color-mix(in srgb, var(--brand-100) 58%, transparent),
      transparent 32%
    ),
    linear-gradient(135deg, var(--bg), var(--bg-muted));
}

.login-shell {
  width: min(100%, 980px);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  gap: 24px;
  align-items: stretch;
}

.login-brand {
  min-height: 520px;
  padding: 42px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: var(--radius-lg);
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--brand-700) 88%, #000 12%), var(--brand-600)),
    var(--brand-600);
  color: #ffffff;
  box-shadow: var(--shadow-lg);
}

.login-brand img {
  width: 128px;
  height: 128px;
  margin-bottom: auto;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
}

.login-brand h1 {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 5vw, 3.6rem);
  line-height: 1;
  font-weight: 850;
  letter-spacing: 0;
}

.login-brand p {
  max-width: 34rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 1rem;
}

.login-card {
  align-self: center;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
}

.login-heading {
  margin-bottom: 1.25rem;
}

.login-heading h2 {
  margin: 0;
  color: var(--heading);
  font-size: 1.6rem;
  font-weight: 850;
}

.login-heading p {
  margin: 0.25rem 0 0;
  color: var(--text-muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-button {
  width: 100%;
}

.login-button:disabled {
  cursor: wait;
}

.forgot {
  align-self: flex-end;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 0.875rem;
  color: var(--brand-700);
  text-align: right;
  cursor: pointer;
  font-weight: 700;
}

.error-msg {
  color: var(--danger-strong);
  font-size: 0.875rem;
  font-weight: 700;
}

.login-form :deep(input:not([type='checkbox']):not([type='radio'])),
.login-form :deep(.password-wrapper) {
  min-height: 44px;
  border: 1px solid color-mix(in srgb, var(--brand-600) 42%, var(--border));
  background: color-mix(in srgb, var(--bg-elevated) 88%, var(--bg-muted));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.login-form :deep(input:not([type='checkbox']):not([type='radio']):focus) {
  outline: none;
}

.login-form :deep(.password-wrapper:focus-within),
.login-form :deep(input:not([type='checkbox']):not([type='radio']):focus-visible) {
  border-color: var(--brand-600);
  box-shadow: 0 0 0 3px var(--focus);
  outline: none;
}

.login-form :deep(.password-wrapper input) {
  border: 0;
  background: transparent;
  box-shadow: none;
}

@media (max-width: 780px) {
  .login-container {
    padding: 16px;
    align-items: start;
  }

  .login-shell {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .login-brand {
    min-height: auto;
    padding: 24px;
  }

  .login-brand img {
    width: 88px;
    height: 88px;
    margin-bottom: 2rem;
  }

  .login-card {
    padding: 1.25rem;
  }
}
</style>
