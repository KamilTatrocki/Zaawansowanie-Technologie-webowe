package org.example.library.controller;

import lombok.RequiredArgsConstructor;
import org.example.library.dto.RentalDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.Rental;
import org.example.library.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @GetMapping
    public List<RentalDto> getAllRentals() {
        return rentalService.findAll().stream()
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalDto> getRentalById(@PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.findById(id)));
    }

    @PostMapping
    public RentalDto createRental(@RequestBody Rental rental) {
        return DtoMapper.toDto(rentalService.save(rental));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentalDto> updateRental(@PathVariable Long id, @RequestBody Rental rentalDetails) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.update(id, rentalDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        rentalService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/rent")
    public ResponseEntity<RentalDto> rentBook(@RequestParam Long bookId, @RequestParam Long userId) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.rentBook(bookId, userId)));
    }
    
    @PostMapping("/{id}/return")
    public ResponseEntity<RentalDto> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.returnBook(id)));
    }
}
