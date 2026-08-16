<template>
  <div class="table-field-container">
    <label class="field-label" v-if="field.field_label">{{ field.field_label }}</label>
    <div class="table-wrap">
      <table class="compact-table">
        <thead>
          <tr>
            <th v-for="col in field.properties.columns" :key="col.field_label">
              {{ col.field_label }}
            </th>
            <th class="action-th" v-if="canRemoveRows"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in modelValue" :key="rowIndex">
            <td v-for="col in field.properties.columns" :key="col.field_label">
              <!-- Text / Number / Money -->
              <input
                v-if="['text', 'number', 'money'].includes(col.field_type)"
                :type="col.field_type === 'number' ? 'number' : 'text'"
                :disabled="col.properties?.disabled"
                :required="col.properties?.required"
                v-model="row[camel(col.field_label)]"
                class="compact-input"
                :placeholder="col.field_label"
              />

              <!-- Date -->
              <input
                v-else-if="col.field_type === 'date'"
                type="date"
                :value="formatDateForInput(row[camel(col.field_label)])"
                @input="onDateInput($event, row, camel(col.field_label))"
                class="compact-input"
              />

              <!-- Dropdown -->
              <select
                v-else-if="col.field_type === 'dropdown' && !col.properties?.multiple"
                v-model="row[camel(col.field_label)]"
                class="compact-select"
              >
                <option value="" disabled selected>Select...</option>
                <option v-for="opt in col.properties?.options || []" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>

              <!-- Fallback to component if complex -->
              <component
                v-else
                :is="getFieldComponent(col)"
                :field="col"
                v-model="row[camel(col.field_label)]"
                class="compact-nested-field"
              />
            </td>
            <td class="action-td" v-if="canRemoveRows">
              <button
                type="button"
                class="btn-row-remove"
                title="Remove Row"
                @click="removeRow(rowIndex)"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-actions">
      <button class="btn btn-secondary btn-sm" type="button" @click="addRow">+ Add Row</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import InputField from './InputField.vue'
import DateField from './DateField.vue'
import DropdownField from './DropdownField.vue'
import RadioField from './RadioField.vue'
import CheckboxField from './CheckboxField.vue'

const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const canRemoveRows = computed(() => {
  const minRows = props.field?.properties?.min_rows || 0
  return (props.modelValue?.length || 0) > minRows
})

const camel = (str) =>
  str
    .replace(/[^a-zA-Z0-9 ]/g, '') // remove special characters
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

function getCardinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const formatDateForInput = (val) => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (val.year && val.month && val.day) {
    return `${val.year}-${String(val.month).padStart(2, '0')}-${String(val.day).padStart(2, '0')}`
  }
  return ''
}

const onDateInput = (e, row, key) => {
  const date = new Date(e.target.value)
  if (isNaN(date)) {
    row[key] = ''
    return
  }
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const full = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const short = date.toLocaleDateString('en-US')
  const month_word = date.toLocaleDateString('en-US', { month: 'long' })
  const cardinal_day = getCardinal(day)
  row[key] = { month, day, year, full, short, cardinal_day, month_word }
}

function getFieldComponent(field) {
  switch (field.field_type) {
    case 'text':
    case 'number':
    case 'money':
      return InputField
    case 'date':
      return DateField
    case 'dropdown':
      return DropdownField
    case 'radio':
      return RadioField
    case 'checkbox':
      return CheckboxField
    default:
      return 'div'
  }
}

function addRow() {
  const newRow = Object.fromEntries(
    props.field.properties.columns.map((col) => [
      camel(col.field_label),
      ['checkbox', 'dropdown'].includes(col.field_type) && col.properties.multiple ? [] : '',
    ]),
  )
  emit('update:modelValue', [...(props.modelValue || []), newRow])
}

function removeRow(index) {
  const minRows = props.field?.properties?.min_rows || 0
  if ((props.modelValue?.length || 0) <= minRows) return
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}
</script>

<style scoped>
.table-field-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 1.25rem;
}

.field-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--heading);
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
}

.compact-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.compact-table th {
  padding: 0.5rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--bg-muted);
  color: var(--heading);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  text-align: left;
}

.compact-table td {
  padding: 0.35rem 0.5rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.compact-table tbody tr:hover {
  background: var(--bg-subtle);
}

.compact-input,
.compact-select {
  width: 100%;
  min-height: 32px;
  padding: 0.3rem 0.5rem;
  font-size: 0.85rem;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  box-sizing: border-box;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.compact-input:focus,
.compact-select:focus {
  outline: none;
  border-color: var(--brand-600);
  box-shadow: 0 0 0 2px var(--focus);
}

.action-th,
.action-td {
  width: 38px;
  text-align: center;
  padding: 0.25rem;
}

.btn-row-remove {
  background: transparent;
  border: none;
  color: var(--text-soft);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.25rem 0.45rem;
  border-radius: 4px;
  line-height: 1;
  transition: color 150ms, background 150ms;
}

.btn-row-remove:hover {
  color: var(--danger-strong);
  background: rgba(220, 38, 38, 0.12);
}

.table-actions {
  margin-top: 0.35rem;
}

.btn-sm {
  min-height: 32px;
  padding: 0.3rem 0.75rem;
  font-size: 0.825rem;
}

:deep(.compact-nested-field .field-label) {
  display: none !important;
}

:deep(.compact-nested-field) {
  margin-bottom: 0 !important;
  gap: 0 !important;
}
</style>
