<template>
  <div class="container app-page">
    <h2>Dynamic Schema Builder</h2>
    <!-- {{ documentData }} -->
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="(field, index) in fields" :key="index" class="field-config panel">
        <div>
          <label>Field Type:</label>
          <select v-model="field.field_type">
            <option v-for="type in fieldTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <div>
          <label>Field Label:</label>
          <input v-model="field.field_label" placeholder="Label" />
        </div>

        <!-- Basic Properties -->
        <div>
          <label><input type="checkbox" v-model="field.properties.required" /> Required</label>
          <label><input type="checkbox" v-model="field.properties.disabled" /> Disabled</label>
          <label><input type="checkbox" v-model="field.properties.hidden" /> Hidden</label>
        </div>

        <!-- Dropdown/Radio/Checkbox Options -->
        <div v-if="['dropdown', 'radio', 'checkbox'].includes(field.field_type)">
          <label><input type="checkbox" v-model="field.properties.multiple" /> Multiple</label>
          <div>
            <label>Options:</label>
            <div v-for="(opt, i) in field.properties.options" :key="i">
              <input v-model="field.properties.options[i]" />
              <button @click="field.properties.options.splice(i, 1)">x</button>
            </div>
            <button @click="field.properties.options.push('')">+ Add Option</button>
          </div>
        </div>

        <!-- Table Column Definition -->
        <div v-if="field.field_type === 'table'">
          <label>Min Rows:</label>
          <input type="number" v-model.number="field.properties.min_rows" min="0" />

          <h4>Table Columns</h4>
          <div v-for="(col, cIdx) in field.properties.columns" :key="cIdx" class="table-col">
            <select v-model="col.field_type">
              <option
                v-for="type in [
                  'text',
                  'number',
                  'money',
                  'date',
                  'boolean',
                  'dropdown',
                  'checkbox',
                  'radio',
                ]"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>

            <input v-model="col.field_label" placeholder="Column Label" />

            <!-- Column Options (if dropdown, checkbox, radio) -->
            <div v-if="['dropdown', 'radio', 'checkbox'].includes(col.field_type)">
              <label>Options:</label>
              <div
                v-for="(opt, i) in col.properties.options"
                :key="i"
                style="display: flex; gap: 4px; margin-bottom: 2px"
              >
                <input v-model="col.properties.options[i]" />
                <button @click.prevent="col.properties.options.splice(i, 1)">x</button>
              </div>
              <button @click.prevent="col.properties.options.push('')">+ Add Option</button>
            </div>

            <label><input type="checkbox" v-model="col.properties.required" /> Required</label>
            <label><input type="checkbox" v-model="col.properties.disabled" /> Disabled</label>
            <label><input type="checkbox" v-model="col.properties.hidden" /> Hidden</label>
            <button @click="field.properties.columns.splice(cIdx, 1)">Remove</button>
          </div>
          <button @click="addTableColumn(field)">+ Add Column</button>
        </div>

        <button @click="removeField(index)">Remove Field</button>
        <!-- BEGIN: Field Label Copy Section -->
        <div style="margin: 8px 0">
          <template v-if="field.field_type !== 'table'">
            <code style="background: #f3f3f3; padding: 4px 8px; border-radius: 4px">
              {{ getTemplateString(field.field_label) }}
            </code>
            <button
              @click="copyText(getTemplateString(field.field_label))"
              style="margin-left: 8px"
            >
              Copy
            </button>
          </template>
          <template v-else>
            <div>
              <table
                :id="'table-' + index"
                style="
                  border-collapse: collapse;
                  font-family: Arial, sans-serif;
                  font-size: 14px;
                  margin-bottom: 8px;
                  width: auto;
                "
              >
                <!-- Header Row -->
                <tr>
                  <th
                    v-for="col in field.properties.columns"
                    :key="col.field_label"
                    style="border: 1px solid black; padding: 6px; font-family: Arial"
                  >
                    {{ col.field_label }}
                  </th>
                </tr>

                <!-- FOR row IN ... -->
                <tr>
                  <td
                    style="border: 1px solid black; padding: 6px; font-family: Arial"
                    v-html="getWordForRow(field.field_label)"
                  ></td>
                  <td
                    v-for="(_, i) in Math.max(0, field.properties.columns.length - 1)"
                    :key="'for-spacer-' + i"
                    style="border: 1px solid black; padding: 6px; font-family: Arial"
                  ></td>
                </tr>

                <!-- Row data -->
                <tr>
                  <td
                    v-for="col in field.properties.columns"
                    :key="col.field_label + '-row'"
                    style="border: 1px solid black; padding: 6px; font-family: Arial"
                    v-html="getWordRowValue(col.field_label)"
                  ></td>
                </tr>

                <!-- END-FOR row -->
                <tr>
                  <td
                    style="border: 1px solid black; padding: 6px; font-family: Arial"
                    v-html="getWordEndForRow()"
                  ></td>
                  <td
                    v-for="(_, i) in Math.max(0, field.properties.columns.length - 1)"
                    :key="'endfor-spacer-' + i"
                    style="border: 1px solid black; padding: 6px; font-family: Arial"
                  ></td>
                </tr>
              </table>
            </div>
            <button @click="copyTable(index)" style="margin-top: 4px">Copy</button>
          </template>
        </div>
        <!-- END: Field Label Copy Section -->
        <hr />
      </div>
      <button @click="addField">+ Add Field</button>
      <div style="margin-top: 24px">
        <button @click="submitDocument" style="margin-right: 8px">Submit</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
      <!-- <h3>Generated Schema JSON</h3>
      <pre>{{ fields }}</pre> -->
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_BASE } from '@/config/api'
const { proxy } = getCurrentInstance()
const fieldTypes = [
  'text',
  'number',
  'money',
  'date',
  'table',
  'boolean',
  'dropdown',
  'checkbox',
  'radio',
]

const fields = reactive([])
const documentData = ref(null)
const route = useRoute()
const router = useRouter()
const loading = ref(false)

const fetchDocument = async () => {
  loading.value = true
  const token = localStorage.getItem('token')
  const id = route.params.id
  const res = await fetch(`${API_BASE}/document/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  documentData.value = data
  if (data.schema) {
    // Parse schema and set as fields
    console.log('Schema', data.schema)
    // const parsed = JSON.parse(data.schema)
    fields.splice(0, fields.length, ...data.schema)
  }
  loading.value = false
}

onMounted(() => {
  fetchDocument()
})

const getTemplateString = (label) => `{{${toPascalCase(label)}}}`

const addField = () => {
  fields.push({
    field_type: 'text',
    field_label: '',
    properties: {
      required: false,
      disabled: false,
      hidden: false,
      options: [],
      multiple: false,
      min_rows: 0,
      columns: [],
    },
  })
}

const removeField = (index) => {
  fields.splice(index, 1)
}

const addTableColumn = (tableField) => {
  tableField.properties.columns.push({
    field_type: 'text',
    field_label: '',
    properties: {
      required: false,
      disabled: false,
      hidden: false,
      options: [],
    },
  })
}

const submitDocument = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      proxy.$toast({
        type: 'error',
        message: 'Authentication token missing.',
      })
      return
    }

    const fd = new FormData()
    fd.append('group_id', documentData.value.group_id)
    fd.append('name', documentData.value.name)
    fd.append('file_path', documentData.value.file_path || '')
    fd.append('schema', JSON.stringify(fields))

    // Optional: If handling a file input
    // if (documentData.value.file instanceof File) {
    //   fd.append('file', documentData.value.file)
    // }

    const response = await fetch(
      `${API_BASE}/document/${documentData.value.id}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Failed to submit document')
    }

    proxy.$toast({
      type: 'success',
      message: 'Document submitted successfully.',
    })

    router.push('/settings/templates')
  } catch (err) {
    console.error(err)
    proxy.$toast({
      type: 'error',
      message: 'An error occurred while submitting the document.',
    })

    alert('Error: ' + err.message)
  }
}

const cancelEdit = () => {
  router.push('/settings/templates')
}

// --- Field Label/Word Table Copy helpers ---
function escapeBraces(str) {
  return str.replace(/{{/g, '&#123;&#123;').replace(/}}/g, '&#125;&#125;')
}

function getWordForRow(label) {
  return escapeBraces(`{{FOR row IN ${toPascalCase(label)}}}`)
}

function getWordRowValue(label) {
  return escapeBraces(`{{= $row.${toPascalCase(label)}}}`)
}

function getWordEndForRow() {
  return escapeBraces(`{{END-FOR row}}`)
}

function toPascalCase(str) {
  if (!str) return ''
  return str
    .replace(/[^a-zA-Z0-9_\s]/g, '') // remove all non-alphanumeric except _ and space
    .replace(/[_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')) // convert next letters to uppercase
    .replace(/^(.)/, (m) => m.toUpperCase()) // capitalize first character
}

function copyText(label) {
  const text = label
  navigator.clipboard.writeText(text)
}

function copyTable(idx) {
  nextTick(() => {
    const table = document.getElementById('table-' + idx)
    if (!table) return

    // Clone and apply inline styles for Word compatibility
    const clone = table.cloneNode(true)
    clone.querySelectorAll('th, td').forEach((cell) => {
      cell.style.fontFamily = 'Arial'
      cell.style.border = '1px solid black'
      cell.style.padding = '6px'
    })
    clone.style.borderCollapse = 'collapse'
    clone.style.fontFamily = 'Arial'

    const container = document.createElement('div')
    container.appendChild(clone)
    document.body.appendChild(container)

    const range = document.createRange()
    range.selectNode(container)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    try {
      document.execCommand('copy')
    } catch (err) {}

    selection.removeAllRanges()
    document.body.removeChild(container)
  })
}
</script>

<style scoped>
.container {
  padding: 1rem;
}
.field-config {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 12px;
  background: #f9f9f9;
}
.table-col {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}
pre {
  background: #eee;
  padding: 10px;
  max-height: 400px;
  overflow: auto;
}
</style>
