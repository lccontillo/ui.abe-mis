<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import fuzzysort from 'fuzzysort'
import { computePosition, autoUpdate, offset, flip, shift } from '@floating-ui/dom'
import { downloadZip } from 'client-zip'
import { useRoute } from 'vue-router'
import { useHashModal } from '@/composables/useHashModal'
const route = useRoute()

const isViewMode = computed(() => route.query.document_id && route.query.fca && route.query.group)

// Import field components
import InputField from '@/components/InputField.vue'
import DateField from '@/components/DateField.vue'
import DropdownField from '@/components/DropdownField.vue'
import RadioField from '@/components/RadioField.vue'
import CheckboxField from '@/components/CheckboxField.vue'
import TableField from '@/components/TableField.vue'

const token = localStorage.getItem('token')

// State
const fcas = ref([])
const groups = ref([])
const documents = ref([])
const selectedFca = ref(null)
const selectedGroup = ref(null)
const selectedDocuments = ref([])
const searchFca = ref('')
const searchGroup = ref('')
const showModal = ref(false)
const selectedDocForModal = ref(null)
const formData = reactive({})
const doc_ids = ref([1, 2, 3, 4, 5])
const { openHashModal, closeHashModal } = useHashModal({
  'fill-document': (isOpen) => {
    if (!isOpen) {
      showModal.value = false
      selectedDocForModal.value = null
    }
  },
})

// Dropdown states
const isFcaDropdownOpen = ref(false)
const isGroupDropdownOpen = ref(false)

// Refs for floating UI
const fcaInputRef = ref(null)
const fcaDropdownRef = ref(null)
const groupInputRef = ref(null)
const groupDropdownRef = ref(null)

// Fetch Data
const fetchFcas = async () => {
  const res = await fetch('https://api-abealcala.duckdns.org/fcas?limit=all', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  fcas.value = data.data || []
}

const fetchGroups = async () => {
  const res = await fetch('https://api-abealcala.duckdns.org/groups', {
    headers: { Authorization: `Bearer ${token}` },
  })
  groups.value = await res.json()
}

const fetchDocuments = async () => {
  if (!selectedGroup.value) return
  const res = await fetch(
    `https://api-abealcala.duckdns.org/documents?group=${selectedGroup.value.id}&limit=all`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  const data = await res.json()
  documents.value = data.data || []
}

// Dropdown selection
const handleFcaSelect = (fca) => {
  selectedFca.value = fca
  searchFca.value = fca.name
  isFcaDropdownOpen.value = false
}

const handleGroupSelect = (group) => {
  selectedGroup.value = group
  searchGroup.value = group.name
  isGroupDropdownOpen.value = false
  fetchDocuments()
}

// Modal actions
const handleGenerateClick = async () => {
  await downloadAndZipDocuments(doc_ids.value)
}

function camel(str) {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
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

async function openFormModal(doc) {
  selectedDocForModal.value = doc
  // Initialize formData based on schema
  const schema = doc.schema || []
  for (const field of schema) {
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
  }

  // Fetch previous generation for this FCA and document only
  try {
    const res = await fetch(
      `https://api-abealcala.duckdns.org/generations?fca_id=${selectedFca.value?.id}&document_id=${doc.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const generations = await res.json()
    // If your backend returns an array, use the first match
    const match = Array.isArray(generations) ? generations[0] : generations
    if (match && match.meta_data) {
      let meta = match.meta_data
      if (typeof meta === 'string') {
        try {
          meta = JSON.parse(meta)
        } catch (e) {
          try {
            // eslint-disable-next-line no-eval
            meta = eval('(' + meta + ')')
          } catch (e2) {
            meta = {}
          }
        }
      }
      Object.entries(meta).forEach(([k, v]) => {
        if (k in formData) formData[k] = v
      })
    }
  } catch (e) {
    // ignore errors, just open blank form
  }

  showModal.value = true
  openHashModal('fill-document')
}

function closeModal() {
  closeHashModal('fill-document')
  showModal.value = false
  selectedDocForModal.value = null
}

async function submitForm() {
  if (!selectedFca.value || !selectedDocForModal.value) {
    alert('Missing FCA or Document')
    return
  }
  try {
    const res = await fetch('https://api-abealcala.duckdns.org/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fca_id: selectedFca.value.id,
        document_id: selectedDocForModal.value.id,
        form: formData,
      }),
    })
    if (!res.ok) throw new Error('Failed to generate document')
    alert('Document generated successfully!')
    closeModal()
  } catch (e) {
    alert('Error: ' + e.message)
  }
}

// Floating UI
const positionFloating = (refEl, floatEl) => {
  if (!refEl.value || !floatEl.value) return
  autoUpdate(refEl.value, floatEl.value, () => {
    computePosition(refEl.value, floatEl.value, {
      placement: 'bottom-start',
      middleware: [offset(4), flip(), shift()],
    }).then(({ x, y }) => {
      Object.assign(floatEl.value.style, {
        left: `${x}px`,
        top: `${y}px`,
        position: 'absolute',
        zIndex: 1000,
      })
    })
  })
}

// Watch dropdown state
watch(isFcaDropdownOpen, (open) => open && positionFloating(fcaInputRef, fcaDropdownRef))
watch(isGroupDropdownOpen, (open) => open && positionFloating(groupInputRef, groupDropdownRef))

// Fuzzy Search
const filteredFcas = computed(() =>
  searchFca.value
    ? fuzzysort.go(searchFca.value, fcas.value, { key: 'name' }).map((res) => res.obj)
    : fcas.value,
)

const filteredGroups = computed(() =>
  searchGroup.value
    ? fuzzysort.go(searchGroup.value, groups.value, { key: 'name' }).map((res) => res.obj)
    : groups.value,
)

async function downloadDocument(doc) {
  if (!selectedFca.value || !doc) {
    alert('Please select an FCA and document.')
    return
  }
  try {
    console.log(selectedFca.value, doc)
    const res = await fetch('https://api-abealcala.duckdns.org/download_document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fca_id: selectedFca.value.id,
        document_id: doc.id,
      }),
    })

    if (!res.ok) throw new Error('Failed to download document')

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedFca.value.acronym}_${doc.name || 'document'}.docx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    alert('Error: ' + e.message)
  }
}

async function downloadAndZipDocuments(docIds) {
  if (!selectedFca.value || !docIds?.length) {
    alert('Please select an FCA and document(s).')
    return
  }

  const files = []

  for (const id of docIds) {
    try {
      const res = await fetch('https://api-abealcala.duckdns.org/download_document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fca_id: selectedFca.value.id,
          document_id: id,
        }),
      })

      if (!res.ok) throw new Error(`Failed to fetch document ID ${id}`)

      const blob = await res.blob()
      files.push({
        name: `document_${id}.docx`,
        input: blob,
      })
    } catch (err) {
      console.error(`Failed to download document ${id}`, err)
    }
  }

  if (files.length) {
    const zipBlob = await downloadZip(files).blob()
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'documents.zip'
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } else {
    alert('No documents downloaded successfully.')
  }
}

const onFcaChange = () => {
  const match = fcas.value.find((fca) => fca.name === searchFca.value)
  if (match) selectedFca.value = match
}

const onGroupChange = () => {
  // alert('Group changed')
  const match = groups.value.find((group) => group.name === searchGroup.value)
  if (match) {
    selectedGroup.value = match
    fetchDocuments()
  }
}

onMounted(async () => {
  await fetchFcas()
  await fetchGroups()

  const fcaName = route.query.fca
  const groupName = route.query.group
  const docId = Number(route.query.document_id)

  if (fcaName) {
    const matchFca = fcas.value.find((f) => f.name === fcaName)
    if (matchFca) {
      selectedFca.value = matchFca
      searchFca.value = matchFca.name
    }
  }

  if (groupName) {
    const matchGroup = groups.value.find((g) => g.name === groupName)
    if (matchGroup) {
      selectedGroup.value = matchGroup
      searchGroup.value = matchGroup.name
      await fetchDocuments()

      if (docId) {
        const matchDoc = documents.value.find((d) => d.id === docId)
        if (matchDoc) {
          selectedDocuments.value = [matchDoc]
          openFormModal(matchDoc)
        }
      }
    }
  }
})
</script>

<template>
  <div class="form-wrapper app-page">
    <!-- FCA Selection -->
    <h1 class="form-title">Generate Documents</h1>
    <div class="form-group">
      <label for="fcaInput">FCA</label>
      <!-- <input id="fcaInput" class="input" list="fcaList" v-model="searchFca" @change="onFcaChange" />
      <datalist id="fcaList">
        <option v-for="fca in fcas" :key="fca.id" :value="fca.name" />
      </datalist> -->

      <v-select
        v-model="searchFca"
        :options="fcas"
        label="name"
        :reduce="(fca) => fca.name"
        @update:modelValue="onFcaChange"
        class="my-vue-select"
        :placeholder="'Search FCA...'"
        clearable
      />
      <!-- <p v-if="selectedFca" class="selected">Selected: {{ selectedFca.name }}</p> -->
    </div>

    <!-- Group Selection -->
    <div class="form-group">
      <label for="groupInput">Group</label>
      <!-- <input
        id="groupInput"
        class="input"
        list="groupList"
        v-model="searchGroup"
        @change="onGroupChange"
      />
      <datalist id="groupList">
        <option v-for="group in groups" :key="group.id" :value="group.name" />
      </datalist> -->
      <v-select
        v-model="searchGroup"
        :options="groups"
        label="name"
        :reduce="(group) => group.name"
        @update:modelValue="onGroupChange"
        class="my-vue-select"
        placeholder="Search group..."
        clearable
      />

      <!-- {{ searchGroup }}
      <p v-if="selectedGroup" class="selected">Selected: {{ selectedGroup.name }}</p> -->
    </div>

    <!-- Documents -->
    <div class="form-group">
      <h3>Documents</h3>
      <div v-for="doc in documents" :key="doc.id" class="document-item">
        <label>
          <!-- <input type="checkbox" :value="doc" v-model="selectedDocuments" /> -->
          {{ doc.name }}
        </label>
        <div class="document-actions">
          <button
            class="btn btn-secondary"
            v-if="doc.schema"
            type="button"
            @click="openFormModal(doc)"
          >
            Fill
          </button>
          <button class="btn btn-primary" type="button" @click="downloadDocument(doc)">
            Download
          </button>
        </div>
      </div>
    </div>

    <!-- <button class="btn full-width" @click="handleGenerateClick">Download Zip</button> -->

    <!-- Right Side Modal -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="side-modal">
        <div class="side-modal-content modal-content">
          <h1>{{ selectedDocForModal?.name }}</h1>
          <form @submit.prevent="submitForm">
            <div v-for="(field, idx) in selectedDocForModal.schema" :key="idx" class="form-group">
              <component
                :is="getFieldComponent(field)"
                :field="field"
                v-model="formData[camel(field.field_label)]"
              />
            </div>
            <div class="modal-buttons modal-actions">
              <button type="submit" class="btn btn-primary">Submit</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.input {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.selected {
  margin-top: 4px;
  font-size: 0.85rem;
  color: #555;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn.secondary {
  background-color: #888;
}

.btn.full-width {
  width: 100%;
  margin-top: 1rem;
}

.document-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.document-actions {
  display: flex;
  gap: 0.5rem;
}

.side-modal {
  position: fixed;
  inset: 0 0 0 auto;
  width: min(100vw, 750px);
  height: 100vh;
  height: 100dvh;
  background: transparent;
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.side-modal-content {
  background: var(--bg-elevated);
  width: 100%;
  max-width: 750px;
  height: 100vh;
  height: 100dvh;
  max-height: none;
  padding: 2rem 2rem 0;
  overflow-y: auto;
  box-shadow: -2px 0 18px rgba(0, 0, 0, 0.22);
  position: relative;
  border-radius: 0;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  margin: 1rem -2rem 0;
  padding: 1rem 2rem;
  background: var(--bg-elevated);
  border-top: 1px solid var(--border);
}
</style>
