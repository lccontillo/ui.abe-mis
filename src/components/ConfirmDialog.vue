<template>
  <Modal v-if="confirmState.isOpen" :title="confirmState.title" size="sm" persistent @close="cancel">
    <p>{{ confirmState.message }}</p>
    <div style="margin-top: var(--space-4); display: flex; justify-content: flex-end; gap: var(--space-2);">
      <button class="btn btn-secondary" @click="cancel">Cancel</button>
      <button class="btn btn-primary" style="background-color: var(--danger-strong)" @click="proceed">
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
