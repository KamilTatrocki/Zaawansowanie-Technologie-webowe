<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'
import ToastNotifications from './components/ToastNotifications.vue'

type AppState = 'loading' | 'ready' | 'error'
const appState = ref<AppState>('loading')
const errorMessage = ref('')

const TIMEOUT_MS = 8000
const MIN_LOADING_MS = 1000
const HEALTH_POLL_MS = 10000

let healthTimer: ReturnType<typeof setInterval> | null = null

async function checkConnection(): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch('/api/authors?page=0&size=1', { signal: controller.signal })
    clearTimeout(timer)
    return res.ok || res.status < 500
  } catch (e) {
    clearTimeout(timer)
    return false
  }
}

async function tryConnect() {
  appState.value = 'loading'
  errorMessage.value = ''

  const [ok] = await Promise.all([
    checkConnection(),
    new Promise<void>((r) => setTimeout(r, MIN_LOADING_MS)),
  ])

  if (ok) {
    appState.value = 'ready'
    startHealthPolling()
  } else {
    errorMessage.value = 'Cannot reach the server or database. Please check that the backend is running.'
    appState.value = 'error'
    stopHealthPolling()
  }
}

function startHealthPolling() {
  stopHealthPolling()
  healthTimer = setInterval(async () => {
    const ok = await checkConnection()
    if (!ok && appState.value === 'ready') {
      errorMessage.value = 'Connection to the server was lost. Please retry when the server is back online.'
      appState.value = 'error'
      stopHealthPolling()
    }
  }, HEALTH_POLL_MS)
}

function stopHealthPolling() {
  if (healthTimer !== null) {
    clearInterval(healthTimer)
    healthTimer = null
  }
}

onMounted(() => tryConnect())
onUnmounted(() => stopHealthPolling())
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
      <button class="retry-btn" @click="tryConnect()">Retry</button>
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
