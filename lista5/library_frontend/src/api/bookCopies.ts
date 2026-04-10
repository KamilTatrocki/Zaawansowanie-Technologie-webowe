import type { BookCopy } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getAll(): Promise<BookCopy[]> {
    return fetchGET<BookCopy[]>('/api/book-copies')
}

export async function getById(id: number): Promise<BookCopy | undefined> {
    return fetchGET<BookCopy | undefined>(`/api/book-copies/${id}`)
}

export async function create(data: Omit<BookCopy, 'id'>): Promise<BookCopy> {
    return fetchPOST<BookCopy>(`/api/book-copies`, data)
}

export async function update(id: number, data: Omit<BookCopy, 'id'>): Promise<BookCopy> {
    return fetchPUT<BookCopy>(`/api/book-copies/${id}`, data)
}

export async function remove(id: number): Promise<void> {
    return fetchDELETE<void>(`/api/book-copies/${id}`)
}
