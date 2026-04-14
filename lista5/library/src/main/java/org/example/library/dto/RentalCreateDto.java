package org.example.library.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalCreateDto {
    @NotNull(message = "Book copy must be specified")
    private Long bookCopyId;
    @NotNull(message = "Reader must be specified")
    private Long readerId;
    @NotNull(message = "Rental date must be specified")
    private LocalDateTime rentalDate;
    @NotNull(message = "Return date must be specified")
    private LocalDateTime returnDate;
    @NotNull(message = "Returned status must be specified")
    private Boolean returned;
}
