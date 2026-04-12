<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    columns: { key: string; label: string }[]
    rows: Record<string, any>[]
    pageSize?: number
  }>(),
  { pageSize: 5 },
)

defineEmits<{
  (e: 'view', row: Record<string, any>): void
  (e: 'edit', row: Record<string, any>): void
  (e: 'delete', row: Record<string, any>): void
}>()

const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.rows.length / props.pageSize)))

const paginatedRows = computed(() => {
  const sorted = [...props.rows].sort((a, b) => {
    if (a.id && b.id) return a.id - b.id
    return 0
  })
  const start = (currentPage.value - 1) * props.pageSize
  return sorted.slice(start, start + props.pageSize)
})

function formatValue(value: any) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return value
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<template>
  <div class="paginated-table">
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedRows.length === 0">
            <td :colspan="columns.length + 1" class="empty">No data available</td>
          </tr>
          <tr v-for="row in paginatedRows" :key="row.id">
            <td v-for="col in columns" :key="col.key">{{ formatValue(row[col.key]) }}</td>
            <td class="actions">
              <button class="btn btn-view" @click="$emit('view', row)">View</button>
              <button class="btn btn-edit" @click="$emit('edit', row)">Edit</button>
              <button class="btn btn-delete" @click="$emit('delete', row)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button :disabled="currentPage <= 1" @click="prevPage">← Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="nextPage">Next →</button>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #3498db;
  color: #fff;
  font-weight: 600;
}

tr:hover {
  background-color: #f0f4f8;
}

.empty {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.35rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-view {
  background-color: #3498db;
  color: #fff;
}

.btn-view:hover {
  background-color: #2980b9;
}

.btn-edit {
  background-color: #f39c12;
  color: #fff;
}

.btn-edit:hover {
  background-color: #e67e22;
}

.btn-delete {
  background-color: #e74c3c;
  color: #fff;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.4rem 1rem;
  border: 1px solid #bdc3c7;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  background-color: #ecf0f1;
}
</style>
