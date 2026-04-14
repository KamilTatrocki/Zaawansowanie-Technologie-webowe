package org.example.library.service;

import lombok.RequiredArgsConstructor;
import org.example.library.model.BookCopy;
import org.example.library.repository.BookCopyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class BookCopyService {
    private final BookCopyRepository bookCopyRepository;

    public Page<BookCopy> findAll(Pageable pageable) {
        return bookCopyRepository.findAll(pageable);
    }

    public BookCopy findById(Long id) {
        return bookCopyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono egzemplarza"));
    }

    @Transactional
    public BookCopy save(BookCopy bookCopy) {
        return bookCopyRepository.save(bookCopy);
    }

    @Transactional
    public BookCopy update(Long id, BookCopy bookCopyDetails) {
        BookCopy bookCopy = findById(id);
        bookCopy.setBook(bookCopyDetails.getBook());
        bookCopy.setAvailable(bookCopyDetails.isAvailable());
        return bookCopyRepository.save(bookCopy);
    }

    @Transactional
    public void delete(Long id) {
        bookCopyRepository.deleteById(id);
    }
}
