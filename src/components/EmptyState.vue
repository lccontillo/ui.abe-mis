<template>
  <div class="empty-state">
    <component v-if="icon" :is="icon" class="empty-icon" />
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <div class="empty-action" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: Object,
  title: { type: String, required: true },
  description: String
})
</script>

<style scoped>
.empty-icon { font-size: var(--text-2xl); color: var(--text-soft); margin-bottom: var(--space-4); }
.empty-title { font-size: var(--text-lg); color: var(--heading); margin-bottom: var(--space-2); }
.empty-description { color: var(--text-muted); margin-bottom: var(--space-4); }
</style>
