package org.example.library.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.library.dto.BookDto;
import org.example.library.dto.BookCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.Book;
import org.example.library.model.Author;
import org.example.library.service.BookService;
import org.example.library.service.AuthorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final AuthorService authorService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<BookDto> getAllBooks(@PageableDefault(size = 20) Pageable pageable) {
        return bookService.findAll(pageable).map(DtoMapper::toDto);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BookDto> getBookById(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(bookService.findById(id)));
    }

    @Operation(summary = "Dodaj nową książkę")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Książka utworzona"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe")
    })
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


    @Operation(summary = "Edytuj książkę")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Książka edytowana"),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe")
    })
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

    @DeleteMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Void> deleteBook(@Valid @PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
