<template>
  <div class="data-table">
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" @click="col.sortable && onSort(col.key)">
            {{ col.label }}
            <span v-if="sort.column === col.key">
              {{ sort.order === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
          <th v-if="$slots.actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.id" class="data-row" @dblclick="$emit('view', row)">
          <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
          <td v-if="$slots.actions">
            <slot name="actions" :row="row" />
          </td>
        </tr>
        <tr v-if="!data?.length">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="empty-cell">
            No records found.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineEmits(['view'])

defineProps({
  data: Array,
  columns: Array,
  sort: Object,
  onSort: Function,
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
