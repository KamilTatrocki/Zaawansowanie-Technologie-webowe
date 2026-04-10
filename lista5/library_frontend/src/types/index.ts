export interface Book {
    id: number
    title: string
    authorFirstName: string
    authorLastName: string
    pages: number
}

export interface Author {
    id: number
    firstName: string
    lastName: string
}

export interface Reader {
    id: number
    firstName: string
    lastName: string
}

export interface BookCopy {
    id: number
    bookTitle: string
    available: boolean
}

export interface BookCopyCreatePayload {
    book: {
        id: number
        title: string
        author: {
            id: number
            firstName: string
            lastName: string
        }
        pages: number
    }
    available: boolean
}

export interface Rental {
    id: number
    bookCopyId: number
    bookTitle: string
    readerId: number
    readerFirstName: string
    readerLastName: string
    rentalDate: string
    returnDate: string | null
    returned: boolean
}
