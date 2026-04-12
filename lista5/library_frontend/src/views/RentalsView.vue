<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PaginatedTable from '@/components/PaginatedTable.vue'
import type { Rental } from '@/types'
import * as rentalsApi from '@/api/rentals'
import * as bookCopiesApi from '@/api/bookCopies'
import * as readersApi from '@/api/readers'
import * as booksApi from '@/api/books'
import SearchSelect from '@/components/SearchSelect.vue'
import type { BookCopy, Reader, Book } from '@/types'

const rentals = ref<Rental[]>([])
const router = useRouter()
const bookCopies = ref<BookCopy[]>([])
const readers = ref<Reader[]>([])
const books = ref<Book[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({
  bookId: null as number | null,
  bookCopyId: null as number | null,
  readerId: null as number | null,
  rentalDate: '',
  returnDate: '' as string | null,
  returned: false,
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'bookTitle', label: 'Book' },
  { key: 'readerFirstName', label: 'Reader First Name' },
  { key: 'readerLastName', label: 'Reader Last Name' },
  { key: 'rentalDate', label: 'Rental Date' },
  { key: 'returned', label: 'Returned' },
]

onMounted(() => {
  loadRentals()
  loadBookCopies()
  loadReaders()
  loadBooks()
})

async function loadRentals() {
  rentals.value = await rentalsApi.getAll()
}

async function loadBookCopies() {
  bookCopies.value = await bookCopiesApi.getAll()
}

async function loadReaders() {
  readers.value = await readersApi.getAll()
}

async function loadBooks() {
  books.value = await booksApi.getAll()
}

function goToDetail(row: Record<string, any>) {
  router.push(`/rentals/${row.id}`)
}

// Compute display labels
const bookCopyOptions = computed(() =>
  bookCopies.value.map((c) => ({
    id: c.id,
    display: `#${c.id} - ${c.bookTitle}`,
  })),
)

const bookOptions = computed(() =>
  books.value.map((b) => ({
    id: b.id,
    display: `#${b.id} - ${b.title}`,
  })),
)

const readerOptions = computed(() =>
  readers.value.map((r) => ({
    id: r.id,
    display: `${r.firstName} ${r.lastName}`,
  })),
)

function openCreate() {
  editingId.value = null
  form.value = {
    bookId: null,
    bookCopyId: null,
    readerId: null,
    rentalDate: new Date().toISOString().slice(0, 16),
    returnDate: null,
    returned: false,
  }
  showForm.value = true
}

function openEdit(row: Record<string, any>) {
  editingId.value = row.id
  form.value = {
    bookId: null,
    bookCopyId: row.bookCopyId,
    readerId: row.readerId,
    rentalDate: row.rentalDate,
    returnDate: row.returnDate,
    returned: row.returned,
  }
  showForm.value = true
}

async function handleSubmit() {
  if (editingId.value !== null) {
    if (form.value.bookCopyId === null || form.value.readerId === null) return
    const payload = {
      bookCopyId: form.value.bookCopyId,
      readerId: form.value.readerId,
      rentalDate: form.value.rentalDate,
      returnDate: form.value.returnDate,
      returned: form.value.returned,
    }
    await rentalsApi.update(editingId.value, payload)
  } else {
    if (form.value.bookId === null || form.value.readerId === null) return
    await rentalsApi.rentBook(form.value.bookId, form.value.readerId)
  }
  showForm.value = false
  await loadRentals()
}

async function handleDelete(row: Record<string, any>) {
  if (confirm(`Delete rental #${row.id}?`)) {
    await rentalsApi.remove(row.id)
    await loadRentals()
  }
}

async function handleReturn(row: Record<string, any>) {
  await rentalsApi.returnBook(row.id)
  await loadRentals()
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Rentals</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Rental</button>
    </div>

    <div v-if="showForm" class="form-card">
      <h3>{{ editingId !== null ? 'Edit Rental' : 'New Rental' }}</h3>
      <form @submit.prevent="handleSubmit">
        <label v-if="editingId === null"
          >Book
          <SearchSelect
            v-model="form.bookId"
            :options="bookOptions"
            label="display"
            placeholder="Select a book"
            :reduce="(opt: any) => opt.id"
          />
        </label>
        <label v-if="editingId !== null"
          >Book Copy
          <SearchSelect
            v-model="form.bookCopyId"
            :options="bookCopyOptions"
            label="display"
            placeholder="Select a book copy"
            :reduce="(opt: any) => opt.id"
          />
        </label>
        <label
          >Reader
          <SearchSelect
            v-model="form.readerId"
            :options="readerOptions"
            label="display"
            placeholder="Select a reader"
            :reduce="(opt: any) => opt.id"
          />
        </label>
        <div class="row" v-if="editingId !== null">
          <label
            >Rental Date
            <input v-model="form.rentalDate" type="datetime-local" required />
          </label>
          <label
            >Return Date
            <input v-model="form.returnDate" type="datetime-local" />
          </label>
        </div>
        <label class="checkbox-label" v-if="editingId !== null">
          <input type="checkbox" v-model="form.returned" />
          Returned
        </label>
        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="(editingId === null && (form.bookId === null || form.readerId === null)) || (editingId !== null && (form.bookCopyId === null || form.readerId === null))"
          >
            Save
          </button>
          <button
            v-if="editingId !== null && !form.returned"
            type="button"
            class="btn btn-return"
            @click="handleReturn({ id: editingId })"
          >
            Return Book
          </button>
          <button type="button" class="btn" @click="showForm = false">Cancel</button>
        </div>
      </form>
    </div>

    <PaginatedTable
      :columns="columns"
      :rows="rentals"
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
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.checkbox-label {
  flex-direction: row !important;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
th,
td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
th {
  background-color: #3498db;
  color: #fff;
  font-weight: 600;
}
tr:hover {
  background-color: #f0f4f8;
}
.empty {
  text-align: center;
  color: #999;
  padding: 2rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
}

.badge-yes {
  color: #27ae60;
  font-weight: 600;
}
.badge-no {
  color: #e74c3c;
  font-weight: 600;
}

.btn {
  padding: 0.35rem 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  background: #fff;
}
.btn-primary {
  background-color: #3498db;
  color: #fff;
  border-color: #3498db;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}
.btn-primary:hover {
  background-color: #2980b9;
}
.btn-edit {
  background-color: #f39c12;
  color: #fff;
  border-color: #f39c12;
}
.btn-edit:hover {
  background-color: #e67e22;
}
.btn-delete {
  background-color: #e74c3c;
  color: #fff;
  border-color: #e74c3c;
}
.btn-delete:hover {
  background-color: #c0392b;
}
.btn-return {
  background-color: #27ae60;
  color: #fff;
  border-color: #27ae60;
}
.btn-return:hover {
  background-color: #219a52;
}
</style>
