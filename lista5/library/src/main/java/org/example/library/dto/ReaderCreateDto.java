package org.example.library.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReaderCreateDto {
    @NotBlank(message = "First name cannot be blank or empty")
    private String firstName;
    @NotBlank(message = "Last name cannot be blank or empty")
    private String lastName;
}
