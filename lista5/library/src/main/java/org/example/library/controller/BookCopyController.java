package org.example.library.controller;

import lombok.RequiredArgsConstructor;
import org.example.library.model.BookCopy;
import org.example.library.service.BookCopyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/book-copies")
@RequiredArgsConstructor
public class BookCopyController {

    private final BookCopyService bookCopyService;

    @GetMapping
    public List<BookCopy> getAllBookCopies() {
        return bookCopyService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookCopy> getBookCopyById(@PathVariable Long id) {
        return ResponseEntity.ok(bookCopyService.findById(id));
    }

    @PostMapping
    public BookCopy createBookCopy(@RequestBody BookCopy bookCopy) {
        return bookCopyService.save(bookCopy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookCopy> updateBookCopy(@PathVariable Long id, @RequestBody BookCopy bookCopyDetails) {
        return ResponseEntity.ok(bookCopyService.update(id, bookCopyDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookCopy(@PathVariable Long id) {
        bookCopyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
