<script setup lang="ts">
import { computed } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

interface Props {
  modelValue: any
  options: any[]
  label: string
  placeholder?: string
  reduce?: (option: any) => any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const filteredOptions = (options: any[], search: string) => {
  return options
    .filter((option) => {
      const labelValue = option[props.label] || ''
      return String(labelValue).toLowerCase().includes(search.toLowerCase())
    })
    .slice(0, 10)
}
</script>

<template>
  <v-select
    v-model="internalValue"
    :options="options"
    :label="label"
    :placeholder="placeholder"
    :reduce="reduce"
    :filter="filteredOptions"
  >
    <template #no-options="{ search, searching }">
      <template v-if="searching">
        No results found for <em>{{ search }}</em
        >.
      </template>
      <em v-else style="opacity: 0.5">Start typing to search...</em>
    </template>


    <template #list-header v-if="false"></template>



  </v-select>
</template>

<style>

.v-select {
  margin-top: 0.25rem;
  background: white;
}

.vs__dropdown-toggle {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.25rem 0;
}

.vs__search::placeholder {
  color: #999;
}

.vs__clear,
.vs__open-indicator {
  fill: #34495e;
}

.vs__dropdown-menu {
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.vs__dropdown-option--highlight {
  background: #3498db;
}
</style>
