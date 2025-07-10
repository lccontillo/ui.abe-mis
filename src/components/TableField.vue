<template>
  <div>
    <label>{{ field.field_label }}</label>
    <table border="1" cellpadding="4">
      <thead>
        <tr>
          <th v-for="col in field.properties.columns" :key="col.field_label">
            {{ col.field_label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in modelValue" :key="rowIndex">
          <td v-for="col in field.properties.columns" :key="col.field_label">
            <component
              :is="getFieldComponent(col)"
              :field="col"
              v-model="row[camel(col.field_label)]"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="addRow">+ Add Row</button>
  </div>
</template>

<script setup>
import InputField from './InputField.vue'
import DateField from './DateField.vue'
import DropdownField from './DropdownField.vue'
import RadioField from './RadioField.vue'
import CheckboxField from './CheckboxField.vue'

const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const camel = (str) =>
  str
    .replace(/[^a-zA-Z0-9 ]/g, '') // remove special characters
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

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
  emit('update:modelValue', [...props.modelValue, newRow])
}
</script>
