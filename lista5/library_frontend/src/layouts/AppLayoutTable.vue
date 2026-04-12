<template>
  <div class="layout table">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>📚 Library</h2>
        <button class="mobile-toggle" @click="toggleNav">☰</button>
      </div>
      <nav :class="{ 'nav-open': isNavOpen }">
        <AppLayoutLinks @click="isNavOpen = false" />
      </nav>
    </aside>
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayoutLinks from './AppLayoutLinks.vue'

const isNavOpen = ref(false)

function toggleNav() {
  isNavOpen.value = !isNavOpen.value
}
</script>

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

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: #ecf0f1;
  font-size: 1.5rem;
  cursor: pointer;
}

nav {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.content {
  flex: 1;
  padding: 2rem;
  background-color: #f5f6fa;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: column;
  }

  .sidebar-header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mobile-toggle {
    display: block;
  }

  nav {
    display: none;
    flex-direction: column;
    padding: 0;
  }

  nav.nav-open {
    display: flex;
  }

  .content {
    padding: 1rem;
  }
}
</style>
