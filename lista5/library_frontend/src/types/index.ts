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
  isAvailable: boolean
}

export interface BookCopyCreatePayload {
  bookId: number
  isAvailable: boolean
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

export interface RentalCreatePayload {
  bookCopyId: number
  readerId: number
  rentalDate: string
  returnDate: string | null
  returned: boolean
}

export interface BookCreatePayload {
  title: string
  authorId: number
  pages: number
}
