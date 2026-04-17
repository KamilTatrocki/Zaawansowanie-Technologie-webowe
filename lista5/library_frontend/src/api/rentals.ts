import type { Rental, RentalCreatePayload, Page } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT, fetchPATCH } from './apiUtils'

export async function getPage(page = 0, size = 5): Promise<Page<Rental>> {
  return fetchGET<Page<Rental>>(`/api/rentals?page=${page}&size=${size}`)
}

export async function getAll(): Promise<Rental[]> {
  const p = await getPage(0, 1000)
  return p.content
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

export async function returnBook(id: number): Promise<Rental> {
  return fetchPATCH<Rental>(`/api/rentals/${id}/return`, 'Book returned successfully')
}
