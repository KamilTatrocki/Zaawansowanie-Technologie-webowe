package org.example.library.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.library.dto.AuthorDto;
import org.example.library.dto.AuthorCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.Author;
import org.example.library.service.AuthorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<AuthorDto> getAllAuthors(@PageableDefault(size = 20) Pageable pageable) {
        return authorService.findAll(pageable).map(DtoMapper::toDto);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthorDto> getAuthorById(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(authorService.findById(id)));
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AuthorDto> createAuthor(@Valid @RequestBody AuthorCreateDto authorDto) {
        Author author = Author.builder()
                .firstName(authorDto.getFirstName())
                .lastName(authorDto.getLastName())
                .build();
        return  ResponseEntity.status(HttpStatus.CREATED)
                .body(DtoMapper.toDto(authorService.save(author)));
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AuthorDto> updateAuthor(@Valid @PathVariable Long id, @Valid @RequestBody AuthorCreateDto authorDto) {
        Author authorDetails = Author.builder()
                .firstName(authorDto.getFirstName())
                .lastName(authorDto.getLastName())
                .build();
        return ResponseEntity.ok(DtoMapper.toDto(authorService.update(id, authorDetails)));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteAuthor(@Valid @PathVariable Long id) {
        authorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
