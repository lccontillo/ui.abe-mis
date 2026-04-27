<template>
  <Transition name="modal-fade" appear>
    <div class="modal-overlay" @click.self="$emit('close')">
      <section class="modal-content" role="dialog" aria-modal="true" :aria-label="title">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button
            class="icon-btn modal-close"
            type="button"
            aria-label="Close"
            @click="$emit('close')"
          >
            x
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
})
defineEmits(['close'])
</script>

<style scoped>
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  margin: 0;
  color: var(--heading);
  font-weight: 800;
}

.modal-close {
  flex: 0 0 auto;
}
</style>
