package org.example.library.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.library.model.Book;
import org.example.library.model.BookCopy;
import org.example.library.model.Reader;
import org.example.library.model.Rental;
import org.example.library.repository.BookRepository;
import org.example.library.repository.ReaderRepository;
import org.example.library.repository.RentalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;
    private final ReaderRepository readerRepository;
    private final BookRepository bookRepository;

    @Transactional
    public Rental rentBook(Long bookId, Long userId){
        Reader reader = readerRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono czytelnika"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono książki"));

        BookCopy availableCopy = book.getCopies().stream()
                .filter(BookCopy::isAvailable)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Brak dostępnych egzemplarzy tej książki"));

        availableCopy.setAvailable(false);

        Rental rental = Rental.builder()
                .bookCopy(availableCopy)
                .reader(reader)
                .rentalDate(LocalDateTime.now())
                .returned(false)
                .build();

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental returnBook(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono wypożyczenia"));

        if (rental.getReturned()) {
            throw new RuntimeException("Książka została już zrócona");
        }

        rental.setReturned(true);
        rental.setReturnDate(LocalDateTime.now());
        rental.getBookCopy().setAvailable(true);

        return rentalRepository.save(rental);
    }

    public List<Rental> findAll() {
        return rentalRepository.findAll();
    }

    public Rental findById(Long id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono wypożyczenia"));
    }

    @Transactional
    public Rental save(Rental rental) {
        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental update(Long id, Rental rentalDetails) {
        Rental rental = findById(id);
        rental.setBookCopy(rentalDetails.getBookCopy());
        rental.setReader(rentalDetails.getReader());
        rental.setRentalDate(rentalDetails.getRentalDate());
        rental.setReturnDate(rentalDetails.getReturnDate());
        rental.setReturned(rentalDetails.getReturned());
        return rentalRepository.save(rental);
    }

    @Transactional
    public void delete(Long id) {
        rentalRepository.deleteById(id);
    }
}
