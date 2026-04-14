package org.example.library.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.library.dto.RentalDto;
import org.example.library.dto.RentalCreateDto;
import org.example.library.dto.DtoMapper;
import org.example.library.model.Rental;
import org.example.library.model.BookCopy;
import org.example.library.model.Reader;
import org.example.library.service.RentalService;
import org.example.library.service.BookCopyService;
import org.example.library.service.ReaderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;
    private final BookCopyService bookCopyService;
    private final ReaderService readerService;

    @GetMapping
    public List<RentalDto> getAllRentals() {
        return rentalService.findAll().stream()
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalDto> getRentalById(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.findById(id)));
    }

    @PostMapping
    public RentalDto createRental(@Valid @RequestBody RentalCreateDto rentalDto) {
        BookCopy bookCopy = bookCopyService.findById(rentalDto.getBookCopyId());
        Reader reader = readerService.findById(rentalDto.getReaderId());
        Rental rental = Rental.builder()
                .bookCopy(bookCopy)
                .reader(reader)
                .rentalDate(rentalDto.getRentalDate())
                .returnDate(rentalDto.getReturnDate())
                .returned(rentalDto.getReturned() != null ? rentalDto.getReturned() : false)
                .build();
        return DtoMapper.toDto(rentalService.save(rental));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentalDto> updateRental(@Valid @PathVariable Long id, @Valid @RequestBody RentalCreateDto rentalDto) {
        BookCopy bookCopy = bookCopyService.findById(rentalDto.getBookCopyId());
        Reader reader = readerService.findById(rentalDto.getReaderId());
        Rental rentalDetails = Rental.builder()
                .bookCopy(bookCopy)
                .reader(reader)
                .rentalDate(rentalDto.getRentalDate())
                .returnDate(rentalDto.getReturnDate())
                .returned(rentalDto.getReturned() != null ? rentalDto.getReturned() : false)
                .build();
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.update(id, rentalDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@Valid @PathVariable Long id) {
        rentalService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/rent")
    public ResponseEntity<RentalDto> rentBook(@Valid @RequestParam Long bookId, @Valid @RequestParam Long userId) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.rentBook(bookId, userId)));
    }

    // TODO - test
    @PatchMapping("/{id}/return")
    public ResponseEntity<RentalDto> returnBook(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(DtoMapper.toDto(rentalService.returnBook(id)));
    }
}
