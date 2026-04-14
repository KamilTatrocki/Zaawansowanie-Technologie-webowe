package org.example.library.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCreateDto {
    @NotBlank(message = "Book title must not be blank or empty")
    private String title;
    @NotNull(message = "Book must have an author")
    private Long authorId;
    @NotNull(message = "Book must have pages")
    private int pages;
}
