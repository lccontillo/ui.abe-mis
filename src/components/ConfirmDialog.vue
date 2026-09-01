<template>
  <Modal
    v-if="confirmState.isOpen"
    :title="confirmState.title"
    size="sm"
    persistent
    class="confirm-dialog-overlay"
    @close="cancel"
  >
    <p style="font-size: 0.92rem; line-height: 1.5; color: var(--text);">{{ confirmState.message }}</p>
    <div style="margin-top: var(--space-4, 1.25rem); display: flex; justify-content: flex-end; gap: var(--space-2, 0.5rem);">
      <button class="btn btn-secondary" @click="cancel">Cancel</button>
      <button class="btn btn-primary" style="background-color: var(--danger-strong, #dc2626); border-color: var(--danger-strong, #dc2626);" @click="proceed">
        {{ confirmState.dangerLabel }}
      </button>
    </div>
  </Modal>
</template>

<script setup>
import Modal from './Modal.vue'
import { useConfirmDialog } from '../composables/useConfirmDialog'
const { confirmState, proceed, cancel } = useConfirmDialog()
</script>

<style scoped>
:deep(.modal-overlay.confirm-dialog-overlay),
.confirm-dialog-overlay {
  z-index: 99999 !important;
  background: rgba(0, 0, 0, 0.68) !important;
  backdrop-filter: blur(6px) !important;
}
</style>
