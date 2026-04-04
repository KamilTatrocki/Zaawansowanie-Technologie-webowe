package org.example.library.controller;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.library.model.Book;
import org.example.library.model.Reader;
import org.example.library.model.Rental;
import org.example.library.repository.BookRepository;
import org.example.library.repository.ReaderRepository;
import org.example.library.repository.RentalRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;
    private final ReaderRepository readerRepository;

    @Transactional
    public void rentBook(Long readerId, Long bookId) {
        Reader reader = readerRepository.findById(readerId).orElseThrow(() -> new RuntimeException("Reader not found"));
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));

    };
}
