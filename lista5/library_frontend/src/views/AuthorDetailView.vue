<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as authorsApi from '@/api/authors'
import * as booksApi from '@/api/books'
import type { Author, Book } from '@/types'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const author = ref<Author | null>(null)
const books = ref<Book[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    author.value = (await authorsApi.getById(id)) || null
    if (author.value) {
      const allBooks = await booksApi.getAll()
      books.value = allBooks.filter(
        (b) =>
          b.authorFirstName === author.value?.firstName &&
          b.authorLastName === author.value?.lastName,
      )
    }
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

function viewBook(id: number) {
  router.push(`/books/${id}`)
}
</script>

<template>
  <div class="detail-view">
    <div class="page-header">
      <h1>Author Details</h1>
      <button class="btn" @click="goBack">Back</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="!author" class="error">Author not found</div>
    <div v-else>
      <div class="info-card">
        <div class="info-group">
          <label>ID:</label>
          <span>{{ author.id }}</span>
        </div>
        <div class="info-group">
          <label>First Name:</label>
          <span>{{ author.firstName }}</span>
        </div>
        <div class="info-group">
          <label>Last Name:</label>
          <span>{{ author.lastName }}</span>
        </div>
      </div>

      <div class="related-section">
        <h3>Books by this Author</h3>
        <div v-if="books.length === 0" class="empty">No books found.</div>
        <table v-else>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Pages</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>{{ book.id }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.pages }}</td>
              <td>
                <button class="btn btn-view" @click="viewBook(book.id)">View</button>
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

.empty {
  color: #7f8c8d;
  font-style: italic;
}
</style>
