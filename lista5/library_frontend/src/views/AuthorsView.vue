<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PaginatedTable from '@/components/PaginatedTable.vue'
import type { Author } from '@/types'
import * as authorsApi from '@/api/authors'

const authors = ref<Author[]>([])
const router = useRouter()
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ firstName: '', lastName: '' })

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
]

onMounted(loadAuthors)

async function loadAuthors() {
  authors.value = await authorsApi.getAll()
}

function goToDetail(row: Record<string, any>) {
  router.push(`/authors/${row.id}`)
}

function openCreate() {
  editingId.value = null
  form.value = { firstName: '', lastName: '' }
  showForm.value = true
}

function openEdit(row: Record<string, any>) {
  editingId.value = row.id
  form.value = { firstName: row.firstName, lastName: row.lastName }
  showForm.value = true
}

async function handleSubmit() {
  if (editingId.value !== null) {
    await authorsApi.update(editingId.value, form.value)
  } else {
    await authorsApi.create(form.value)
  }
  showForm.value = false
  await loadAuthors()
}

async function handleDelete(row: Record<string, any>) {
  if (confirm(`Delete "${row.firstName} ${row.lastName}"?`)) {
    await authorsApi.remove(row.id)
    await loadAuthors()
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Authors</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Author</button>
    </div>

    <div v-if="showForm" class="form-card">
      <h3>{{ editingId !== null ? 'Edit Author' : 'New Author' }}</h3>
      <form @submit.prevent="handleSubmit">
        <label>First Name
          <input v-model="form.firstName" required />
        </label>
        <label>Last Name
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
      :rows="authors"
      @view="goToDetail"
      @edit="openEdit"
      @delete="handleDelete"
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
.page-header h1 { margin: 0; color: #2c3e50; }
.form-card {
  background: #fff; padding: 1.5rem; border-radius: 8px;
  margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.form-card h3 { margin: 0 0 1rem; }
form { display: flex; flex-direction: column; gap: 0.75rem; }
label { display: flex; flex-direction: column; font-size: 0.9rem; color: #555; }
input { margin-top: 0.25rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.95rem; }
.form-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.btn { padding: 0.5rem 1rem; border: 1px solid #bdc3c7; border-radius: 4px; cursor: pointer; font-size: 0.9rem; background: #fff; }
.btn-primary { background-color: #3498db; color: #fff; border-color: #3498db; }
.btn-primary:hover { background-color: #2980b9; }
</style>
