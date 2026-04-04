package org.example.library.controller;

import lombok.RequiredArgsConstructor;
import org.example.library.model.Reader;
import org.example.library.service.ReaderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/readers")
@RequiredArgsConstructor
public class ReaderController {

    private final ReaderService readerService;

    @GetMapping
    public List<Reader> getAllReaders() {
        return readerService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reader> getReaderById(@PathVariable Long id) {
        return ResponseEntity.ok(readerService.findById(id));
    }

    @PostMapping
    public Reader createReader(@RequestBody Reader reader) {
        return readerService.save(reader);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reader> updateReader(@PathVariable Long id, @RequestBody Reader readerDetails) {
        return ResponseEntity.ok(readerService.update(id, readerDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReader(@PathVariable Long id) {
        readerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
