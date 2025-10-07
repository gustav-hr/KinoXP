package com.example.kinoxp.controller;

import com.example.kinoxp.model.Movie;
import com.example.kinoxp.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MovieRestController {

    @Autowired
    MovieService movieService;

    @GetMapping("/movies")
    public List<Movie> getMovies() {
        return movieService.findAllMovies();
    }

    @GetMapping("/movie/{id}")
    public Movie getMovieById(@PathVariable int id) {
        return movieService.findMovieById(id).orElse(null);
    }

    @PostMapping("/addmovie")
    public Movie addMovie(@RequestBody Movie movie) { // <<-- @RequestBody LØSER DIT PROBLEM
        return movieService.saveMovie(movie); // Opdaterer eksisterende film, da 'movie' indeholder movie_id
    }

    @DeleteMapping("/deletemovie/{id}")
    public void deleteMovie(@PathVariable int id) {
        movieService.deleteMovie(id);
    }

}