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
        <tr v-for="row in data" :key="row.id">
          <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
          <td v-if="$slots.actions">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
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
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', sans-serif;
  font-size: 0.9rem;
}
.data-table th,
.data-table td {
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid #eee;
}
.data-table th {
  background: #f0f4f0;
  text-align: left;
  cursor: pointer;
  user-select: none;
  color: #333;
}
.data-table tr:hover {
  background: #f9fdf9;
}
</style>
