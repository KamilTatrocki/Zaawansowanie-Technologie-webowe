import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason as { isHandled?: boolean } | null
  if (reason && reason.isHandled) {
    event.preventDefault()
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)


app.config.errorHandler = (err) => {
  if (err && (err as { isHandled?: boolean }).isHandled) return
  console.error(err)
}

app.mount('#app')
