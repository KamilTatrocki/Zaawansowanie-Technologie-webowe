package org.example.library.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReaderCreateDto {
    private String firstName;
    private String lastName;
}
