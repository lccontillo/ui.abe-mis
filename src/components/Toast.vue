<template>
  <div class="toast-container bottom-center">
    <TransitionGroup name="toast-slide">
      <div v-for="toast in toasts" :key="toast.id" class="toast">
        <div class="toast-icon">
          <component :is="icons[toast.type]" :style="{ color: iconColors[toast.type] }" />
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-dismiss" @click="remove(toast)">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import ToastPlugin from '@/plugins/toast.js'
import {
  CheckmarkFilled20,
  ErrorFilled20,
  WarningFilled20,
  InformationFilled20,
} from '@carbon/icons-vue'

const toasts = ToastPlugin.toasts
const remove = ToastPlugin.removeToast

// Map status types to icons
const icons = {
  success: CheckmarkFilled20,
  error: ErrorFilled20,
  warning: WarningFilled20,
  info: InformationFilled20,
}

// Map icon color (not background) to match theme
const iconColors = {
  success: '#43a047', // green
  error: '#d32f2f', // red
  warning: '#f9a825', // yellow
  info: '#1e88e5', // blue
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toast {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 280px;
  box-shadow: var(--shadow-md);
}

.toast-icon {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
}

.toast-message {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.3;
}

.toast-dismiss {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-muted);
  cursor: pointer;
}

.toast-slide-enter-active, .toast-slide-leave-active { transition: all var(--duration-normal) var(--ease-out); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px); }
</style>
