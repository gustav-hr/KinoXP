package com.example.kinoxp.service;

import com.example.kinoxp.model.Theatre;
import com.example.kinoxp.repository.TheatreJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheatreService {

    private final TheatreJpaRepository theatreJpaRepository;

    @Autowired
    public TheatreService(TheatreJpaRepository theatreJpaRepository) {
        this.theatreJpaRepository = theatreJpaRepository;
    }

    public List<Theatre> findAllTheatres() {
        return theatreJpaRepository.findAll();
    }
}