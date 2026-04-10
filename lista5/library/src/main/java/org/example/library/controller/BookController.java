package org.example.library.controller;

import lombok.RequiredArgsConstructor;
import org.example.library.dto.BookDto;
import org.example.library.dto.BookCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.Book;
import org.example.library.model.Author;
import org.example.library.service.BookService;
import org.example.library.service.AuthorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final AuthorService authorService;

    @GetMapping
    public List<BookDto> getAllBooks() {
        return bookService.findAll().stream()
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(bookService.findById(id)));
    }

    @PostMapping
    public BookDto createBook(@RequestBody BookCreateDto bookDto) {
        Author author = authorService.findById(bookDto.getAuthorId());
        Book book = Book.builder()
                .title(bookDto.getTitle())
                .author(author)
                .pages(bookDto.getPages())
                .build();
        return DtoMapper.toDto(bookService.save(book));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id, @RequestBody BookCreateDto bookDto) {
        Author author = authorService.findById(bookDto.getAuthorId());
        Book bookDetails = Book.builder()
                .title(bookDto.getTitle())
                .author(author)
                .pages(bookDto.getPages())
                .build();
        return ResponseEntity.ok(DtoMapper.toDto(bookService.update(id, bookDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
