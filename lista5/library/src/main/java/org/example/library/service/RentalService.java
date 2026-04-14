package org.example.library.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.library.config.BadRequestException;
import org.example.library.dto.RentalCreateDto;
import org.example.library.model.BookCopy;
import org.example.library.model.Reader;
import org.example.library.model.Rental;
import org.example.library.repository.RentalRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final ReaderService readerService;
    private final BookCopyService bookCopyService;

    @Transactional
    public Rental rentBook(RentalCreateDto dto) {
        if (dto.getReturnDate() != null && (dto.getReturnDate().isBefore(dto.getRentalDate()))) {
            throw new BadRequestException("Return date should be after rental date");
        }

        Reader reader = readerService.findById(dto.getReaderId());
        BookCopy bookCopy = bookCopyService.findById(dto.getBookCopyId());

        if (!bookCopy.isAvailable()) {
            throw new RuntimeException("Egzemplarz nie jest dostępny");
        }

        bookCopy.setAvailable(false);

        Rental rental = Rental.builder()
                .bookCopy(bookCopy)
                .reader(reader)
                .rentalDate(dto.getRentalDate() != null ? dto.getRentalDate() : LocalDateTime.now())
                .returnDate(dto.getReturnDate() != null ? dto.getReturnDate() : LocalDateTime.now().plusDays(30))
                .returned(false)
                .build();

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental returnBook(Long rentalId) {
        Rental rental = findById(rentalId);

        if (rental.getReturned()) {
            throw new RuntimeException("Książka została już zwrócona");
        }

        rental.setReturned(true);
        rental.setReturnDate(LocalDateTime.now());
        rental.getBookCopy().setAvailable(true);

        return rentalRepository.save(rental);
    }

    public Page<Rental> findAll(Pageable pageable) {
        return rentalRepository.findAll(pageable);
    }

    public Rental findById(Long id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono wypożyczenia"));
    }

    @Transactional
    public Rental update(Long id, RentalCreateDto dto) {
        Rental rental = findById(id);
        Reader reader = readerService.findById(dto.getReaderId());
        BookCopy bookCopy = bookCopyService.findById(dto.getBookCopyId());

        rental.setBookCopy(bookCopy);
        rental.setReader(reader);
        rental.setRentalDate(dto.getRentalDate());
        rental.setReturnDate(dto.getReturnDate());
        rental.setReturned(dto.getReturned() != null ? dto.getReturned() : false);

        return rentalRepository.save(rental);
    }

    @Transactional
    public void delete(Long id) {
        rentalRepository.deleteById(id);
    }
}