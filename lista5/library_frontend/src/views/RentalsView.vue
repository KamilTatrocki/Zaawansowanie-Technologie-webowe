<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PaginatedTable from '@/components/PaginatedTable.vue'
import type { Rental } from '@/types'
import * as rentalsApi from '@/api/rentals'
import * as bookCopiesApi from '@/api/bookCopies'
import * as readersApi from '@/api/readers'
import SearchSelect from '@/components/SearchSelect.vue'
import type { BookCopy, Reader } from '@/types'

const rentals = ref<Rental[]>([])
const currentPage = ref(0)
const totalPages = ref(1)
const router = useRouter()
const bookCopies = ref<BookCopy[]>([])
const readers = ref<Reader[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const originalReturned = ref(false)
const form = ref({
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
  loadPage(0)
  loadBookCopies()
  loadReaders()
})

/** Converts any ISO-8601 datetime string to the "yyyy-MM-ddTHH:mm" format
 *  required by <input type="datetime-local">. Handles fractional seconds of
 *  any precision returned by the backend (e.g. "2026-04-07T11:54:50.068037"). */
function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''
  // Slice to 16 characters: "yyyy-MM-ddTHH:mm"
  return iso.slice(0, 16)
}

async function loadPage(page: number) {
  const result = await rentalsApi.getPage(page)
  // Sort by ID ascending so the order stays stable after creates/edits
  rentals.value = [...result.content].sort((a, b) => a.id - b.id)
  currentPage.value = result.number
  totalPages.value = result.totalPages
}

async function loadBookCopies() {
  bookCopies.value = await bookCopiesApi.getAll()
}

async function loadReaders() {
  readers.value = await readersApi.getAll()
}

function goToDetail(row: Record<string, unknown>) {
  router.push(`/rentals/${row.id}`)
}

const bookCopyOptions = computed(() =>
  bookCopies.value.map((c) => ({
    id: c.id,
    display: `#${c.id} - ${c.bookTitle}`,
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
  originalReturned.value = false
  form.value = {
    bookCopyId: null,
    readerId: null,
    rentalDate: new Date().toISOString().slice(0, 16),
    returnDate: null,
    returned: false,
  }
  showForm.value = true
}

function openEdit(row: Record<string, unknown>) {
  editingId.value = row.id as number
  originalReturned.value = row.returned as boolean
  form.value = {
    bookCopyId: row.bookCopyId as number,
    readerId: row.readerId as number,
    rentalDate: toDatetimeLocal(row.rentalDate as string),
    returnDate: toDatetimeLocal(row.returnDate as string | null) || null,
    returned: row.returned as boolean,
  }
  showForm.value = true
}

async function handleSubmit() {
  if (form.value.bookCopyId === null || form.value.readerId === null) return

  const payload = {
    bookCopyId: form.value.bookCopyId,
    readerId: form.value.readerId,
    rentalDate: form.value.rentalDate,
    returnDate: form.value.returnDate || null,
    returned: form.value.returned,
  }

  if (editingId.value !== null) {
    await rentalsApi.update(editingId.value, payload)
  } else {
    await rentalsApi.create(payload)
  }
  showForm.value = false
  await loadPage(currentPage.value)
}

async function handleDelete(row: Record<string, unknown>) {
  if (confirm(`Delete rental #${row.id}?`)) {
    await rentalsApi.remove(row.id as number)
    await loadPage(currentPage.value)
  }
}

async function handleReturn(row: Record<string, unknown>) {
  await rentalsApi.returnBook(row.id as number)
  showForm.value = false
  await loadPage(currentPage.value)
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
        <label
          >Book Copy
          <SearchSelect
            v-model="form.bookCopyId"
            :options="bookCopyOptions"
            label="display"
            placeholder="Select a book copy"
            :reduce="(opt: { id: number; display: string }) => opt.id"
          />
        </label>
        <label
          >Reader
          <SearchSelect
            v-model="form.readerId"
            :options="readerOptions"
            label="display"
            placeholder="Select a reader"
            :reduce="(opt: { id: number; display: string }) => opt.id"
          />
        </label>
        <div class="row">
          <label
            >Rental Date
            <input v-model="form.rentalDate" type="datetime-local" required />
          </label>
          <label
            >Return Date
            <input v-model="form.returnDate" type="datetime-local" />
          </label>
        </div>
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.returned" />
          Returned
        </label>
        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="form.bookCopyId === null || form.readerId === null"
          >
            Save
          </button>
          <button
            v-if="editingId !== null && !originalReturned"
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
.btn-return {
  background-color: #27ae60;
  color: #fff;
  border-color: #27ae60;
}
.btn-return:hover {
  background-color: #219a52;
}
</style>
