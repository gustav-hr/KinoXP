package com.example.kinoxp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // VIGTIGT: Brug @Controller, ikke @RestController
public class AdminController {

    /**
     * Denne metode lytter efter GET-anmodninger på URL'en "/admin".
     * Når en anmodning modtages, returnerer den strengen "admin".
     * Fordi klassen er en @Controller, vil Spring lede efter en fil ved navn
     * "admin.html" i "resources/static"-mappen og servere den.
     */
    @GetMapping("/admin")
    public String showAdminPage() {
        return "forward:/admin.html"; // Dette peger på admin.html
    }
}