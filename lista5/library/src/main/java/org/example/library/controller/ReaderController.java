package org.example.library.controller;

import lombok.RequiredArgsConstructor;
import org.example.library.dto.ReaderDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.Reader;
import org.example.library.service.ReaderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/readers")
@RequiredArgsConstructor
public class ReaderController {

    private final ReaderService readerService;

    @GetMapping
    public List<ReaderDto> getAllReaders() {
        return readerService.findAll().stream()
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReaderDto> getReaderById(@PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(readerService.findById(id)));
    }

    @PostMapping
    public ReaderDto createReader(@RequestBody Reader reader) {
        return DtoMapper.toDto(readerService.save(reader));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReaderDto> updateReader(@PathVariable Long id, @RequestBody Reader readerDetails) {
        return ResponseEntity.ok(DtoMapper.toDto(readerService.update(id, readerDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReader(@PathVariable Long id) {
        readerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
