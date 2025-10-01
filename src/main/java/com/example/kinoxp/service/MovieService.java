package com.example.kinoxp.service;

import com.example.kinoxp.model.Movie;
import com.example.kinoxp.repository.MovieJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieJpaRepository movieJpaRepository;

    @Autowired // Injicerer repository
    public MovieService(MovieJpaRepository movieJpaRepository) {
        this.movieJpaRepository = movieJpaRepository;
    }

    // Metode til at finde alle film
    public List<Movie> findAllMovies() {
        return movieJpaRepository.findAll();
    }

    // Metode til at finde en film ud fra dens ID
    public Optional<Movie> findMovieById(int id) {
        return movieJpaRepository.findById(id);
    }

    // Metode til at gemme eller opdatere en film
    public Movie saveMovie(Movie movie) {
        return movieJpaRepository.save(movie);
    }

    // Metode til at slette en film
    public void deleteMovie(int id) {
        movieJpaRepository.deleteById(id);
    }

    // Yderligere forretningslogik kan tilføjes her
    // f.eks. validering, dataformatetering etc.
}