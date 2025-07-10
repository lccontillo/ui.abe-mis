<template>
  <div class="title-bar">
    <h1 class="title-text">{{ title }}</h1>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  icon: Object, // e.g., Home20
})
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.title-icon {
  color: #2e7d32;
  width: 24px;
  height: 24px;
}

.title-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2e7d32;
  font-family: 'Segoe UI', sans-serif;
}
</style>
