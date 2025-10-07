package com.example.kinoxp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/login")
    public String showLoginPage() {
        // Videresender anmodningen til den statiske fil login.html
        return "forward:/login.html";
    }
}