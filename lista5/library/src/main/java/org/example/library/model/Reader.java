package org.example.library.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reader {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @JsonIgnore
    @OneToMany(mappedBy = "reader", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Rental> rentals = new ArrayList<>();

}
