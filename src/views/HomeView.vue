<template>
  <div>
    <h2>Dynamic Schema Builder</h2>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="(field, index) in fields" :key="index" class="field-config">
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
        <hr />
      </div>
      <button @click="addField">+ Add Field</button>
      <div style="margin-top: 24px">
        <button @click="submitDocument" style="margin-right: 8px">Submit</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
      <h3>Generated Schema JSON</h3>
      <pre>{{ fields }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  const res = await fetch(`http://localhost:3000/document/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  documentData.value = data
  if (data.schema) {
    // Parse schema and set as fields
    const parsed = JSON.parse(data.schema)
    fields.splice(0, fields.length, ...parsed)
  }
  loading.value = false
}

onMounted(() => {
  fetchDocument()
})

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
  const token = localStorage.getItem('token')
  const fd = new FormData()
  fd.append('group_id', documentData.value.group_id)
  fd.append('name', documentData.value.name)
  fd.append('schema', JSON.stringify(fields))
  // file upload not handled here, add if needed

  await fetch(`http://localhost:3000/document/${documentData.value.id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })
  // Optionally show a message or redirect
  router.push('/settings/document')
}

const cancelEdit = () => {
  router.push('/settings/document')
}
</script>

<style scoped>
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
