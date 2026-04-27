<template>
  <div class="document-settings app-page">
    <div class="actions">
      <button class="green-btn" @click="openNewGroupModal">+ New Group</button>
      <button class="green-btn" @click="openDocumentModal()">+ New Document</button>
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
    <div class="pagination">
      <button :disabled="pagination.page === 1" @click="pagination.page-- && fetchDocuments()">
        Prev
      </button>
      <span>Page {{ pagination.page }} of {{ totalPages }}</span>
      <button
        :disabled="pagination.page >= totalPages"
        @click="pagination.page++ && fetchDocuments()"
      >
        Next
      </button>
      <select v-model="pagination.limit" @change="fetchDocuments()">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </div>

    <!-- Modals -->
    <Modal v-if="showGroupModal" title="New Group" @close="closeDocumentSettingsModal">
      <input v-model="newGroupName" placeholder="Group Name" />
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" @click="createGroup">Create</button>
        <button class="btn btn-secondary" type="button" @click="closeDocumentSettingsModal">
          Cancel
        </button>
      </div>
    </Modal>

    <Modal v-if="showEditGroupModal" title="Edit Group" @close="closeDocumentSettingsModal">
      <input v-model="updatedGroupName" />
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
      @close="closeDocumentSettingsModal"
    >
      <select v-model="form.group_id">
        <option v-for="g in groups" :value="g.id" :key="g.id">{{ g.name }}</option>
      </select>
      <input v-model="form.name" placeholder="Document Name" />
      <input type="file" @change="(e) => (form.file = e.target.files[0])" />
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
import { Document20 } from '@carbon/icons-vue'
import { useHashModal } from '@/composables/useHashModal'

const token = localStorage.getItem('token')
const router = useRouter()

const saving = ref(false)

const groups = ref([])
const documents = ref([])
const total = ref(0)
const activeGroupId = ref(null)

const sort = ref({ column: 'name', order: 'asc' })
const pagination = ref({ page: 1, limit: 10 })
const totalPages = computed(() => Math.ceil(total.value / pagination.value.limit))

const showGroupModal = ref(false)
const newGroupName = ref('')

const showEditGroupModal = ref(false)
const editingGroup = ref(null)
const updatedGroupName = ref('')

const showDocumentModal = ref(false)
const editingDocument = ref(null)
const form = ref({ group_id: '', name: '', file: null })
const { openHashModal, closeHashModal } = useHashModal({
  'new-group': (isOpen) => {
    showGroupModal.value = isOpen
  },
  'edit-group': (isOpen) => {
    showEditGroupModal.value = isOpen
  },
  'document-modal': (isOpen) => {
    showDocumentModal.value = isOpen
  },
})

const columns = [
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Group', key: 'group_name', sortable: true },
  { label: 'File', key: 'file_uri' },
]

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
  const res = await fetch('https://api-abealcala.duckdns.org/groups', {
    headers: { Authorization: `Bearer ${token}` },
  })
  groups.value = await res.json()
}

async function fetchDocuments() {
  const url = new URL('https://api-abealcala.duckdns.org/documents')
  if (activeGroupId.value) url.searchParams.set('group', activeGroupId.value)
  url.searchParams.set('sort', sort.value.column)
  url.searchParams.set('order', sort.value.order)
  url.searchParams.set('page', pagination.value.page)
  url.searchParams.set('limit', pagination.value.limit)

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const data = await res.json()
  documents.value = data.data || []
  total.value = data.total || data.length || 0
}

async function createGroup() {
  await fetch('https://api-abealcala.duckdns.org/group', {
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
  await fetch('https://api-abealcala.duckdns.org/group', {
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
    ? `https://api-abealcala.duckdns.org/document/${editingDocument.value.id}`
    : 'https://api-abealcala.duckdns.org/document'

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
  if (!confirm('Delete this document?')) return
  await fetch(`https://api-abealcala.duckdns.org/document/${doc.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  fetchDocuments()
}

async function deleteGroup(groupId) {
  if (!confirm('Delete this group?')) return
  await fetch(`https://api-abealcala.duckdns.org/group/${groupId}`, {
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
