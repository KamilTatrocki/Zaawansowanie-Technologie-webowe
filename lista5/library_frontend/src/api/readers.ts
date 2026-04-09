import type { Reader } from '@/types'

// --- MOCK DATA (replace with real API calls) ---
let mockReaders: Reader[] = [
    { id: 1, firstName: 'Jan', lastName: 'Kowalski' },
    { id: 2, firstName: 'Anna', lastName: 'Nowak' },
    { id: 3, firstName: 'Piotr', lastName: 'Wiśniewski' },
    { id: 4, firstName: 'Maria', lastName: 'Zielińska' },
]
let nextId = 5

export async function getAll(): Promise<Reader[]> {
    return [...mockReaders]
}

export async function getById(id: number): Promise<Reader | undefined> {
    return mockReaders.find((r) => r.id === id)
}

export async function create(data: Omit<Reader, 'id'>): Promise<Reader> {
    const reader: Reader = { ...data, id: nextId++ }
    mockReaders.push(reader)
    return reader
}

export async function update(id: number, data: Omit<Reader, 'id'>): Promise<Reader> {
    const index = mockReaders.findIndex((r) => r.id === id)
    if (index === -1) throw new Error('Reader not found')
    mockReaders[index] = { ...data, id }
    return mockReaders[index]
}

export async function remove(id: number): Promise<void> {
    mockReaders = mockReaders.filter((r) => r.id !== id)
}
