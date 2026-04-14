package org.example.library.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCopyCreateDto {
    @NotNull(message = "Book copy must have a book")
    private Long bookId;
    @NotNull(message = "Book copy must have an availability")
    private boolean available;
}
