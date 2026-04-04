package org.example.library.config;

import org.example.library.model.*;
import org.example.library.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final ReaderRepository readerRepository;
    private final RentalRepository rentalRepository;

    public DataSeeder(AuthorRepository authorRepository, BookRepository bookRepository,
                      BookCopyRepository bookCopyRepository, ReaderRepository readerRepository,
                      RentalRepository rentalRepository) {
        this.authorRepository = authorRepository;
        this.bookRepository = bookRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.readerRepository = readerRepository;
        this.rentalRepository = rentalRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (authorRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        // Authors
        Author a1 = Author.builder().firstName("J.R.R.").lastName("Tolkien").build();
        Author a2 = Author.builder().firstName("George R.R.").lastName("Martin").build();
        Author a3 = Author.builder().firstName("J.K.").lastName("Rowling").build();
        Author a4 = Author.builder().firstName("Andrzej").lastName("Sapkowski").build();
        Author a5 = Author.builder().firstName("Agatha").lastName("Christie").build();
        authorRepository.saveAll(List.of(a1, a2, a3, a4, a5));

        // Books
        Book b1 = Book.builder().title("The Hobbit").author(a1).pages(310).build();
        Book b2 = Book.builder().title("A Game of Thrones").author(a2).pages(694).build();
        Book b3 = Book.builder().title("Harry Potter and the Sorcerer's Stone").author(a3).pages(223).build();
        Book b4 = Book.builder().title("The Last Wish").author(a4).pages(288).build();
        Book b5 = Book.builder().title("Murder on the Orient Express").author(a5).pages(256).build();
        bookRepository.saveAll(List.of(b1, b2, b3, b4, b5));

        // Book Copies
        BookCopy c1 = BookCopy.builder().book(b1).isAvailable(true).build();
        BookCopy c2 = BookCopy.builder().book(b1).isAvailable(false).build();
        BookCopy c3 = BookCopy.builder().book(b2).isAvailable(true).build();
        BookCopy c4 = BookCopy.builder().book(b3).isAvailable(false).build();
        BookCopy c5 = BookCopy.builder().book(b4).isAvailable(true).build();
        bookCopyRepository.saveAll(List.of(c1, c2, c3, c4, c5));

        // Readers
        Reader r1 = Reader.builder().firstName("John").lastName("Doe").build();
        Reader r2 = Reader.builder().firstName("Jane").lastName("Smith").build();
        Reader r3 = Reader.builder().firstName("Alice").lastName("Johnson").build();
        Reader r4 = Reader.builder().firstName("Bob").lastName("Williams").build();
        Reader r5 = Reader.builder().firstName("Charlie").lastName("Brown").build();
        readerRepository.saveAll(List.of(r1, r2, r3, r4, r5));

        // Rentals
        Rental rnt1 = Rental.builder().bookCopy(c2).reader(r1).rentalDate(LocalDateTime.now().minusDays(10)).returned(false).build();
        Rental rnt2 = Rental.builder().bookCopy(c4).reader(r2).rentalDate(LocalDateTime.now().minusDays(5)).returned(false).build();
        Rental rnt3 = Rental.builder().bookCopy(c1).reader(r3).rentalDate(LocalDateTime.now().minusDays(20)).returnDate(LocalDateTime.now().minusDays(2)).returned(true).build();
        Rental rnt4 = Rental.builder().bookCopy(c3).reader(r4).rentalDate(LocalDateTime.now().minusDays(15)).returnDate(LocalDateTime.now().minusDays(1)).returned(true).build();
        Rental rnt5 = Rental.builder().bookCopy(c5).reader(r5).rentalDate(LocalDateTime.now().minusDays(30)).returnDate(LocalDateTime.now().minusDays(10)).returned(true).build();
        rentalRepository.saveAll(List.of(rnt1, rnt2, rnt3, rnt4, rnt5));
    }
}
