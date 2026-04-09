<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PaginatedTable from '@/components/PaginatedTable.vue'
import type { Book } from '@/types'
import * as booksApi from '@/api/books'

const books = ref<Book[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ title: '', authorFirstName: '', authorLastName: '', pages: 0 })

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'authorFirstName', label: 'Author First Name' },
  { key: 'authorLastName', label: 'Author Last Name' },
  { key: 'pages', label: 'Pages' },
]

onMounted(loadBooks)

async function loadBooks() {
  books.value = await booksApi.getAll()
}

function openCreate() {
  editingId.value = null
  form.value = { title: '', authorFirstName: '', authorLastName: '', pages: 0 }
  showForm.value = true
}

function openEdit(row: Record<string, any>) {
  editingId.value = row.id
  form.value = {
    title: row.title,
    authorFirstName: row.authorFirstName,
    authorLastName: row.authorLastName,
    pages: row.pages,
  }
  showForm.value = true
}

async function handleSubmit() {
  if (editingId.value !== null) {
    await booksApi.update(editingId.value, form.value)
  } else {
    await booksApi.create(form.value)
  }
  showForm.value = false
  await loadBooks()
}

async function handleDelete(row: Record<string, any>) {
  if (confirm(`Delete "${row.title}"?`)) {
    await booksApi.remove(row.id)
    await loadBooks()
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Books</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Book</button>
    </div>

    <div v-if="showForm" class="form-card">
      <h3>{{ editingId !== null ? 'Edit Book' : 'New Book' }}</h3>
      <form @submit.prevent="handleSubmit">
        <label>Title
          <input v-model="form.title" required />
        </label>
        <label>Author First Name
          <input v-model="form.authorFirstName" required />
        </label>
        <label>Author Last Name
          <input v-model="form.authorLastName" required />
        </label>
        <label>Pages
          <input v-model.number="form.pages" type="number" min="1" required />
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn" @click="showForm = false">Cancel</button>
        </div>
      </form>
    </div>

    <PaginatedTable
      :columns="columns"
      :rows="books"
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
