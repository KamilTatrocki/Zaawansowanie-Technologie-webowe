import type { Reader } from '@/types'
import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from './apiUtils'

export async function getAll(): Promise<Reader[]> {
    return fetchGET<Reader[]>('/api/readers')
}

export async function getById(id: number): Promise<Reader | undefined> {
    return fetchGET<Reader | undefined>(`/api/readers/${id}`)
}

export async function create(data: Omit<Reader, 'id'>): Promise<Reader> {
    return fetchPOST<Reader>(`/api/readers`, data, 'Reader created successfully')
}

export async function update(id: number, data: Omit<Reader, 'id'>): Promise<Reader> {
    return fetchPUT<Reader>(`/api/readers/${id}`, data, 'Reader updated successfully')
}

export async function remove(id: number): Promise<void> {
    return fetchDELETE<void>(`/api/readers/${id}`, 'Reader deleted successfully')
}
