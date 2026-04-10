<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PaginatedTable from '@/components/PaginatedTable.vue'
import type { BookCopy } from '@/types'
import * as bookCopiesApi from '@/api/bookCopies'

const copies = ref<BookCopy[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ bookTitle: '', available: true })

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'bookTitle', label: 'Book Title' },
  { key: 'available', label: 'Available' },
]

onMounted(loadCopies)

async function loadCopies() {
  copies.value = await bookCopiesApi.getAll()
}

function openCreate() {
  editingId.value = null
  form.value = { bookTitle: '', available: true }
  showForm.value = true
}

function openEdit(row: Record<string, any>) {
  editingId.value = row.id
  form.value = { bookTitle: row.bookTitle, available: row.available }
  showForm.value = true
}

async function handleSubmit() {
  if (editingId.value !== null) {
    await bookCopiesApi.update(editingId.value, form.value)
  } else {
    await bookCopiesApi.create(form.value)
  }
  showForm.value = false
  await loadCopies()
}

async function handleDelete(row: Record<string, any>) {
  if (confirm(`Delete copy #${row.id}?`)) {
    await bookCopiesApi.remove(row.id)
    await loadCopies()
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Book Copies</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Copy</button>
    </div>

    <div v-if="showForm" class="form-card">
      <h3>{{ editingId !== null ? 'Edit Copy' : 'New Copy' }}</h3>
      <form @submit.prevent="handleSubmit">
        <label>Book Title
          <input v-model="form.bookTitle" required />
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.available" />
          Available
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn" @click="showForm = false">Cancel</button>
        </div>
      </form>
    </div>

    <PaginatedTable
      :columns="columns"
      :rows="copies"
      @edit="openEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.page-header h1 { margin: 0; color: #2c3e50; }
.form-card { background: #fff; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.form-card h3 { margin: 0 0 1rem; }
form { display: flex; flex-direction: column; gap: 0.75rem; }
label { display: flex; flex-direction: column; font-size: 0.9rem; color: #555; }
.checkbox-label { flex-direction: row; align-items: center; gap: 0.5rem; }
input[type="text"], input:not([type]) { margin-top: 0.25rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.95rem; }
.form-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.btn { padding: 0.5rem 1rem; border: 1px solid #bdc3c7; border-radius: 4px; cursor: pointer; font-size: 0.9rem; background: #fff; }
.btn-primary { background-color: #3498db; color: #fff; border-color: #3498db; }
.btn-primary:hover { background-color: #2980b9; }
</style>
