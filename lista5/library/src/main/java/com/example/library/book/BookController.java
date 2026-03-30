package com.example.library.book;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookController {

    @GetMapping("/")
    public String index() {
        return "Hello from spring-boot";
    }
}
