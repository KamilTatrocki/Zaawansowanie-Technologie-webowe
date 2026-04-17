import type { Author, Page } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getPage(page = 0, size = 5): Promise<Page<Author>> {
  return fetchGET<Page<Author>>(`/api/authors?page=${page}&size=${size}`)
}

export async function getAll(): Promise<Author[]> {
  const p = await getPage(0, 1000)
  return p.content
}

export async function getById(id: number): Promise<Author | undefined> {
  return fetchGET<Author | undefined>(`/api/authors/${id}`)
}

export async function create(data: Omit<Author, 'id'>): Promise<Author> {
  return fetchPOST<Author>(`/api/authors`, data, 'Author created successfully')
}

export async function update(id: number, data: Omit<Author, 'id'>): Promise<Author> {
  return fetchPUT<Author>(`/api/authors/${id}`, data, 'Author updated successfully')
}

export async function remove(id: number): Promise<void> {
  return fetchDELETE<void>(`/api/authors/${id}`, 'Author deleted successfully')
}
