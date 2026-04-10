package org.example.library.controller;

import lombok.RequiredArgsConstructor;
import org.example.library.dto.BookCopyDto;
import org.example.library.dto.BookCopyCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.BookCopy;
import org.example.library.model.Book;
import org.example.library.service.BookCopyService;
import org.example.library.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/book-copies")
@RequiredArgsConstructor
public class BookCopyController {

    private final BookCopyService bookCopyService;
    private final BookService bookService;

    @GetMapping
    public List<BookCopyDto> getAllBookCopies() {
        return bookCopyService.findAll().stream()
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookCopyDto> getBookCopyById(@PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(bookCopyService.findById(id)));
    }

    @PostMapping
    public BookCopyDto createBookCopy(@RequestBody BookCopyCreateDto bookCopyDto) {
        Book book = bookService.findById(bookCopyDto.getBookId());
        BookCopy bookCopy = BookCopy.builder()
                .book(book)
                .isAvailable(bookCopyDto.isAvailable())
                .build();
        return DtoMapper.toDto(bookCopyService.save(bookCopy));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookCopyDto> updateBookCopy(@PathVariable Long id, @RequestBody BookCopyCreateDto bookCopyDto) {
        Book book = bookService.findById(bookCopyDto.getBookId());
        BookCopy bookCopyDetails = BookCopy.builder()
                .book(book)
                .isAvailable(bookCopyDto.isAvailable())
                .build();
        return ResponseEntity.ok(DtoMapper.toDto(bookCopyService.update(id, bookCopyDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookCopy(@PathVariable Long id) {
        bookCopyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
