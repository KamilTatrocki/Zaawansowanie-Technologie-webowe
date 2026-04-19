<script setup lang="ts">
import { toasts, removeToast } from '@/utils/toast'
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast-list">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        @click="removeToast(toast.id)"
      >
        <div class="toast-content">
          <span v-if="toast.type === 'success'" class="icon">✅</span>
          <span v-else-if="toast.type === 'error'" class="icon">❌</span>
          <span v-else class="icon">ℹ️</span>
          <p>{{ toast.message }}</p>
        </div>
        <button class="close-btn">&times;</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  min-width: 280px;
  max-width: 400px;
  padding: 1rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  border-left: 5px solid transparent;
  transition: transform 0.2s ease;
}

.toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-content p {
  margin: 0;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.4;
}

.icon {
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  line-height: 1;
  color: #999;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
}

.toast-success {
  border-left-color: #2ecc71;
}

.toast-error {
  border-left-color: #e74c3c;
}

.toast-info {
  border-left-color: #3498db;
}


.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
