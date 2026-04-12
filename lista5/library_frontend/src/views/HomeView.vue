<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as booksApi from '@/api/books'
import * as authorsApi from '@/api/authors'
import * as readersApi from '@/api/readers'
import * as bookCopiesApi from '@/api/bookCopies'
import * as rentalsApi from '@/api/rentals'
import type { Rental } from '@/types'

const stats = ref({ books: 0, authors: 0, readers: 0, bookCopies: 0, rentals: 0 })
const recentRentals = ref<Rental[]>([])
const router = useRouter()

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

  // Get 4 most recent rentals (simulate by slicing since no specific sorting API is clear)
  recentRentals.value = [...rentals].reverse().slice(0, 4)
})

function navigateTo(route: string) {
  router.push(route)
}
</script>

<template>
  <div class="home-dashboard">
    <header class="dashboard-header">
      <h1>Library Overview</h1>
      <p class="subtitle">Quick statistics and recent activity</p>
    </header>

    <div class="kpi-grid">
      <div class="kpi-card" @click="navigateTo('/books')">
        <div class="icon-wrapper bg-blue">📖</div>
        <div class="kpi-content">
          <span class="value">{{ stats.books }}</span>
          <span class="label">Total Books</span>
        </div>
      </div>
      <div class="kpi-card" @click="navigateTo('/readers')">
        <div class="icon-wrapper bg-green">👤</div>
        <div class="kpi-content">
          <span class="value">{{ stats.readers }}</span>
          <span class="label">Members</span>
        </div>
      </div>
      <div class="kpi-card" @click="navigateTo('/book-copies')">
        <div class="icon-wrapper bg-orange">📋</div>
        <div class="kpi-content">
          <span class="value">{{ stats.bookCopies }}</span>
          <span class="label">Copies</span>
        </div>
      </div>
      <div class="kpi-card" @click="navigateTo('/rentals')">
        <div class="icon-wrapper bg-purple">🔑</div>
        <div class="kpi-content">
          <span class="value">{{ stats.rentals }}</span>
          <span class="label">Rentals</span>
        </div>
      </div>
    </div>

    <div class="dashboard-layout">
      <section class="recent-activity">
        <h2>Recent Rentals</h2>
        <div class="table-responsive">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reader</th>
                <th>Book</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="recentRentals.length === 0">
                <td colspan="4" class="empty">No recent rentals.</td>
              </tr>
              <tr
                v-for="rental in recentRentals"
                :key="rental.id"
                @click="navigateTo(`/rentals/${rental.id}`)"
              >
                <td>#{{ rental.id }}</td>
                <td>{{ rental.readerFirstName }} {{ rental.readerLastName }}</td>
                <td>{{ rental.bookTitle }}</td>
                <td>
                  <span :class="['badge', rental.returned ? 'badge-returned' : 'badge-active']">
                    {{ rental.returned ? 'Returned' : 'Active' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button class="btn btn-action" @click="navigateTo('/rentals')">
            <span class="btn-icon">➕</span> New Rental
          </button>
          <button class="btn btn-action" @click="navigateTo('/books')">
            <span class="btn-icon">📚</span> Add Book
          </button>
          <button class="btn btn-action" @click="navigateTo('/readers')">
            <span class="btn-icon">👥</span> Register Reader
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1.5rem;
}

.bg-blue {
  background: #e3f2fd;
  color: #1976d2;
}
.bg-green {
  background: #e8f5e9;
  color: #388e3c;
}
.bg-orange {
  background: #fff3e0;
  color: #f57c00;
}
.bg-purple {
  background: #f3e5f5;
  color: #7b1fa2;
}

.kpi-content {
  display: flex;
  flex-direction: column;
}

.value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;
}

.label {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Dashboard Layout */
.dashboard-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

h2 {
  font-size: 1.25rem;
  color: #2c3e50;
  margin: 0 0 1.5rem;
  border-bottom: 2px solid #f5f6fa;
  padding-bottom: 0.5rem;
}

/* Table */
.dashboard-table {
  width: 100%;
  border-collapse: collapse;
}

.dashboard-table th,
.dashboard-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f5f6fa;
}

.dashboard-table th {
  color: #7f8c8d;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.dashboard-table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.dashboard-table tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-active {
  background: #fff3e0;
  color: #e67e22;
}
.badge-returned {
  background: #e8f5e9;
  color: #27ae60;
}

.empty {
  text-align: center;
  color: #95a5a6;
  font-style: italic;
  padding: 2rem;
}

/* Quick Actions */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.btn-icon {
  font-size: 1.25rem;
}

.btn-action:hover {
  background: #3498db;
  color: white;
  border-color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
}

@media (max-width: 900px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
}
</style>
