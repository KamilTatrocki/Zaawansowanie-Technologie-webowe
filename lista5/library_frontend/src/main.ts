import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Suppress API errors that have already been shown as toast notifications.
// ApiError sets isHandled = true after displaying a user-facing toast, so
// there is no need for these to appear as unhandled promise rejections in the console.
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason as { isHandled?: boolean } | null
  if (reason && reason.isHandled) {
    event.preventDefault()
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
