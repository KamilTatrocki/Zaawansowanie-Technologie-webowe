<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PaginatedTable from '@/components/PaginatedTable.vue'
import type { Book, Author } from '@/types'
import * as booksApi from '@/api/books'
import * as authorsApi from '@/api/authors'
import SearchSelect from '@/components/SearchSelect.vue'

const books = ref<Book[]>([])
const currentPage = ref(0)
const totalPages = ref(1)
const router = useRouter()
const authors = ref<Author[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ title: '', authorId: null as number | null, pages: 0 })

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'authorFirstName', label: 'Author First Name' },
  { key: 'authorLastName', label: 'Author Last Name' },
  { key: 'pages', label: 'Pages' },
]

onMounted(() => {
  loadPage(0)
  loadAuthors()
})

async function loadPage(page: number) {
  const result = await booksApi.getPage(page)
  books.value = result.content
  currentPage.value = result.number
  totalPages.value = result.totalPages
}

async function loadAuthors() {
  authors.value = await authorsApi.getAll()
}

function goToDetail(row: Record<string, unknown>) {
  router.push(`/books/${row.id}`)
}

const authorOptions = computed(() =>
  authors.value.map((a) => ({
    id: a.id,
    display: `${a.firstName} ${a.lastName}`,
  })),
)

function openCreate() {
  editingId.value = null
  form.value = { title: '', authorId: null, pages: 0 }
  showForm.value = true
}

function openEdit(row: Record<string, unknown>) {
  editingId.value = row.id as number
  const author = authors.value.find(
    (a) => a.firstName === row.authorFirstName && a.lastName === row.authorLastName,
  )
  form.value = {
    title: row.title as string,
    authorId: author ? author.id : null,
    pages: row.pages as number,
  }
  showForm.value = true
}

async function handleSubmit() {
  if (form.value.authorId === null) return

  const payload = {
    title: form.value.title,
    authorId: form.value.authorId,
    pages: form.value.pages,
  }

  if (editingId.value !== null) {
    await booksApi.update(editingId.value, payload)
  } else {
    await booksApi.create(payload)
  }
  showForm.value = false
  await loadPage(currentPage.value)
}

async function handleDelete(row: Record<string, unknown>) {
  if (confirm(`Delete "${row.title}"?`)) {
    await booksApi.remove(row.id as number)
    await loadPage(currentPage.value)
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
        <label
          >Title
          <input v-model="form.title" required />
        </label>
        <label
          >Author
          <SearchSelect
            v-model="form.authorId"
            :options="authorOptions"
            label="display"
            placeholder="Select an author"
            :reduce="(opt: { id: number; display: string }) => opt.id"
          />
        </label>
        <label
          >Pages
          <input v-model.number="form.pages" type="number" min="1" required />
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="form.authorId === null">
            Save
          </button>
          <button type="button" class="btn" @click="showForm = false">Cancel</button>
        </div>
      </form>
    </div>

    <PaginatedTable
      :columns="columns"
      :rows="books"
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
