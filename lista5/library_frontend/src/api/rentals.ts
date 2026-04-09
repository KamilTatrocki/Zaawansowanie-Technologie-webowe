import type { Rental } from '@/types'

// --- MOCK DATA (replace with real API calls) ---
let mockRentals: Rental[] = [
    {
        id: 1, bookCopyId: 2, bookTitle: 'The Great Gatsby', readerId: 1,
        readerFirstName: 'Jan', readerLastName: 'Kowalski',
        rentalDate: '2025-03-01T10:00:00', returnDate: null, returned: false,
    },
    {
        id: 2, bookCopyId: 5, bookTitle: 'Pride and Prejudice', readerId: 2,
        readerFirstName: 'Anna', readerLastName: 'Nowak',
        rentalDate: '2025-02-15T14:30:00', returnDate: '2025-03-01T09:00:00', returned: true,
    },
    {
        id: 3, bookCopyId: 3, bookTitle: '1984', readerId: 3,
        readerFirstName: 'Piotr', readerLastName: 'Wiśniewski',
        rentalDate: '2025-03-10T08:00:00', returnDate: null, returned: false,
    },
]
let nextId = 4

export async function getAll(): Promise<Rental[]> {
    return [...mockRentals]
}

export async function getById(id: number): Promise<Rental | undefined> {
    return mockRentals.find((r) => r.id === id)
}

export async function create(data: Omit<Rental, 'id'>): Promise<Rental> {
    const rental: Rental = { ...data, id: nextId++ }
    mockRentals.push(rental)
    return rental
}

export async function update(id: number, data: Omit<Rental, 'id'>): Promise<Rental> {
    const index = mockRentals.findIndex((r) => r.id === id)
    if (index === -1) throw new Error('Rental not found')
    mockRentals[index] = { ...data, id }
    return mockRentals[index]
}

export async function remove(id: number): Promise<void> {
    mockRentals = mockRentals.filter((r) => r.id !== id)
}

// Extra rental-specific actions
export async function rentBook(bookCopyId: number, readerId: number): Promise<Rental> {
    const rental: Rental = {
        id: nextId++,
        bookCopyId,
        bookTitle: 'Unknown',
        readerId,
        readerFirstName: 'Unknown',
        readerLastName: 'Unknown',
        rentalDate: new Date().toISOString(),
        returnDate: null,
        returned: false,
    }
    mockRentals.push(rental)
    return rental
}

export async function returnBook(id: number): Promise<Rental> {
    const rental = mockRentals.find((r) => r.id === id)
    if (!rental) throw new Error('Rental not found')
    rental.returned = true
    rental.returnDate = new Date().toISOString()
    return { ...rental }
}
