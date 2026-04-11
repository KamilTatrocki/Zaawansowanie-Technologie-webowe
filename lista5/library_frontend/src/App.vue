<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
import ToastNotifications from './components/ToastNotifications.vue'
</script>

<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
  <ToastNotifications />
</template>
