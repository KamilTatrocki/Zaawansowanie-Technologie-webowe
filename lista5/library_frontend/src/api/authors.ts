import type { Author } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getAll(): Promise<Author[]> {
  return fetchGET<Author[]>('/api/authors')
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
