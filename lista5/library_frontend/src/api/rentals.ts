import type { Rental } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getAll(): Promise<Rental[]> {
    return fetchGET<Rental[]>('/api/rentals')
}

export async function getById(id: number): Promise<Rental | undefined> {
    return fetchGET<Rental | undefined>(`/api/rentals/${id}`)
}

export async function create(data: Omit<Rental, 'id'>): Promise<Rental> {
    return fetchPOST<Rental>(`/api/rentals`, data)
}

export async function update(id: number, data: Omit<Rental, 'id'>): Promise<Rental> {
    return fetchPUT<Rental>(`/api/rentals/${id}`, data)
}

export async function remove(id: number): Promise<void> {
    return fetchDELETE<void>(`/api/rentals/${id}`)
}

// Extra rental-specific actions
export async function rentBook(bookCopyId: number, readerId: number): Promise<Rental> {
    return fetchPOST<Rental>(`/api/rentals/rent`, { bookCopyId, readerId })
}

export async function returnBook(id: number): Promise<Rental> {
    return fetchPOST<Rental>(`/api/rentals/return`, { id })
}
