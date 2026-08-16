<template>
  <div class="skeleton-loader">
    <div v-if="type === 'table'" class="skeleton-table">
      <div class="skeleton skeleton-row header"></div>
      <div v-for="i in rows" :key="i" class="skeleton skeleton-row body"></div>
    </div>
    <div v-else-if="type === 'card'" class="skeleton skeleton-card"></div>
    <div v-else-if="type === 'text'" class="skeleton-text-group">
      <div v-for="i in lines" :key="i" class="skeleton skeleton-text" :style="{ width: `${80 + Math.random() * 20}%` }"></div>
    </div>
    <div v-else-if="type === 'stat'" class="skeleton-stat">
      <div class="skeleton skeleton-stat-label"></div>
      <div class="skeleton skeleton-stat-value"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, required: true },
  rows: { type: Number, default: 5 },
  lines: { type: Number, default: 3 }
})
</script>

<style scoped>
.skeleton-row { height: 40px; margin-bottom: 8px; }
.skeleton-card { height: 200px; }
.skeleton-text { height: 16px; margin-bottom: 8px; }
.skeleton-stat-label { height: 14px; width: 50%; margin-bottom: 8px; }
.skeleton-stat-value { height: 32px; width: 80%; }
</style>
