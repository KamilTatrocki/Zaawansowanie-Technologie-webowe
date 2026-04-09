<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PaginatedTable from '@/components/PaginatedTable.vue'
import type { Rental } from '@/types'
import * as rentalsApi from '@/api/rentals'

const rentals = ref<Rental[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({
  bookCopyId: 0, bookTitle: '', readerId: 0,
  readerFirstName: '', readerLastName: '',
  rentalDate: '', returnDate: '' as string | null, returned: false,
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'bookTitle', label: 'Book' },
  { key: 'readerFirstName', label: 'Reader First Name' },
  { key: 'readerLastName', label: 'Reader Last Name' },
  { key: 'rentalDate', label: 'Rental Date' },
  { key: 'returned', label: 'Returned' },
]

onMounted(loadRentals)

async function loadRentals() {
  rentals.value = await rentalsApi.getAll()
}

function openCreate() {
  editingId.value = null
  form.value = {
    bookCopyId: 0, bookTitle: '', readerId: 0,
    readerFirstName: '', readerLastName: '',
    rentalDate: new Date().toISOString().slice(0, 16),
    returnDate: null, returned: false,
  }
  showForm.value = true
}

function openEdit(row: Record<string, any>) {
  editingId.value = row.id
  form.value = {
    bookCopyId: row.bookCopyId,
    bookTitle: row.bookTitle,
    readerId: row.readerId,
    readerFirstName: row.readerFirstName,
    readerLastName: row.readerLastName,
    rentalDate: row.rentalDate,
    returnDate: row.returnDate,
    returned: row.returned,
  }
  showForm.value = true
}

async function handleSubmit() {
  if (editingId.value !== null) {
    await rentalsApi.update(editingId.value, form.value)
  } else {
    await rentalsApi.create(form.value)
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
        <label>Book Copy ID
          <input v-model.number="form.bookCopyId" type="number" required />
        </label>
        <label>Book Title
          <input v-model="form.bookTitle" required />
        </label>
        <label>Reader ID
          <input v-model.number="form.readerId" type="number" required />
        </label>
        <label>Reader First Name
          <input v-model="form.readerFirstName" required />
        </label>
        <label>Reader Last Name
          <input v-model="form.readerLastName" required />
        </label>
        <label>Rental Date
          <input v-model="form.rentalDate" type="datetime-local" required />
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn" @click="showForm = false">Cancel</button>
        </div>
      </form>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rentals.length === 0">
            <td :colspan="columns.length + 1" class="empty">No data available</td>
          </tr>
          <tr v-for="rental in rentals" :key="rental.id">
            <td>{{ rental.id }}</td>
            <td>{{ rental.bookTitle }}</td>
            <td>{{ rental.readerFirstName }}</td>
            <td>{{ rental.readerLastName }}</td>
            <td>{{ rental.rentalDate }}</td>
            <td>
              <span :class="rental.returned ? 'badge-yes' : 'badge-no'">
                {{ rental.returned ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="actions">
              <button class="btn btn-edit" @click="openEdit(rental)">Edit</button>
              <button class="btn btn-delete" @click="handleDelete(rental)">Delete</button>
              <button
                v-if="!rental.returned"
                class="btn btn-return"
                @click="handleReturn(rental)"
              >
                Return
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.page-header h1 { margin: 0; color: #2c3e50; }
.form-card { background: #fff; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.form-card h3 { margin: 0 0 1rem; }
form { display: flex; flex-direction: column; gap: 0.75rem; }
label { display: flex; flex-direction: column; font-size: 0.9rem; color: #555; }
input { margin-top: 0.25rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.95rem; }
.form-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }

table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
th { background-color: #3498db; color: #fff; font-weight: 600; }
tr:hover { background-color: #f0f4f8; }
.empty { text-align: center; color: #999; padding: 2rem; }
.actions { display: flex; gap: 0.5rem; }

.badge-yes { color: #27ae60; font-weight: 600; }
.badge-no { color: #e74c3c; font-weight: 600; }

.btn { padding: 0.35rem 0.75rem; border: 1px solid #bdc3c7; border-radius: 4px; cursor: pointer; font-size: 0.85rem; background: #fff; }
.btn-primary { background-color: #3498db; color: #fff; border-color: #3498db; padding: 0.5rem 1rem; font-size: 0.9rem; }
.btn-primary:hover { background-color: #2980b9; }
.btn-edit { background-color: #f39c12; color: #fff; border-color: #f39c12; }
.btn-edit:hover { background-color: #e67e22; }
.btn-delete { background-color: #e74c3c; color: #fff; border-color: #e74c3c; }
.btn-delete:hover { background-color: #c0392b; }
.btn-return { background-color: #27ae60; color: #fff; border-color: #27ae60; }
.btn-return:hover { background-color: #219a52; }
</style>
