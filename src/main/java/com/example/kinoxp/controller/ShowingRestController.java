package com.example.kinoxp.controller;

import com.example.kinoxp.model.Showing;
import com.example.kinoxp.service.ShowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ShowingRestController {

    @Autowired
    ShowingService showingService;


    @GetMapping("/showings")
    public List<Showing> getShowings() {
        return showingService.findAllShowings();
    }

    @GetMapping("/showing/{id}")
    public Showing getShowingById(@PathVariable int id) {
        return showingService.findShowingById(id);
    }

    @GetMapping("/showings/movie/{movieId}")
    public List<Showing> getShowingsByMovieId(@PathVariable int movieId) {
        return showingService.findShowingsByMovieId(movieId);
    }
}