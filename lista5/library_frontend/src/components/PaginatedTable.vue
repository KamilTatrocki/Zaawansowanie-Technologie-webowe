<script setup lang="ts">
defineProps<{
  columns: { key: string; label: string }[]
  rows: Record<string, unknown>[]
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'view', row: Record<string, unknown>): void
  (e: 'edit', row: Record<string, unknown>): void
  (e: 'delete', row: Record<string, unknown>): void
  (e: 'page-change', page: number): void
}>()

function formatValue(value: unknown): string | number | boolean {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value === null || value === undefined) return ''
  return value as string | number
}
</script>

<template>
  <div class="paginated-table">
    <!-- Desktop View (Table) -->
    <div class="table-responsive desktop-only">
      <table>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rows.length === 0">
            <td :colspan="columns.length + 1" class="empty">No data available</td>
          </tr>
          <tr v-for="row in rows" :key="row.id as number">
            <td v-for="col in columns" :key="col.key">{{ formatValue(row[col.key]) }}</td>
            <td class="actions">
              <button class="btn btn-view" @click="emit('view', row)">View</button>
              <button class="btn btn-edit" @click="emit('edit', row)">Edit</button>
              <button class="btn btn-delete" @click="emit('delete', row)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="mobile-only">
      <div v-if="rows.length === 0" class="empty-card">
        No data available
      </div>
      <div v-else class="cards-container">
        <div class="card" v-for="row in rows" :key="row.id as number">
          <div class="card-row" v-for="col in columns" :key="col.key">
            <span class="card-label">{{ col.label }}</span>
            <span class="card-value">{{ formatValue(row[col.key]) }}</span>
          </div>
          <div class="card-actions">
            <button class="btn btn-view" @click="emit('view', row)">View</button>
            <button class="btn btn-edit" @click="emit('edit', row)">Edit</button>
            <button class="btn btn-delete" @click="emit('delete', row)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button :disabled="currentPage <= 0" @click="emit('page-change', currentPage - 1)">← Prev</button>
      <span>Page {{ currentPage + 1 }} of {{ Math.max(1, totalPages) }}</span>
      <button :disabled="currentPage >= totalPages - 1" @click="emit('page-change', currentPage + 1)">Next →</button>
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

/* Responsive Layout Styles */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: block;
  }
  
  .empty-card {
    text-align: center;
    color: #999;
    padding: 2rem;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .cards-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .card {
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }
  
  .card-row:last-of-type {
    border-bottom: none;
    margin-bottom: 0.5rem;
  }

  .card-label {
    font-weight: 600;
    color: #555;
    flex: 1;
    margin-right: 1rem;
  }

  .card-value {
    text-align: right;
    flex: 2;
    word-break: break-word;
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #eee;
  }
  
  .card-actions .btn {
    flex: 1;
    text-align: center;
  }
}
</style>
