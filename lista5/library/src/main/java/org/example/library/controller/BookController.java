package org.example.library.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.library.dto.BookDto;
import org.example.library.dto.BookCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.Book;
import org.example.library.model.Author;
import org.example.library.service.BookService;
import org.example.library.service.AuthorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BookDto> getAllBooks() {
        return bookService.findAll().stream()
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BookDto> getBookById(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(bookService.findById(id)));
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BookDto> createBook(@Valid @RequestBody BookCreateDto bookDto) {
        Author author = authorService.findById(bookDto.getAuthorId());
        Book book = Book.builder()
                .title(bookDto.getTitle())
                .author(author)
                .pages(bookDto.getPages())
                .build();
        return  ResponseEntity.status(HttpStatus.CREATED)
                .body(DtoMapper.toDto(bookService.save(book)));
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BookDto> updateBook(@Valid @PathVariable Long id, @Valid @RequestBody BookCreateDto bookDto) {
        Author author = authorService.findById(bookDto.getAuthorId());
        Book bookDetails = Book.builder()
                .title(bookDto.getTitle())
                .author(author)
                .pages(bookDto.getPages())
                .build();
        return ResponseEntity.ok(DtoMapper.toDto(bookService.update(id, bookDetails)));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteBook(@Valid @PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
