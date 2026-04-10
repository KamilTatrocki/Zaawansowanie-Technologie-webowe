package org.example.library.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorCreateDto {
    private String firstName;
    private String lastName;
}
