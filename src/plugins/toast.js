// src/plugins/toast.js
import { reactive } from 'vue'

const toasts = reactive([])
let nextId = 1

function showToast({ message, type = 'info', timeout = 4000 }) {
  const toast = { id: nextId++, message, type }
  toasts.push(toast)

  if (timeout > 0) {
    setTimeout(() => removeToast(toast), timeout)
  }
}

function removeToast(toastOrId) {
  const index = typeof toastOrId === 'number' 
    ? toasts.findIndex(t => t.id === toastOrId)
    : toasts.indexOf(toastOrId)
  
  if (index !== -1) toasts.splice(index, 1)
}

export default {
  install(app) {
    app.config.globalProperties.$toast = showToast
  },
  toasts,
  showToast,
  removeToast,
}
