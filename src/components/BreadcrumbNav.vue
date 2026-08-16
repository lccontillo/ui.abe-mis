<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <RouterLink v-if="item.to && index < items.length - 1" :to="item.to" class="breadcrumb-link">{{ item.label }}</RouterLink>
      <span v-else class="breadcrumb-current">{{ item.label }}</span>
      <ChevronRight20 v-if="index < items.length - 1" class="breadcrumb-separator" />
    </template>
  </nav>
</template>

<script setup>
import { ChevronRight20 } from '@carbon/icons-vue'
defineProps({
  items: { type: Array, required: true }
})
</script>

<style scoped>
.breadcrumb-link { color: var(--text-muted); text-decoration: none; }
.breadcrumb-link:hover { color: var(--brand-600); }
.breadcrumb-current { color: var(--text); font-weight: 500; }
.breadcrumb-separator { color: var(--text-soft); }
</style>
