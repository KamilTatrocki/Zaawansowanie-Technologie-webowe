import type { BookCopy } from '@/types'

// --- MOCK DATA (replace with real API calls) ---
let mockBookCopies: BookCopy[] = [
    { id: 1, bookTitle: 'The Great Gatsby', isAvailable: true },
    { id: 2, bookTitle: 'The Great Gatsby', isAvailable: false },
    { id: 3, bookTitle: '1984', isAvailable: true },
    { id: 4, bookTitle: 'To Kill a Mockingbird', isAvailable: true },
    { id: 5, bookTitle: 'Pride and Prejudice', isAvailable: false },
    { id: 6, bookTitle: 'The Hobbit', isAvailable: true },
]
let nextId = 7

export async function getAll(): Promise<BookCopy[]> {
    return [...mockBookCopies]
}

export async function getById(id: number): Promise<BookCopy | undefined> {
    return mockBookCopies.find((bc) => bc.id === id)
}

export async function create(data: Omit<BookCopy, 'id'>): Promise<BookCopy> {
    const copy: BookCopy = { ...data, id: nextId++ }
    mockBookCopies.push(copy)
    return copy
}

export async function update(id: number, data: Omit<BookCopy, 'id'>): Promise<BookCopy> {
    const index = mockBookCopies.findIndex((bc) => bc.id === id)
    if (index === -1) throw new Error('Book copy not found')
    mockBookCopies[index] = { ...data, id }
    return mockBookCopies[index]
}

export async function remove(id: number): Promise<void> {
    mockBookCopies = mockBookCopies.filter((bc) => bc.id !== id)
}
