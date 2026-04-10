package org.example.library.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCreateDto {
    private String title;
    private Long authorId;
    private int pages;
}
