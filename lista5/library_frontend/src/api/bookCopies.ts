import type { BookCopy, BookCopyCreatePayload, Page } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getPage(page = 0, size = 5): Promise<Page<BookCopy>> {
  return fetchGET<Page<BookCopy>>(`/api/bookCopies?page=${page}&size=${size}`)
}

export async function getAll(): Promise<BookCopy[]> {
  const p = await getPage(0, 1000)
  return p.content
}

export async function getById(id: number): Promise<BookCopy | undefined> {
  return fetchGET<BookCopy | undefined>(`/api/bookCopies/${id}`)
}

export async function create(data: BookCopyCreatePayload): Promise<BookCopy> {
  return fetchPOST<BookCopy>(`/api/bookCopies`, data, 'Book copy created successfully')
}

export async function update(id: number, data: BookCopyCreatePayload): Promise<BookCopy> {
  return fetchPUT<BookCopy>(`/api/bookCopies/${id}`, data, 'Book copy updated successfully')
}

export async function remove(id: number): Promise<void> {
  return fetchDELETE<void>(`/api/bookCopies/${id}`, 'Book copy deleted successfully')
}
