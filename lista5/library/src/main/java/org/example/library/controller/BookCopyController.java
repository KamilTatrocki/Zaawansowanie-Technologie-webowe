package org.example.library.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.library.dto.BookCopyDto;
import org.example.library.dto.BookCopyCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.BookCopy;
import org.example.library.model.Book;
import org.example.library.service.BookCopyService;
import org.example.library.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookCopies")
@RequiredArgsConstructor
public class BookCopyController {

    private final BookCopyService bookCopyService;
    private final BookService bookService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<BookCopyDto> getAllBookCopies(@PageableDefault(size = 20) Pageable pageable) {
        return bookCopyService.findAll(pageable).map(DtoMapper::toDto);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BookCopyDto> getBookCopyById(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(bookCopyService.findById(id)));
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BookCopyDto> createBookCopy(@Valid @RequestBody BookCopyCreateDto bookCopyDto) {
        Book book = bookService.findById(bookCopyDto.getBookId());
        BookCopy bookCopy = BookCopy.builder()
                .book(book)
                .available(bookCopyDto.isAvailable())
                .build();
        return  ResponseEntity.status(HttpStatus.CREATED)
                .body(DtoMapper.toDto(bookCopyService.save(bookCopy)));
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BookCopyDto> updateBookCopy(@Valid @PathVariable Long id, @Valid @RequestBody BookCopyCreateDto bookCopyDto) {
        Book book = bookService.findById(bookCopyDto.getBookId());
        BookCopy bookCopyDetails = BookCopy.builder()
                .book(book)
                .available(bookCopyDto.isAvailable())
                .build();
        return ResponseEntity.ok(DtoMapper.toDto(bookCopyService.update(id, bookCopyDetails)));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteBookCopy(@Valid @PathVariable Long id) {
        bookCopyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
