package org.example.library.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorCreateDto {
    @NotBlank(message = "First name cannot be blank or empty")
    private String firstName;
    @NotBlank(message = "First name cannot be blank or empty")
    private String lastName;
}
