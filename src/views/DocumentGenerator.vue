<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useToast } from '@/composables/useToast'
const { success, error, warning } = useToast()
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import Stepper from '@/components/Stepper.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import EmptyState from '@/components/EmptyState.vue'
import Modal from '@/components/Modal.vue'
import fuzzysort from 'fuzzysort'
import { computePosition, autoUpdate, offset, flip, shift } from '@floating-ui/dom'
import { downloadZip } from 'client-zip'
import { useRoute } from 'vue-router'
import { useHashModal } from '@/composables/useHashModal'
import { API_BASE } from '@/config/api'
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
const isLoading = ref(false)
const currentStep = ref(0)
const steps = ['Select Entity', 'Choose Documents']
const showModal = ref(false)
const selectedDocForModal = ref(null)
const formData = reactive({})
const doc_ids = ref([1, 2, 3, 4, 5])
const { openHashModal, closeHashModal } = useHashModal({
  'fill-document': (isOpen) => {
    showModal.value = isOpen && Boolean(selectedDocForModal.value)
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
  const res = await fetch(`${API_BASE}/fcas?limit=all`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  fcas.value = data.data || []
}

const fetchGroups = async () => {
  const res = await fetch(`${API_BASE}/groups`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  groups.value = await res.json()
}

const fetchDocuments = async () => {
  if (!selectedGroup.value) return
  isLoading.value = true
  try {
    const res = await fetch(
      `${API_BASE}/documents?group=${selectedGroup.value.id}&limit=all`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const data = await res.json()
    documents.value = data.data || []
  } finally {
    isLoading.value = false
  }
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
  currentStep.value = 1
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
      `${API_BASE}/generations?fca_id=${selectedFca.value?.id}&document_id=${doc.id}`,
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
    warning('Missing FCA or Document')
    return
  }
  try {
    const res = await fetch(`${API_BASE}/generate`, {
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
    success('Document generated successfully!')
    closeModal()
  } catch (e) {
    error('Error: ' + e.message)
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
    warning('Please select an FCA and document.')
    return
  }
  try {
    console.log(selectedFca.value, doc)
    const res = await fetch(`${API_BASE}/download_document`, {
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
    error('Error: ' + e.message)
  }
}

async function downloadAndZipDocuments(docIds) {
  if (!selectedFca.value || !docIds?.length) {
    warning('Please select an FCA and document(s).')
    return
  }

  const files = []

  for (const id of docIds) {
    try {
      const res = await fetch(`${API_BASE}/download_document`, {
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
    warning('No documents downloaded successfully.')
  }
}

const canProceed = computed(() => !!selectedFca.value && !!selectedGroup.value)

const proceedToDocuments = async () => {
  if (!canProceed.value) return
  if (selectedGroup.value) {
    await fetchDocuments()
  }
  currentStep.value = 1
}

const onFcaChange = () => {
  const match = fcas.value.find((fca) => fca.name === searchFca.value)
  selectedFca.value = match || null
  if (selectedFca.value && selectedGroup.value) {
    fetchDocuments()
    currentStep.value = 1
  }
}

const onGroupChange = () => {
  const match = groups.value.find((group) => group.name === searchGroup.value)
  selectedGroup.value = match || null
  if (selectedGroup.value) {
    fetchDocuments()
    if (selectedFca.value) {
      currentStep.value = 1
    }
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

  if (selectedFca.value && selectedGroup.value) {
    currentStep.value = 1
  }
})

const modalSize = computed(() => {
  if (!selectedDocForModal.value) return 'lg'
  const hasTable = selectedDocForModal.value.schema?.some((f) => f.field_type === 'table')
  return hasTable ? 'xl' : 'lg'
})
</script>

<template>
  <div class="form-wrapper app-page">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Generate Documents' }]" />
    
    <div class="wizard-header">
      <!-- <h1 class="form-title">Generate Documents</h1> -->
      <Stepper :steps="steps" :currentStep="currentStep" />
    </div>

    <!-- Step 1: Selection -->
    <div v-if="currentStep === 0" class="wizard-step">
      <div class="form-group">
        <label for="fcaInput">FCA</label>
        <v-select
          id="fcaInput"
          v-model="searchFca"
          :options="fcas"
          label="name"
          :reduce="(fca) => fca.name"
          @update:modelValue="onFcaChange"
          placeholder="Search FCA..."
          clearable
        />
      </div>

      <div class="form-group">
        <label for="groupInput">Group</label>
        <v-select
          id="groupInput"
          v-model="searchGroup"
          :options="groups"
          label="name"
          :reduce="(group) => group.name"
          @update:modelValue="onGroupChange"
          placeholder="Search group..."
          clearable
        />
      </div>

      <div class="selection-actions" v-if="canProceed">
        <button class="btn btn-primary" type="button" @click="proceedToDocuments">
          Proceed to Choose Documents
        </button>
      </div>
    </div>

    <!-- Step 2: Documents -->
    <div v-else class="wizard-step">
      <div class="step-actions">
        <button class="btn btn-secondary" @click="currentStep = 0">Back to Selection</button>
      </div>

      <div class="form-group">
        <div class="section-header">
          <h3>Available Documents</h3>
          <span class="selected-entity" v-if="selectedFca">{{ selectedFca.acronym }} / {{ selectedGroup?.name }}</span>
        </div>

        <SkeletonLoader v-if="isLoading" type="table" :rows="3" />
        <div v-else>
          <div v-for="doc in documents" :key="doc.id" class="document-item panel">
            <div class="doc-info">
              <span class="doc-name">{{ doc.name }}</span>
              <span class="doc-tag" v-if="doc.schema">Fillable</span>
            </div>
            <div class="document-actions">
              <button
                class="btn btn-secondary"
                v-if="doc.schema"
                type="button"
                @click="openFormModal(doc)"
              >
                Fill Data
              </button>
              <button class="btn btn-primary" type="button" @click="downloadDocument(doc)">
                Download
              </button>
            </div>
          </div>
          <EmptyState v-if="!documents.length" title="No documents found" description="No documents are available for this group." />
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <Modal 
      v-if="showModal" 
      :title="selectedDocForModal?.name" 
      :size="modalSize" 
      @close="closeModal"
    >
      <form @submit.prevent="submitForm">
        <div class="modal-form-scroll">
          <div v-for="(field, idx) in selectedDocForModal.schema" :key="idx" class="form-group">
            <component
              :is="getFieldComponent(field)"
              :field="field"
              v-model="formData[camel(field.field_label)]"
            />
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">Save & Generate</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<style scoped>
.wizard-header {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.wizard-step {
  animation: fadeIn 300ms ease-out;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--heading);
}

.step-actions {
  margin-bottom: 1.25rem;
  display: flex;
  gap: 0.75rem;
}

.selection-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.selected-entity {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.document-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 1rem 1.25rem;
}

.doc-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.doc-name {
  font-weight: 600;
  color: var(--heading);
}

.doc-tag {
  font-size: 0.7rem;
  background: var(--brand-100);
  color: var(--brand-700);
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
}

.document-actions {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 0.75rem !important;
}

.document-actions .btn + .btn {
  margin-left: 0.75rem !important;
}

.modal-form-scroll {
  max-height: 72vh;
  overflow-y: auto;
  padding: 0.75rem 0.25rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
