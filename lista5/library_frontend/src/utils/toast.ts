import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export const toasts = ref<Toast[]>([])

export function addToast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).substring(2, 9)
  toasts.value.push({ id, message, type })

  // Auto-dismiss after 3.5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 3500)
}

export function removeToast(id: string) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}
