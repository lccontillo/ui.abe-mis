<template>
  <div class="title-bar">
    <div class="title-main">
      <component :is="icon" v-if="icon" class="title-icon" />
      <h1 class="title-text">{{ title }}</h1>
    </div>
    <div v-if="$slots.actions" class="title-actions">
      <slot name="actions" />
    </div>
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.title-main,
.title-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  color: var(--brand-600);
  width: 24px;
  height: 24px;
}

.title-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--heading);
  margin: 0;
}
</style>
