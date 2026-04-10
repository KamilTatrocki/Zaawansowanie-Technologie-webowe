package org.example.library.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalCreateDto {
    private Long bookCopyId;
    private Long readerId;
    private LocalDateTime rentalDate;
    private LocalDateTime returnDate;
    private Boolean returned;
}
