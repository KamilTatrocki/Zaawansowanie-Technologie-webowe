package org.example.library.controller;

import lombok.RequiredArgsConstructor;
import org.example.library.model.Rental;
import org.example.library.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @GetMapping
    public List<Rental> getAllRentals() {
        return rentalService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rental> getRentalById(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.findById(id));
    }

    @PostMapping
    public Rental createRental(@RequestBody Rental rental) {
        return rentalService.save(rental);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rental> updateRental(@PathVariable Long id, @RequestBody Rental rentalDetails) {
        return ResponseEntity.ok(rentalService.update(id, rentalDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        rentalService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/rent")
    public ResponseEntity<Rental> rentBook(@RequestParam Long bookId, @RequestParam Long userId) {
        return ResponseEntity.ok(rentalService.rentBook(bookId, userId));
    }
    
    @PostMapping("/{id}/return")
    public ResponseEntity<Rental> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.returnBook(id));
    }
}
