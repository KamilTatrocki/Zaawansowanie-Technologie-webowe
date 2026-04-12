package org.example.library.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCopyCreateDto {
    private Long bookId;
    private boolean available;
}
