package org.example.library.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCopyDto {
    private Long id;
    private String bookTitle;
    private boolean available;
}
