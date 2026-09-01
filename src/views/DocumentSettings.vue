<template>
  <div class="document-settings app-page">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Settings', to: '/settings' }, { label: 'Document Templates' }]" />
    <TitleBar title="Document Templates" />
    <div class="actions">
      <button class="btn btn-primary" @click="openNewGroupModal">+ New Group</button>
      <button class="btn btn-primary" @click="openDocumentModal()">+ New Document</button>
    </div>

    <!-- Group Filters -->
    <div class="group-filters">
      <button :class="{ active: !activeGroupId }" @click="activeGroupId = null">All</button>
      <button
        v-for="group in groups"
        :key="group.id"
        :class="{ active: group.id === activeGroupId }"
        @click="activeGroupId = group.id"
      >
        {{ group.name }}
        <span class="edit" @click.stop="startEditGroup(group)">✎</span>
        <span class="x" @click.stop="deleteGroup(group.id)">×</span>
      </button>
    </div>

    <!-- Data Table -->
    <DataTable
      :data="documents"
      :columns="columns"
      :sort="sort"
      :onSort="toggleSort"
      :loading="isLoading"
      @view="viewDocument"
    >
      <template #actions="{ row }">
        <button class="btn btn-secondary" type="button" @click="openDocumentModal(row)">
          Edit
        </button>
        <button class="btn btn-secondary" type="button" @click="viewDocument(row)">View</button>
        <button class="btn btn-secondary text-red" type="button" @click="deleteDocument(row)">
          Delete
        </button>
      </template>
    </DataTable>

    <!-- Pagination -->
    <PaginationBar 
      :currentPage="pagination.page" 
      :totalPages="totalPages" 
      :perPage="pagination.limit"
      @page-change="p => { pagination.page = p; fetchDocuments() }" 
      @per-page-change="l => { pagination.limit = l; pagination.page = 1; fetchDocuments() }"
    />

    <!-- Modals -->
    <Modal v-if="showGroupModal" title="New Group" size="sm" @close="closeDocumentSettingsModal">
      <div class="form-group">
        <label>Group Name</label>
        <input v-model="newGroupName" class="field-control" placeholder="Group Name" />
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" @click="createGroup">Create</button>
        <button class="btn btn-secondary" type="button" @click="closeDocumentSettingsModal">
          Cancel
        </button>
      </div>
    </Modal>

    <Modal v-if="showEditGroupModal" title="Edit Group" size="sm" @close="closeDocumentSettingsModal">
      <div class="form-group">
        <label>Group Name</label>
        <input v-model="updatedGroupName" class="field-control" />
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" @click="updateGroup">Save</button>
        <button class="btn btn-secondary" type="button" @click="closeDocumentSettingsModal">
          Cancel
        </button>
      </div>
    </Modal>

    <Modal
      v-if="showDocumentModal"
      :title="editingDocument ? 'Edit Document' : 'New Document'"
      size="md"
      @close="closeDocumentSettingsModal"
    >
      <div class="form-group">
        <label>Group</label>
        <select v-model="form.group_id" class="field-control">
          <option v-for="g in groups" :value="g.id" :key="g.id">{{ g.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Document Name</label>
        <input v-model="form.name" class="field-control" placeholder="Document Name" />
      </div>
      <div class="form-group">
        <label>File (.docx)</label>
        <input type="file" @change="(e) => (form.file = e.target.files[0])" class="field-control" />
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" @click="submitDocument" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <button class="btn btn-secondary" type="button" @click="closeDocumentSettingsModal">
          Cancel
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import TitleBar from '@/components/TitleBar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { Document20 } from '@carbon/icons-vue'
import { useHashModal } from '@/composables/useHashModal'
import { API_BASE } from '@/config/api'

const token = localStorage.getItem('token')
const router = useRouter()

const saving = ref(false)

const groups = ref([])
const documents = ref([])
const total = ref(0)
const activeGroupId = ref(null)
const isLoading = ref(false)
const { confirm } = useConfirmDialog()

const sort = ref({ column: 'name', order: 'asc' })
const pagination = ref({ page: 1, limit: 10 })
const totalPages = computed(() => Math.ceil(total.value / pagination.value.limit))

const editingGroup = ref(null)
const updatedGroupName = ref('')

const editingDocument = ref(null)
const form = ref({ group_id: '', name: '', file: null })

const columns = [
  { label: 'Document Name', key: 'name', sortable: true },
  { label: 'File Path', key: 'file_path' },
  { label: 'Created At', key: 'created_at', sortable: true },
]

const showGroupModal = ref(false)
const showEditGroupModal = ref(false)
const showDocumentModal = ref(false)
const newGroupName = ref('')
const { openHashModal, closeHashModal } = useHashModal({
  'new-group': (isOpen) => {
    showGroupModal.value = isOpen
  },
  'edit-group': (isOpen) => {
    showEditGroupModal.value = isOpen && Boolean(editingGroup.value)
  },
  'document-modal': (isOpen) => {
    showDocumentModal.value = isOpen
  },
})

function handleFileChange(event) {
  form.value.file = event.target.files[0]
}

function selectGroup(groupId) {
  activeGroupId.value = groupId
  fetchDocuments()
}

function toggleSort(column) {
  if (sort.value.column === column) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.column = column
    sort.value.order = 'asc'
  }
  fetchDocuments()
}

async function fetchGroups() {
  const res = await fetch(`${API_BASE}/groups`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  groups.value = await res.json()
}

async function fetchDocuments() {
  isLoading.value = true
  const url = new URL(`${API_BASE}/documents`)
  if (activeGroupId.value) url.searchParams.set('group', activeGroupId.value)
  url.searchParams.set('sort', sort.value.column)
  url.searchParams.set('order', sort.value.order)
  url.searchParams.set('page', pagination.value.page)
  url.searchParams.set('limit', pagination.value.limit)

  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    documents.value = data.data || []
    total.value = data.total || data.length || 0
  } finally {
    isLoading.value = false
  }
}

async function createGroup() {
  await fetch(`${API_BASE}/group`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: newGroupName.value }),
  })
  closeDocumentSettingsModal()
  newGroupName.value = ''
  fetchGroups()
}

function openNewGroupModal() {
  showGroupModal.value = true
  openHashModal('new-group')
}

function startEditGroup(group) {
  editingGroup.value = group
  updatedGroupName.value = group.name
  showEditGroupModal.value = true
  openHashModal('edit-group')
}

async function updateGroup() {
  await fetch(`${API_BASE}/group`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id: editingGroup.value.id, name: updatedGroupName.value }),
  })
  closeDocumentSettingsModal()
  fetchGroups()
}

function openDocumentModal(doc = null) {
  showDocumentModal.value = true
  if (doc) {
    editingDocument.value = doc
    form.value = { group_id: doc.group_id, name: doc.name, file: null }
  } else {
    editingDocument.value = null
    form.value = { group_id: '', name: '', file: null }
  }
  openHashModal('document-modal')
}

function closeDocumentSettingsModal() {
  closeHashModal('new-group')
  closeHashModal('edit-group')
  closeHashModal('document-modal')
  showGroupModal.value = false
  showEditGroupModal.value = false
  showDocumentModal.value = false
}

async function submitDocument() {
  if (saving.value) return // Prevent double submission
  saving.value = true

  const isEdit = editingDocument.value
  const fd = new FormData()
  fd.append('group_id', form.value.group_id)
  fd.append('name', form.value.name)
  if (form.value.file) fd.append('file', form.value.file)

  const url = isEdit
    ? `${API_BASE}/document/${editingDocument.value.id}`
    : `${API_BASE}/document`

  try {
    await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })

    closeDocumentSettingsModal()
    fetchDocuments()
  } catch (error) {
    console.error('Error submitting document:', error)
    alert('Submission failed')
  } finally {
    saving.value = false
  }
}

async function deleteDocument(doc) {
  if (!await confirm('Delete Document?', 'Are you sure you want to delete this document template?', 'Delete')) return
  await fetch(`${API_BASE}/document/${doc.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  fetchDocuments()
}

async function deleteGroup(groupId) {
  if (!await confirm('Delete Group?', 'Are you sure you want to delete this group and all its documents?', 'Delete')) return
  await fetch(`${API_BASE}/group/${groupId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (activeGroupId.value === groupId) activeGroupId.value = null
  fetchGroups()
  fetchDocuments()
}

function viewDocument(doc) {
  router.push(`/settings/document/${doc.id}`)
}

watch([activeGroupId, () => pagination.value.limit], () => {
  pagination.value.page = 1
  fetchDocuments()
})

onMounted(() => {
  fetchGroups()
  fetchDocuments()
})
</script>

<style scoped>
.document-settings {
  padding: 1rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.green-btn {
  background: var(--brand-600);
  color: #ffffff;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
}
.green-btn:hover {
  background: var(--brand-700);
}

.group-filters {
  display: flex;
  overflow-x: auto;
  padding: 0.5rem 0;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.group-filters button {
  background: var(--bg-muted);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 0.4rem 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  position: relative;
}
.group-filters button.active {
  background: var(--brand-100);
  color: var(--heading);
  border-color: var(--brand-600);
  font-weight: 800;
}
.group-filters .edit,
.group-filters .x {
  margin-left: 0.4rem;
  cursor: pointer;
  font-weight: bold;
}
.group-filters .x:hover {
  color: var(--danger-strong);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.text-red {
  color: var(--danger-strong);
}
</style>
