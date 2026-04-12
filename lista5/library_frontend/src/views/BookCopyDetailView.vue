<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as bookCopiesApi from '@/api/bookCopies'
import * as rentalsApi from '@/api/rentals'
import type { BookCopy, Rental } from '@/types'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const copy = ref<BookCopy | null>(null)
const rentals = ref<Rental[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    copy.value = (await bookCopiesApi.getById(id)) || null
    if (copy.value) {
      const allRentals = await rentalsApi.getAll()
      rentals.value = allRentals.filter((r) => r.bookCopyId === copy.value?.id)
    }
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

function viewRental(id: number) {
  router.push(`/rentals/${id}`)
}
</script>

<template>
  <div class="detail-view">
    <div class="page-header">
      <h1>Book Copy Details</h1>
      <button class="btn" @click="goBack">Back</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="!copy" class="error">Copy not found</div>
    <div v-else>
      <div class="info-card">
        <div class="info-group">
          <label>ID:</label>
          <span>{{ copy.id }}</span>
        </div>
        <div class="info-group">
          <label>Book:</label>
          <span>{{ copy.bookTitle }}</span>
        </div>
        <div class="info-group">
          <label>Status:</label>
          <span :class="copy.isAvailable ? 'available' : 'unavailable'">
            {{ copy.isAvailable ? 'Available' : 'Unavailable' }}
          </span>
        </div>
      </div>

      <div class="related-section">
        <h3>Rental History</h3>
        <div v-if="rentals.length === 0" class="empty">No rentals found.</div>
        <table v-else>
          <thead>
            <tr>
              <th>ID</th>
              <th>Reader</th>
              <th>Rental Date</th>
              <th>Returned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rental in rentals" :key="rental.id">
              <td>{{ rental.id }}</td>
              <td>{{ rental.readerFirstName }} {{ rental.readerLastName }}</td>
              <td>{{ rental.rentalDate }}</td>
              <td>{{ rental.returned ? 'Yes' : 'No' }}</td>
              <td>
                <button class="btn btn-view" @click="viewRental(rental.id)">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.info-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.info-group {
  display: flex;
  margin-bottom: 0.75rem;
}

.info-group label {
  font-weight: 600;
  width: 120px;
  color: #555;
}

.related-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
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
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
}

.btn-view {
  background-color: #3498db;
  color: #fff;
  border: none;
}

.available {
  color: #27ae60;
  font-weight: 600;
}
.unavailable {
  color: #e74c3c;
  font-weight: 600;
}

.empty {
  color: #7f8c8d;
  font-style: italic;
}
</style>
