<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup lang="ts">
import appLayoutHome from './AppLayoutHome.vue'
import { markRaw, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const layout = ref(markRaw(appLayoutHome))
const route = useRoute()
let currentLayoutName = 'appLayoutHome'

watch(
  () => route.meta,
  async meta => {
    const nextLayoutName = (meta.layout as string) || 'appLayoutHome'
    if (nextLayoutName === currentLayoutName) return

    try {
      const component = await import(`./${nextLayoutName}.vue`)
      layout.value = markRaw(component.default || component)
      currentLayoutName = nextLayoutName
    } catch (e) {
      layout.value = markRaw(appLayoutHome)
      currentLayoutName = 'appLayoutHome'
    }
  },
  { immediate: true }
)
</script>
