package org.example.library.controller;

import lombok.RequiredArgsConstructor;
import org.example.library.dto.RentalDto;
import org.example.library.dto.RentalCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RentalDto>> getAllRentals() {
        List<RentalDto> rentals = rentalService.findAll().stream()
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rentals);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RentalDto> getRentalById(@PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.findById(id)));
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RentalDto> rentBook(@RequestBody RentalCreateDto rentalDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(DtoMapper.toDto(rentalService.rentBook(rentalDto)));
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RentalDto> updateRental(@PathVariable Long id, @RequestBody RentalCreateDto rentalDto) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.update(id, rentalDto)));
    }

    @PatchMapping(
            value = "/{id}/return",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RentalDto> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.returnBook(id)));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        rentalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}