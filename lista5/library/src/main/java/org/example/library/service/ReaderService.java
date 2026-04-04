package org.example.library.service;

import lombok.RequiredArgsConstructor;
import org.example.library.model.Reader;
import org.example.library.repository.ReaderRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReaderService {
    private final ReaderRepository readerRepository;

    public List<Reader> findAll() {
        return readerRepository.findAll();
    }

    public Reader findById(Long id) {
        return readerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono czytelnika"));
    }

    @Transactional
    public Reader save(Reader reader) {
        return readerRepository.save(reader);
    }

    @Transactional
    public Reader update(Long id, Reader readerDetails) {
        Reader reader = findById(id);
        reader.setFirstName(readerDetails.getFirstName());
        reader.setLastName(readerDetails.getLastName());
        return readerRepository.save(reader);
    }

    @Transactional
    public void delete(Long id) {
        readerRepository.deleteById(id);
    }
}
