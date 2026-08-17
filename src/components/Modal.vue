<template>
  <Transition name="modal-fade" appear>
    <div :class="['modal-overlay', { 'has-full-height': fullHeight }]" @click.self="!persistent && $emit('close')">
      <section :class="['modal-content', `modal-${size}`, { 'modal-full-height': fullHeight }]" role="dialog" aria-modal="true" :aria-label="title">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button
            class="icon-btn modal-close"
            type="button"
            aria-label="Close"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>
        <slot />
      </section>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  title: String,
  size: { type: String, default: 'md' },
  persistent: { type: Boolean, default: false },
  fullHeight: { type: Boolean, default: false },
})
defineEmits(['close'])
</script>

<style scoped>
.has-full-height {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  align-items: stretch;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 1.25rem;
  margin: 0;
  color: var(--heading);
  font-weight: 800;
}

.modal-close {
  flex: 0 0 auto;
  font-size: 1.1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close:hover {
  background: var(--bg-muted);
  color: var(--text);
}

.modal-sm { max-width: 420px; }
.modal-md { max-width: 580px; }
.modal-lg { max-width: 860px; }
.modal-xl { max-width: 1140px; }
.modal-full { max-width: 95vw; }

.modal-full-height {
  height: 100vh !important;
  height: 100dvh !important;
  max-height: 100vh !important;
  max-height: 100dvh !important;
  border-radius: 0 !important;
}
</style>
