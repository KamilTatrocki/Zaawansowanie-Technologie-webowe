<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/books', label: 'Books' },
  { to: '/authors', label: 'Authors' },
  { to: '/readers', label: 'Readers' },
  { to: '/book-copies', label: 'Book Copies' },
  { to: '/rentals', label: 'Rentals' },
]
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>📚 Library</h2>
      </div>
      <nav>
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </aside>
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

nav {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.nav-link {
  padding: 0.75rem 1.25rem;
  color: #bdc3c7;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #34495e;
  color: #fff;
}

.nav-link.router-link-exact-active {
  background-color: #3498db;
  color: #fff;
}

.content {
  flex: 1;
  padding: 2rem;
  background-color: #f5f6fa;
  overflow-y: auto;
}
</style>
