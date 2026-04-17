<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'
import ToastNotifications from './components/ToastNotifications.vue'

type AppState = 'loading' | 'ready' | 'error'
const appState = ref<AppState>('loading')
const errorMessage = ref('')

const TIMEOUT_MS = 8000

onMounted(async () => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch('/api/authors?page=0&size=1', { signal: controller.signal })
    clearTimeout(timer)
    if (res.ok || res.status < 500) {
      appState.value = 'ready'
    } else {
      errorMessage.value = `Server responded with status ${res.status}. The database may be unavailable.`
      appState.value = 'error'
    }
  } catch (e: unknown) {
    clearTimeout(timer)
    if (e instanceof Error && e.name === 'AbortError') {
      errorMessage.value = 'Connection timed out. The server did not respond within 8 seconds.'
    } else {
      errorMessage.value = 'Cannot reach the server. Please check that the backend is running.'
    }
    appState.value = 'error'
  }
})
</script>

<template>
  <!-- Loading screen -->
  <div v-if="appState === 'loading'" class="splash">
    <div class="splash-inner">
      <div class="spinner"></div>
      <h2>Connecting to database…</h2>
      <p>Please wait while the library system starts up.</p>
    </div>
  </div>

  <!-- Error screen -->
  <div v-else-if="appState === 'error'" class="splash splash-error">
    <div class="splash-inner">
      <div class="error-icon">⚠️</div>
      <h2>Unable to Connect</h2>
      <p>{{ errorMessage }}</p>
      <button class="retry-btn" @click="location.reload()">Retry</button>
    </div>
  </div>

  <!-- Normal app -->
  <template v-else>
    <AppLayout>
      <RouterView />
    </AppLayout>
    <ToastNotifications />
  </template>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%);
  z-index: 9999;
}

.splash-error {
  background: linear-gradient(135deg, #b71c1c 0%, #c62828 50%, #d32f2f 100%);
}

.splash-inner {
  text-align: center;
  color: #fff;
  padding: 2rem;
}

.splash-inner h2 {
  font-size: 1.8rem;
  margin: 1rem 0 0.5rem;
  font-weight: 700;
}

.splash-inner p {
  font-size: 1rem;
  opacity: 0.85;
  margin: 0;
}

.error-icon {
  font-size: 4rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.35);
}
</style>
