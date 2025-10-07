package com.example.kinoxp.controller;

import com.example.kinoxp.model.Movie;
import com.example.kinoxp.model.Showing;
import com.example.kinoxp.model.Theatre;
import com.example.kinoxp.repository.MovieJpaRepository;
import com.example.kinoxp.service.ShowingService;
import com.example.kinoxp.service.TheatreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ShowingRestController {

    @Autowired
    ShowingService showingService;

    @Autowired
    TheatreService theatreService;

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

    @GetMapping ("/theatres")
    public List<Theatre> getTheatres() {
        return theatreService.findAllTheatres();
    }
    @PostMapping("/addshowing")
    public Showing addShowing(@RequestBody Showing showing) {
        return showingService.saveShowing(showing);
    }

}