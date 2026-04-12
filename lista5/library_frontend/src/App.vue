<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'
import ToastNotifications from './components/ToastNotifications.vue'
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <ToastNotifications />
</template>
