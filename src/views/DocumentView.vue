<template>
  <div class="container">
    <TitleBar title="Generated Documents" :icon="Document20" />

    <!-- Filters -->
    <div class="filters">
      <input v-model="selectedDocument" placeholder="Filter by Document" />
      <input v-model="selectedFca" placeholder="Filter by FCA" />
      <input v-model="selectedGroup" placeholder="Filter by Group" />
      <input v-model="selectedUser" placeholder="Filter by User" />
      <button @click="fetchDocuments">Apply</button>
    </div>

    <!-- Table -->
    <DataTable
      :data="documents"
      :columns="columns"
      :sort="{ column: sort, order }"
      :onSort="toggleSort"
    >
      <template #actions="{ row }">
        <!-- <View20 title="View" class="action-icon" @click="viewDocument(row.id)" /> -->
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

function viewDocument(id) {
  router.push(`/preview?document=${id}`)
}

function deleteDocument(id) {
  if (confirm('Delete this document?')) {
    // Call delete API here
    alert(`Deleted document ${id}`)
  }
}

async function fetchDocuments() {
  const params = new URLSearchParams()
  if (selectedDocument.value) params.append('document_name', selectedDocument.value)
  if (selectedFca.value) params.append('fca_name', selectedFca.value)
  if (selectedUser.value) params.append('user_name', selectedUser.value)
  if (selectedGroup.value) params.append('group_name', selectedGroup.value)
  params.append('sort', sort.value)
  params.append('order', order.value)
  params.append('page', page.value)
  params.append('limit', limit.value)

  const res = await fetch(`https://api-ai-portraits.duckdns.org/generated_documents?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  documents.value = data.data
  total.value = data.total
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

onMounted(fetchDocuments)
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
.filters input {
  padding: 6px 10px;
  font-size: 0.9rem;
}
.filters button {
  padding: 6px 12px;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
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
