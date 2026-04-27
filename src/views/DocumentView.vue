<template>
  <div class="container app-page">
    <TitleBar title="Generated Documents" :icon="Document20" />

    <!-- Filters -->
    <div class="filters">
      <!-- Document Name -->
      <!-- <input v-model="selectedDocument" placeholder="Filter by Document" /> -->
      <!-- <input
        list="docList"
        v-model="searchDoc"
        @change="onDocChange"
        placeholder="Filter by  Document"
      />
      <datalist id="docList">
        <option v-for="doc in docs" :key="doc.id" :value="doc.name" />
      </datalist> -->

      <v-select
        v-model="selectedDocument"
        :options="docs"
        label="name"
        :reduce="(g) => g"
        placeholder="Select Document"
      ></v-select>

      <!-- FCA Dropdown -->
      <!-- <input list="fcaList" v-model="searchFca" @change="onFcaChange" placeholder="Filter by FCA" />
      <datalist id="fcaList">
        <option v-for="fca in fcas" :key="fca.id" :value="fca.name" />
      </datalist> -->

      <v-select
        v-model="selectedFca"
        :options="fcas"
        label="name"
        :reduce="(g) => g"
        placeholder="Select FCA"
      ></v-select>
      <!-- Group Dropdown -->
      <!-- <input
        list="groupList"
        v-model="searchGroup"
        @change="onGroupChange"
        placeholder="Filter by Group"
      />
      <datalist id="groupList">
        <option v-for="group in groups" :key="group.id" :value="group.name" />
      </datalist> -->

      <!-- <Vue3Select
        v-model="selectedGroup"
        :options="groups"
        label="name"
        :reduce="(group) => group"
        placeholder="Search or select a group"
      /> -->
      <v-select
        v-model="selectedGroup"
        :options="groups"
        label="name"
        :reduce="(g) => g"
        placeholder="Select group"
      ></v-select>
      <!-- User Dropdown -->
      <!-- <input
        list="userList"
        v-model="searchUser"
        @change="onUserChange"
        placeholder="Filter by User"
      />
      <datalist id="userList">
        <option v-for="user in users" :key="user.id" :value="user.name" />
      </datalist> -->

      <v-select
        v-model="selectedUser"
        :options="users"
        label="name"
        :reduce="(g) => g"
        placeholder="Select User"
      ></v-select>

      <button class="btn btn-primary" type="button" @click="fetchDocuments">Apply</button>
    </div>

    <!-- {{ documents }} -->
    <!-- Table -->
    <DataTable
      :data="documents"
      :columns="columns"
      :sort="{ column: sort, order }"
      :onSort="toggleSort"
      @view="viewDocument($event.document_id, $event.fca_name, $event.group_name)"
    >
      <template #actions="{ row }">
        <View20
          title="View"
          class="action-icon"
          @click="viewDocument(row.document_id, row.fca_name, row.group_name)"
        />
        <TrashCan20 title="Delete" class="action-icon text-red" @click="deleteDocument(row.id)" />
      </template>
    </DataTable>

    <!-- Pagination -->
    <div class="pagination">
      <div>
        <button :disabled="page === 1" @click="page-- && fetchDocuments()">Prev</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button :disabled="page >= totalPages" @click="page++ && fetchDocuments()">Next</button>
      </div>
      <div class="limit">
        <label>Rows per page:</label>
        <select v-model="limit" @change="fetchDocuments()">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document20, View20, TrashCan20 } from '@carbon/icons-vue'
import TitleBar from '@/components/TitleBar.vue'
import DataTable from '@/components/DataTable.vue'

const token = localStorage.getItem('token')
const router = useRouter()
const route = useRoute()

const documents = ref([])
const total = ref(0)

const selectedDocument = ref('')
const selectedFca = ref('')
const selectedUser = ref('')
const selectedGroup = ref('')

const searchDoc = ref('')
const searchFca = ref('')
const searchGroup = ref('')
const searchUser = ref('')

const docs = ref([])
const fcas = ref([])
const groups = ref([])
const users = ref([])

function onDocChange() {
  selectedDocument.value = docs.value.find((doc) => doc.name === searchDoc.value) || null
}
function onFcaChange() {
  selectedFca.value = fcas.value.find((fca) => fca.name === searchFca.value) || null
}

function onGroupChange() {
  selectedGroup.value = groups.value.find((group) => group.name === searchGroup.value) || null
}

function onUserChange() {
  selectedUser.value = users.value.find((user) => user.name === searchUser.value) || null
}

const page = ref(Number(route.query.page) || 1)
const limit = ref(Number(route.query.limit) || 10)
const sort = ref(route.query.sort || 'updated_at')
const order = ref(route.query.order || 'desc')

const totalPages = computed(() => Math.ceil(total.value / limit.value))

const columns = [
  { label: 'Document', key: 'document_name' },
  { label: 'FCA', key: 'fca_name' },
  { label: 'Group', key: 'group_name' },
  { label: 'User', key: 'created_by_username' },
  { label: 'Updated At', key: 'updated_at', sortable: true },
]

function toggleSort(column) {
  if (sort.value === column) {
    order.value = order.value === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value = column
    order.value = 'asc'
  }
  fetchDocuments()
}

function viewDocument(id, fca, group) {
  // router.push(`/preview?document=${id}`)
  router.push(
    `/generate?document_id=${id}&fca=${encodeURIComponent(fca)}&group=${encodeURIComponent(group)}`,
  )
}

async function deleteDocument(id) {
  if (!confirm('Delete this document?')) return

  try {
    const res = await fetch(`https://api-abealcala.duckdns.org/generated_document/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to delete document.')
    }

    alert(`Deleted document ${id}`)
    await fetchDocuments() // Refresh list
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

async function fetchDocuments() {
  const params = new URLSearchParams()
  if (selectedDocument.value) params.append('document_name', selectedDocument.value.name)
  if (selectedFca.value) params.append('fca_name', selectedFca.value.name)
  if (selectedUser.value) params.append('user_name', selectedUser.value.name)
  if (selectedGroup.value) params.append('group_name', selectedGroup.value.name)
  params.append('sort', sort.value)
  params.append('order', order.value)
  params.append('page', page.value)
  params.append('limit', limit.value)

  const res = await fetch(`https://api-abealcala.duckdns.org/generated_documents?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  documents.value = data.data
  total.value = data.total
}

const fetchDocs = async () => {
  const res = await fetch(`https://api-abealcala.duckdns.org/documents?limit=all`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  docs.value = data.data || []
}
const fetchFcas = async () => {
  try {
    const res = await fetch('https://api-abealcala.duckdns.org/fcas?limit=all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    fcas.value = data.data || []
  } catch (err) {
    console.error('Failed to fetch FCAs:', err)
  }
}

const fetchGroups = async () => {
  try {
    const res = await fetch('https://api-abealcala.duckdns.org/groups', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    groups.value = data || []
    console.log(groups.value)
  } catch (err) {
    console.error('Failed to fetch groups:', err)
  }
}

const fetchUsers = async () => {
  try {
    const res = await fetch('https://api-abealcala.duckdns.org/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    users.value = data || []
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
}

watch([page, limit, sort, order], () => {
  router.replace({
    query: {
      page: page.value,
      limit: limit.value,
      sort: sort.value,
      order: order.value,
    },
  })
})

onMounted(() => {
  fetchDocuments()
  fetchFcas()
  fetchGroups()
  fetchUsers()
  fetchDocs()
})
</script>

<style scoped>
.container {
  padding: 1rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.filters input,
.filters .v-select {
  padding: 6px 4px;
  font-size: 0.9rem;
  min-width: 200px;
  flex: 1;
}

.filters button {
  padding: 6px 6px;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  width: 100px;
}
.filters button:hover {
  background-color: #256128;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.25rem;
  gap: 1rem;
}
.pagination button {
  padding: 5px 10px;
  font-size: 0.85rem;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
}
.pagination button:disabled {
  background: #ccc;
}
.limit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}
.action-icon {
  cursor: pointer;
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
.action-icon:hover {
  opacity: 0.8;
}
.text-red {
  color: #d32f2f;
}
</style>
