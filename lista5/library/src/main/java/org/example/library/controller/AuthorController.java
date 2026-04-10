package org.example.library.controller;

import lombok.RequiredArgsConstructor;
import org.example.library.dto.AuthorDto;
import org.example.library.dto.AuthorCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.Author;
import org.example.library.service.AuthorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping
    public List<AuthorDto> getAllAuthors() {
        return authorService.findAll().stream()
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorDto> getAuthorById(@PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(authorService.findById(id)));
    }

    @PostMapping
    public AuthorDto createAuthor(@RequestBody AuthorCreateDto authorDto) {
        Author author = Author.builder()
                .firstName(authorDto.getFirstName())
                .lastName(authorDto.getLastName())
                .build();
        return DtoMapper.toDto(authorService.save(author));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthorDto> updateAuthor(@PathVariable Long id, @RequestBody AuthorCreateDto authorDto) {
        Author authorDetails = Author.builder()
                .firstName(authorDto.getFirstName())
                .lastName(authorDto.getLastName())
                .build();
        return ResponseEntity.ok(DtoMapper.toDto(authorService.update(id, authorDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
        authorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
