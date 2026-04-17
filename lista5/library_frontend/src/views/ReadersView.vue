<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PaginatedTable from '@/components/PaginatedTable.vue'
import type { Reader } from '@/types'
import * as readersApi from '@/api/readers'

const readers = ref<Reader[]>([])
const currentPage = ref(0)
const totalPages = ref(1)
const router = useRouter()
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ firstName: '', lastName: '' })

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
]

onMounted(() => loadPage(0))

async function loadPage(page: number) {
  const result = await readersApi.getPage(page)
  readers.value = result.content
  currentPage.value = result.number
  totalPages.value = result.totalPages
}

function goToDetail(row: Record<string, unknown>) {
  router.push(`/readers/${row.id}`)
}

function openCreate() {
  editingId.value = null
  form.value = { firstName: '', lastName: '' }
  showForm.value = true
}

function openEdit(row: Record<string, unknown>) {
  editingId.value = row.id as number
  form.value = { firstName: row.firstName as string, lastName: row.lastName as string }
  showForm.value = true
}

async function handleSubmit() {
  if (editingId.value !== null) {
    await readersApi.update(editingId.value, form.value)
  } else {
    await readersApi.create(form.value)
  }
  showForm.value = false
  await loadPage(currentPage.value)
}

async function handleDelete(row: Record<string, unknown>) {
  if (confirm(`Delete "${row.firstName} ${row.lastName}"?`)) {
    await readersApi.remove(row.id as number)
    await loadPage(currentPage.value)
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Readers</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Reader</button>
    </div>

    <div v-if="showForm" class="form-card">
      <h3>{{ editingId !== null ? 'Edit Reader' : 'New Reader' }}</h3>
      <form @submit.prevent="handleSubmit">
        <label
          >First Name
          <input v-model="form.firstName" required />
        </label>
        <label
          >Last Name
          <input v-model="form.lastName" required />
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn" @click="showForm = false">Cancel</button>
        </div>
      </form>
    </div>

    <PaginatedTable
      :columns="columns"
      :rows="readers"
      :current-page="currentPage"
      :total-pages="totalPages"
      @view="goToDetail"
      @edit="openEdit"
      @delete="handleDelete"
      @page-change="loadPage"
    />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.page-header h1 {
  margin: 0;
  color: #2c3e50;
}
.form-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.form-card h3 {
  margin: 0 0 1rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #555;
}
input {
  margin-top: 0.25rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
}
.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  background: #fff;
}
.btn-primary {
  background-color: #3498db;
  color: #fff;
  border-color: #3498db;
}
.btn-primary:hover {
  background-color: #2980b9;
}
</style>
