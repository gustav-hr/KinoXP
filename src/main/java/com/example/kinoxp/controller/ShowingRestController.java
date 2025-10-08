package com.example.kinoxp.controller;

import com.example.kinoxp.model.Movie;
import com.example.kinoxp.model.Showing;
import com.example.kinoxp.model.Theatre;
import com.example.kinoxp.repository.MovieJpaRepository;
import com.example.kinoxp.service.ShowingService;
import com.example.kinoxp.service.TheatreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @DeleteMapping("/deleteshowing/{id}")
    public ResponseEntity<Void> deleteShowing(@PathVariable int id) {
        try {
            showingService.deleteShowing(id);
            // Returnerer en 204 No Content status, som betyder "succes, intet at returnere"
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            // Hvis der sker en fejl, returneres en 500 Internal Server Error
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}