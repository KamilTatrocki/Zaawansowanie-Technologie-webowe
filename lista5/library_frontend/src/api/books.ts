import type { Book, BookCreatePayload } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getAll(): Promise<Book[]> {
  return fetchGET<Book[]>('/api/books')
}

export async function getById(id: number): Promise<Book | undefined> {
  return fetchGET<Book | undefined>(`/api/books/${id}`)
}

export async function create(data: BookCreatePayload): Promise<Book> {
  return fetchPOST<Book>(`/api/books`, data, 'Book created successfully')
}

export async function update(id: number, data: BookCreatePayload): Promise<Book> {
  return fetchPUT<Book>(`/api/books/${id}`, data, 'Book updated successfully')
}

export async function remove(id: number): Promise<void> {
  return fetchDELETE<void>(`/api/books/${id}`, 'Book deleted successfully')
}
