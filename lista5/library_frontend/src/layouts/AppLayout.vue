<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup lang="ts">
import AppLayoutDefault from './AppLayoutDefault.vue'
import { markRaw, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const layout = ref(markRaw(AppLayoutDefault))
const route = useRoute()
let currentLayoutName = 'AppLayoutDefault'

watch(
  () => route.meta,
  async meta => {
    const nextLayoutName = (meta.layout as string) || 'AppLayoutDefault'
    if (nextLayoutName === currentLayoutName) return

    try {
      const component = await import(`./${nextLayoutName}.vue`)
      layout.value = markRaw(component.default || component)
      currentLayoutName = nextLayoutName
    } catch (e) {
      layout.value = markRaw(AppLayoutDefault)
      currentLayoutName = 'AppLayoutDefault'
    }
  },
  { immediate: true }
)
</script>
