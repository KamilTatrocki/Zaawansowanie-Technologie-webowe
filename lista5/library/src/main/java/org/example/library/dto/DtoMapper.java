package org.example.library.dto;

import org.example.library.model.*;

public class DtoMapper {
    
    public static AuthorDto toDto(Author author) {
        if (author == null) return null;
        return AuthorDto.builder()
                .id(author.getId())
                .firstName(author.getFirstName())
                .lastName(author.getLastName())
                .build();
    }

    public static BookDto toDto(Book book) {
        if (book == null) return null;
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .authorFirstName(book.getAuthor() != null ? book.getAuthor().getFirstName() : null)
                .authorLastName(book.getAuthor() != null ? book.getAuthor().getLastName() : null)
                .pages(book.getPages())
                .build();
    }

    public static BookCopyDto toDto(BookCopy bookCopy) {
        if (bookCopy == null) return null;
        return BookCopyDto.builder()
                .id(bookCopy.getId())
                .bookTitle(bookCopy.getBook() != null ? bookCopy.getBook().getTitle() : null)
                .available(bookCopy.isAvailable())
                .build();
    }

    public static ReaderDto toDto(Reader reader) {
        if (reader == null) return null;
        return ReaderDto.builder()
                .id(reader.getId())
                .firstName(reader.getFirstName())
                .lastName(reader.getLastName())
                .build();
    }

    public static RentalDto toDto(Rental rental) {
        if (rental == null) return null;
        return RentalDto.builder()
                .id(rental.getId())
                .bookCopyId(rental.getBookCopy() != null ? rental.getBookCopy().getId() : null)
                .bookTitle(rental.getBookCopy() != null && rental.getBookCopy().getBook() != null ? rental.getBookCopy().getBook().getTitle() : null)
                .readerId(rental.getReader() != null ? rental.getReader().getId() : null)
                .readerFirstName(rental.getReader() != null ? rental.getReader().getFirstName() : null)
                .readerLastName(rental.getReader() != null ? rental.getReader().getLastName() : null)
                .rentalDate(rental.getRentalDate())
                .returnDate(rental.getReturnDate())
                .returned(rental.getReturned())
                .build();
    }
}
