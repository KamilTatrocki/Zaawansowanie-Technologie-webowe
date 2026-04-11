import type { Rental, RentalCreatePayload } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getAll(): Promise<Rental[]> {
    return fetchGET<Rental[]>('/api/rentals')
}

export async function getById(id: number): Promise<Rental | undefined> {
    return fetchGET<Rental | undefined>(`/api/rentals/${id}`)
}

export async function create(data: RentalCreatePayload): Promise<Rental> {
    return fetchPOST<Rental>(`/api/rentals`, data, 'Rental created successfully')
}

export async function update(id: number, data: RentalCreatePayload): Promise<Rental> {
    return fetchPUT<Rental>(`/api/rentals/${id}`, data, 'Rental updated successfully')
}

export async function remove(id: number): Promise<void> {
    return fetchDELETE<void>(`/api/rentals/${id}`, 'Rental deleted successfully')
}

// Extra rental-specific actions
export async function rentBook(bookCopyId: number, readerId: number): Promise<Rental> {
    return fetchPOST<Rental>(`/api/rentals/rent`, { bookCopyId, readerId }, 'Book rented successfully')
}

export async function returnBook(id: number): Promise<Rental> {
    return fetchPOST<Rental>(`/api/rentals/return`, { id }, 'Book returned successfully')
}
