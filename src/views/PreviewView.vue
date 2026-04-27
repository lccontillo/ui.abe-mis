<template>
  <div class="preview-page app-page">
    <button class="btn btn-primary" type="button" @click="openPreviewModal">Preview Form</button>

    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Dynamic Form</h3>
          <form @submit.prevent="submitForm">
            <div v-for="(field, idx) in schema" :key="idx" class="field-block">
              <component
                :is="getFieldComponent(field)"
                :field="field"
                v-model="formData[camel(field.field_label)]"
              />
            </div>
            <div class="modal-actions">
              <button class="btn btn-primary" type="submit">Submit</button>
              <button class="btn btn-secondary" type="button" @click="closePreviewModal">
                Close
              </button>
            </div>
          </form>
        </div>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import InputField from '@/components/InputField.vue'
import DateField from '@/components/DateField.vue'
import DropdownField from '@/components/DropdownField.vue'
import RadioField from '@/components/RadioField.vue'
import CheckboxField from '@/components/CheckboxField.vue'
import TableField from '@/components/TableField.vue'
import { useHashModal } from '@/composables/useHashModal'

const showModal = ref(false)
const { openHashModal, closeHashModal } = useHashModal({
  'preview-form': (isOpen) => {
    showModal.value = isOpen
  },
})

function openPreviewModal() {
  showModal.value = true
  openHashModal('preview-form')
}

function closePreviewModal() {
  closeHashModal('preview-form')
}

const camel = (str) =>
  str
    .replace(/[^a-zA-Z0-9 ]/g, '') // remove special characters
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

const schema = [
  {
    field_type: 'text',
    field_label: 'Name',
    properties: { hidden: false, disabled: false, required: true },
  },
  {
    field_type: 'date',
    field_label: 'Date of Certification',
    properties: { hidden: false, disabled: false, required: true },
  },
  {
    field_type: 'dropdown',
    field_label: 'Commodity',
    properties: {
      hidden: false,
      disabled: false,
      required: true,
      options: ['Rice', 'Corn', 'Peanuts'],
      multiple: false,
    },
  },
  {
    field_type: 'radio',
    field_label: 'Gender',
    properties: {
      hidden: false,
      disabled: false,
      required: true,
      options: ['Male', 'Female'],
    },
  },
  {
    field_type: 'table',
    field_label: 'People',
    properties: {
      hidden: false,
      disabled: false,
      min_rows: 1,
      columns: [
        {
          field_type: 'text',
          field_label: 'Name',
          properties: { hidden: false, disabled: false, required: true },
        },
        {
          field_type: 'number',
          field_label: 'Since',
          properties: { hidden: false, disabled: false, required: true },
        },
        {
          field_type: 'dropdown',
          field_label: 'Role',
          properties: {
            required: false,
            disabled: false,
            hidden: false,
            options: ['Leader', 'Member'],
            multiple: false,
          },
        },
      ],
    },
  },
]

const formData = reactive({})

schema.forEach((field) => {
  const key = camel(field.field_label)
  if (field.field_type === 'date') {
    formData[key] = { month: '', day: '', year: '' }
  } else if (['checkbox', 'dropdown'].includes(field.field_type) && field.properties.multiple) {
    formData[key] = []
  } else if (field.field_type === 'table') {
    const minRows = field.properties.min_rows || 0
    const defaultRow = () =>
      Object.fromEntries(
        field.properties.columns.map((col) => [
          camel(col.field_label),
          ['checkbox', 'dropdown'].includes(col.field_type) && col.properties.multiple ? [] : '',
        ]),
      )
    formData[key] = Array.from({ length: minRows }, defaultRow)
  } else {
    formData[key] = ''
  }
})

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
    case 'checkbox':
      return CheckboxField
    case 'radio':
      return RadioField
    case 'table':
      return TableField
    default:
      return 'div'
  }
}

function submitForm() {
  console.log(JSON.stringify(formData, null, 2))
}
</script>

<style scoped>
.field-block {
  margin-bottom: 16px;
}
</style>
