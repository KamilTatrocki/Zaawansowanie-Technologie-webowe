package org.example.library.service;

import lombok.RequiredArgsConstructor;
import org.example.library.model.Author;
import org.example.library.repository.AuthorRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;

    public List<Author> findAll() {
        return authorRepository.findAll();
    }

    public Author findById(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono autora"));
    }

    @Transactional
    public Author save(Author author) {
        return authorRepository.save(author);
    }

    @Transactional
    public Author update(Long id, Author authorDetails) {
        Author author = findById(id);
        author.setFirstName(authorDetails.getFirstName());
        author.setLastName(authorDetails.getLastName());
        return authorRepository.save(author);
    }

    @Transactional
    public void delete(Long id) {
        authorRepository.deleteById(id);
    }
}
