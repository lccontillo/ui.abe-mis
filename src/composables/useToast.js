import { inject } from 'vue'

export function useToast() {
  const showToast = inject('showToast')
  return { showToast }
}
