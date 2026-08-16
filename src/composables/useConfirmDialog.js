import { reactive } from 'vue'

const confirmState = reactive({
  isOpen: false,
  title: '',
  message: '',
  dangerLabel: 'Confirm',
  resolvePromise: null
})

export function useConfirmDialog() {
  const confirm = (title, message, dangerLabel = 'Confirm') => {
    confirmState.title = title
    confirmState.message = message
    confirmState.dangerLabel = dangerLabel
    confirmState.isOpen = true

    return new Promise((resolve) => {
      confirmState.resolvePromise = resolve
    })
  }

  const proceed = () => {
    confirmState.resolvePromise(true)
    confirmState.isOpen = false
  }

  const cancel = () => {
    confirmState.resolvePromise(false)
    confirmState.isOpen = false
  }

  return { confirmState, confirm, proceed, cancel }
}
