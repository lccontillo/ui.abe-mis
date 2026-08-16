<template>
  <div class="pagination">
    <div class="per-page">
      <select :value="perPage" @change="$emit('per-page-change', Number($event.target.value))" class="field-control">
        <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }} per page</option>
      </select>
    </div>
    <div class="page-controls">
      <button class="btn btn-secondary" :disabled="currentPage === 1" @click="$emit('page-change', currentPage - 1)">Prev</button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="btn btn-secondary" :disabled="currentPage >= totalPages" @click="$emit('page-change', currentPage + 1)">Next</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  perPage: { type: Number, default: 10 },
  perPageOptions: { type: Array, default: () => [10, 20, 50] }
})
defineEmits(['page-change', 'per-page-change'])
</script>

<style scoped>
.pagination { display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) 0; }
.page-controls { display: flex; align-items: center; gap: var(--space-4); }
.page-info { color: var(--text-muted); font-size: var(--text-sm); }
</style>
