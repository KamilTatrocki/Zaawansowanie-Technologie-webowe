package org.example.library.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalDto {
    private Long id;
    private Long bookCopyId;
    private String bookTitle;
    private Long readerId;
    private String readerFirstName;
    private String readerLastName;
    private LocalDateTime rentalDate;
    private LocalDateTime returnDate;
    private Boolean returned;
}
