<script setup lang="ts">
import { RouterLink } from 'vue-router'

const emit = defineEmits(['click'])

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/books', label: 'Books' },
  { to: '/authors', label: 'Authors' },
  { to: '/readers', label: 'Readers' },
  { to: '/book-copies', label: 'Book Copies' },
  { to: '/rentals', label: 'Rentals' },
  { to: '/test', label: 'Test Default Layout' }
]
</script>

<template>
  <div class="nav-links">
    <RouterLink
      v-for="link in navLinks"
      :key="link.to"
      :to="link.to"
      class="nav-link"
      @click="$emit('click')"
    >
      {{ link.label }}
    </RouterLink>
  </div>
</template>

<style scoped>
.nav-links {
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

@media (max-width: 768px) {
  .nav-link {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #34495e;
  }
}
</style>
