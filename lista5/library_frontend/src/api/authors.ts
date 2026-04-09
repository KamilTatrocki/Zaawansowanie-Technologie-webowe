import type { Author } from '@/types'

// --- MOCK DATA (replace with real API calls) ---
let mockAuthors: Author[] = [
    { id: 1, firstName: 'F. Scott', lastName: 'Fitzgerald' },
    { id: 2, firstName: 'George', lastName: 'Orwell' },
    { id: 3, firstName: 'Harper', lastName: 'Lee' },
    { id: 4, firstName: 'Jane', lastName: 'Austen' },
    { id: 5, firstName: 'J.D.', lastName: 'Salinger' },
    { id: 6, firstName: 'Aldous', lastName: 'Huxley' },
]
let nextId = 7

export async function getAll(): Promise<Author[]> {
    return [...mockAuthors]
}

export async function getById(id: number): Promise<Author | undefined> {
    return mockAuthors.find((a) => a.id === id)
}

export async function create(data: Omit<Author, 'id'>): Promise<Author> {
    const author: Author = { ...data, id: nextId++ }
    mockAuthors.push(author)
    return author
}

export async function update(id: number, data: Omit<Author, 'id'>): Promise<Author> {
    const index = mockAuthors.findIndex((a) => a.id === id)
    if (index === -1) throw new Error('Author not found')
    mockAuthors[index] = { ...data, id }
    return mockAuthors[index]
}

export async function remove(id: number): Promise<void> {
    mockAuthors = mockAuthors.filter((a) => a.id !== id)
}
