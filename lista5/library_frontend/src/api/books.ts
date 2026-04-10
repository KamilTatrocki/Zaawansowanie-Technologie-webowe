import type { Book } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getAll(): Promise<Book[]> {
    return fetchGET<Book[]>('/api/books')
}

export async function getById(id: number): Promise<Book | undefined> {
    return fetchGET<Book | undefined>(`/api/books/${id}`)
}

export async function create(data: Omit<Book, 'id'>): Promise<Book> {
    return fetchPOST<Book>(`/api/books`, data)
}

export async function update(id: number, data: Omit<Book, 'id'>): Promise<Book> {
    return fetchPUT<Book>(`/api/books/${id}`, data)
}

export async function remove(id: number): Promise<void> {
    return fetchDELETE<void>(`/api/books/${id}`)
}
