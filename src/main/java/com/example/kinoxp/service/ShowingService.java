package com.example.kinoxp.service;

import com.example.kinoxp.model.Showing;
import com.example.kinoxp.repository.ReservedSeatJpaRepository;
import com.example.kinoxp.repository.ShowJpaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowingService {
    ShowJpaRepository showJpaRepository;

    ReservedSeatJpaRepository reservedSeatJpaRepository;

    @Autowired
    public ShowingService(ShowJpaRepository showJpaRepository, ReservedSeatJpaRepository reservedSeatJpaRepository) {
        this.showJpaRepository = showJpaRepository;
        this.reservedSeatJpaRepository = reservedSeatJpaRepository;
    }

    public List<Showing> findAllShowings() {
        return showJpaRepository.findAll();
    }

    public Showing saveShowing(Showing showing) {
        return showJpaRepository.save(showing);
    }

    @Transactional
    public void deleteShowing(int id) {
        // 1. Slet først alle afhængige 'ReservedSeat' rækker
        reservedSeatJpaRepository.deleteAllByShow_ShowId(id);

        // 2. Slet derefter selve 'Showing'
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
