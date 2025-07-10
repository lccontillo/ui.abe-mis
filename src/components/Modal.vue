<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3 class="modal-title">{{ title }}</h3>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
})
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0006;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #1e4f24;
  font-weight: bold;
}
</style>
