package com.example.kinoxp.service;

import com.example.kinoxp.model.Showing;
import com.example.kinoxp.repository.ShowJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowingService {
    ShowJpaRepository showJpaRepository;

    @Autowired
    public ShowingService(ShowJpaRepository showJpaRepository) {
        this.showJpaRepository = showJpaRepository;
    }

    public List<Showing> findAllShowings() {
        return showJpaRepository.findAll();
    }

    public Showing saveShowing(Showing showing) {
        return showJpaRepository.save(showing);
    }

    public void deleteShowing(int id) {
        showJpaRepository.deleteById(id);
    }

    public Showing findShowingById(int id) {
        return showJpaRepository.findById(id).orElse(null);
    }

    public List<Showing> findShowingsByMovieId(int movieId) {
        return showJpaRepository.findAll().stream()
                .filter(showing -> showing.getMovie().getMovie_id() == movieId)
                .toList();
    }
}
