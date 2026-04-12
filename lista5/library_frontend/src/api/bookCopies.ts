import type { BookCopy, BookCopyCreatePayload } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getAll(): Promise<BookCopy[]> {
  return fetchGET<BookCopy[]>('/api/book-copies')
}

export async function getById(id: number): Promise<BookCopy | undefined> {
  return fetchGET<BookCopy | undefined>(`/api/book-copies/${id}`)
}

export async function create(data: BookCopyCreatePayload): Promise<BookCopy> {
  console.log(data)
  return fetchPOST<BookCopy>(`/api/book-copies`, data, 'Book copy created successfully')
}

export async function update(id: number, data: BookCopyCreatePayload): Promise<BookCopy> {
  console.log(data)
  return fetchPUT<BookCopy>(`/api/book-copies/${id}`, data, 'Book copy updated successfully')
}

export async function remove(id: number): Promise<void> {
  return fetchDELETE<void>(`/api/book-copies/${id}`, 'Book copy deleted successfully')
}
