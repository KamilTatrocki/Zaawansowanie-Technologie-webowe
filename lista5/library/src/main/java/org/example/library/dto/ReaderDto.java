package org.example.library.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReaderDto {
    private Long id;
    private String firstName;
    private String lastName;
}
