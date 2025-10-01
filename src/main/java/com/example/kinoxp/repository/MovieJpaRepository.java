package com.example.kinoxp.repository;

import com.example.kinoxp.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieJpaRepository extends JpaRepository<Movie, Integer> {
}
