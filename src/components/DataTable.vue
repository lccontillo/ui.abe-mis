<template>
  <div class="data-table">
    <SkeletonLoader v-if="loading" type="table" />
    <EmptyState v-else-if="!data?.length" :icon="emptyIcon" :title="emptyTitle" :description="emptyDescription" />
    <table v-else>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" @click="col.sortable && onSort(col.key)">
            {{ col.label }}
            <span v-if="sort.column === col.key">
              {{ sort.order === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
          <th v-if="$slots.actions" class="actions-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.id" class="data-row" @dblclick="$emit('view', row)">
          <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
          <td v-if="$slots.actions" class="actions-cell">
            <div class="actions-group">
              <slot name="actions" :row="row" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import SkeletonLoader from './SkeletonLoader.vue'
import EmptyState from './EmptyState.vue'

defineEmits(['view'])

defineProps({
  data: Array,
  columns: Array,
  sort: Object,
  onSort: Function,
  loading: Boolean,
  emptyIcon: Object,
  emptyTitle: { type: String, default: 'No records found' },
  emptyDescription: String
})
</script>

<style scoped>
.data-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table th[sortable],
.data-table th {
  cursor: pointer;
  user-select: none;
}

.actions-header,
.actions-cell {
  width: 1%;
  white-space: nowrap;
  text-align: center;
}

.actions-group {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  white-space: nowrap;
}

.empty-cell {
  color: var(--text-muted);
  text-align: center;
}

.data-row {
  cursor: default;
}

.data-row:hover {
  cursor: pointer;
}
</style>
