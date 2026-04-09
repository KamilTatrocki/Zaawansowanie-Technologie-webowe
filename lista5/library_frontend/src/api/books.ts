import type { Book } from '@/types'

// --- MOCK DATA (replace with real API calls) ---
let mockBooks: Book[] = [
    { id: 1, title: 'The Great Gatsby', authorFirstName: 'F. Scott', authorLastName: 'Fitzgerald', pages: 180 },
    { id: 2, title: '1984', authorFirstName: 'George', authorLastName: 'Orwell', pages: 328 },
    { id: 3, title: 'To Kill a Mockingbird', authorFirstName: 'Harper', authorLastName: 'Lee', pages: 281 },
    { id: 4, title: 'Pride and Prejudice', authorFirstName: 'Jane', authorLastName: 'Austen', pages: 432 },
    { id: 5, title: 'The Catcher in the Rye', authorFirstName: 'J.D.', authorLastName: 'Salinger', pages: 234 },
    { id: 6, title: 'Brave New World', authorFirstName: 'Aldous', authorLastName: 'Huxley', pages: 311 },
    { id: 7, title: 'The Hobbit', authorFirstName: 'J.R.R.', authorLastName: 'Tolkien', pages: 310 },
    { id: 8, title: 'Fahrenheit 451', authorFirstName: 'Ray', authorLastName: 'Bradbury', pages: 194 },
]
let nextId = 9

export async function getAll(): Promise<Book[]> {
    return [...mockBooks]
}

export async function getById(id: number): Promise<Book | undefined> {
    return mockBooks.find((b) => b.id === id)
}

export async function create(data: Omit<Book, 'id'>): Promise<Book> {
    const book: Book = { ...data, id: nextId++ }
    mockBooks.push(book)
    return book
}

export async function update(id: number, data: Omit<Book, 'id'>): Promise<Book> {
    const index = mockBooks.findIndex((b) => b.id === id)
    if (index === -1) throw new Error('Book not found')
    mockBooks[index] = { ...data, id }
    return mockBooks[index]
}

export async function remove(id: number): Promise<void> {
    mockBooks = mockBooks.filter((b) => b.id !== id)
}
