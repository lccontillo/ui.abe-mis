import toastPlugin from '@/plugins/toast'

export function useToast() {
  return {
    toast: (message, type = 'info', timeout = 4000) => {
      toastPlugin.showToast({ message, type, timeout })
    },
    success: (message, timeout = 4000) => {
      toastPlugin.showToast({ message, type: 'success', timeout })
    },
    error: (message, timeout = 5000) => {
      toastPlugin.showToast({ message, type: 'error', timeout })
    },
    warning: (message, timeout = 5000) => {
      toastPlugin.showToast({ message, type: 'warning', timeout })
    },
    info: (message, timeout = 4000) => {
      toastPlugin.showToast({ message, type: 'info', timeout })
    }
  }
}
