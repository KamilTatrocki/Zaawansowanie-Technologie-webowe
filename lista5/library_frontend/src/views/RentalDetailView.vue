<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as rentalsApi from '@/api/rentals'
import type { Rental } from '@/types'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const rental = ref<Rental | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    rental.value = await rentalsApi.getById(id) || null
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

function viewBookCopy(id: number) {
  router.push(`/book-copies/${id}`)
}

function viewReader(id: number) {
  router.push(`/readers/${id}`)
}
</script>

<template>
  <div class="detail-view">
    <div class="page-header">
      <h1>Rental Details</h1>
      <button class="btn" @click="goBack">Back</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="!rental" class="error">Rental not found</div>
    <div v-else>
      <div class="info-card">
        <div class="info-group">
          <label>ID:</label>
          <span>{{ rental.id }}</span>
        </div>
        <div class="info-group">
          <label>Book Copy ID:</label>
          <span class="link" @click="viewBookCopy(rental.bookCopyId)">{{ rental.bookCopyId }} ({{ rental.bookTitle }})</span>
        </div>
        <div class="info-group">
          <label>Reader:</label>
          <span class="link" @click="viewReader(rental.readerId)">{{ rental.readerFirstName }} {{ rental.readerLastName }} (ID: {{ rental.readerId }})</span>
        </div>
        <div class="info-group">
          <label>Rental Date:</label>
          <span>{{ rental.rentalDate }}</span>
        </div>
        <div class="info-group">
          <label>Return Date:</label>
          <span>{{ rental.returnDate || 'N/A' }}</span>
        </div>
        <div class="info-group">
          <label>Returned:</label>
          <span :class="rental.returned ? 'success' : 'warning'">
            {{ rental.returned ? 'Yes' : 'No' }}
          </span>
        </div>
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
  width: 140px;
  color: #555;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
}

.link {
  color: #3498db;
  cursor: pointer;
  text-decoration: underline;
}

.link:hover {
  color: #2980b9;
}

.success { color: #27ae60; font-weight: 600; }
.warning { color: #e67e22; font-weight: 600; }
</style>
