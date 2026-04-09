<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as booksApi from '@/api/books'
import * as authorsApi from '@/api/authors'
import * as readersApi from '@/api/readers'
import * as bookCopiesApi from '@/api/bookCopies'
import * as rentalsApi from '@/api/rentals'

const stats = ref({ books: 0, authors: 0, readers: 0, bookCopies: 0, rentals: 0 })

onMounted(async () => {
  const [books, authors, readers, copies, rentals] = await Promise.all([
    booksApi.getAll(),
    authorsApi.getAll(),
    readersApi.getAll(),
    bookCopiesApi.getAll(),
    rentalsApi.getAll(),
  ])
  stats.value = {
    books: books.length,
    authors: authors.length,
    readers: readers.length,
    bookCopies: copies.length,
    rentals: rentals.length,
  }
})
</script>

<template>
  <div class="home">
    <h1>Library Dashboard</h1>
    <p class="subtitle">Welcome to the Library Management System</p>

    <div class="cards">
      <div class="card">
        <div class="card-icon">📖</div>
        <div class="card-value">{{ stats.books }}</div>
        <div class="card-label">Books</div>
      </div>
      <div class="card">
        <div class="card-icon">✍️</div>
        <div class="card-value">{{ stats.authors }}</div>
        <div class="card-label">Authors</div>
      </div>
      <div class="card">
        <div class="card-icon">👤</div>
        <div class="card-value">{{ stats.readers }}</div>
        <div class="card-label">Readers</div>
      </div>
      <div class="card">
        <div class="card-icon">📋</div>
        <div class="card-value">{{ stats.bookCopies }}</div>
        <div class="card-label">Book Copies</div>
      </div>
      <div class="card">
        <div class="card-icon">🔑</div>
        <div class="card-value">{{ stats.rentals }}</div>
        <div class="card-label">Rentals</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 900px;
}

h1 {
  margin: 0 0 0.25rem;
  color: #2c3e50;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.25rem;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.card-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
</style>
