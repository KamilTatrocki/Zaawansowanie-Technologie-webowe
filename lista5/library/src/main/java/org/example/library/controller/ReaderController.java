package org.example.library.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.library.dto.ReaderDto;
import org.example.library.dto.ReaderCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.Reader;
import org.example.library.service.ReaderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/readers")
@RequiredArgsConstructor
public class ReaderController {

    private final ReaderService readerService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<ReaderDto> getAllReaders(@PageableDefault(size = 20) Pageable pageable) {
        return readerService.findAll(pageable).map(DtoMapper::toDto);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ReaderDto> getReaderById(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(readerService.findById(id)));
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ReaderDto> createReader(@Valid @RequestBody ReaderCreateDto readerDto) {
        Reader reader = Reader.builder()
                .firstName(readerDto.getFirstName())
                .lastName(readerDto.getLastName())
                .build();
        return  ResponseEntity.status(HttpStatus.CREATED)
                .body(DtoMapper.toDto(readerService.save(reader)));
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ReaderDto> updateReader(@Valid @PathVariable Long id, @Valid @RequestBody ReaderCreateDto readerDto) {
        Reader readerDetails = Reader.builder()
                .firstName(readerDto.getFirstName())
                .lastName(readerDto.getLastName())
                .build();
        return ResponseEntity.ok(DtoMapper.toDto(readerService.update(id, readerDetails)));
    }

    @DeleteMapping(
            value = "/{id}"
    )
    public ResponseEntity<Void> deleteReader(@Valid @PathVariable Long id) {
        readerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
