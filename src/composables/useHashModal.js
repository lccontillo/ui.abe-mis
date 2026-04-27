import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

function normalizeHash(hash) {
  if (!hash) return ''
  return hash.startsWith('#') ? hash : `#${hash}`
}

export function useHashModal(handlers = {}) {
  const route = useRoute()
  const router = useRouter()

  function openHashModal(hash) {
    router.push({
      path: route.path,
      query: route.query,
      hash: normalizeHash(hash),
    })
  }

  function closeHashModal(hash) {
    const targetHash = normalizeHash(hash)
    if (!targetHash || route.hash === targetHash) {
      router.replace({
        path: route.path,
        query: route.query,
        hash: '',
      })
    }
  }

  watch(
    () => route.hash,
    (activeHash) => {
      Object.entries(handlers).forEach(([hash, handler]) => {
        handler(activeHash === normalizeHash(hash))
      })
    },
    { immediate: true },
  )

  return {
    openHashModal,
    closeHashModal,
  }
}
