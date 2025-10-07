package com.example.kinoxp.repository;

import com.example.kinoxp.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatJpaRepository extends JpaRepository<Seat, Integer> {

    List<Seat> getAllByTheatre_TheatreId(int theatreId);

}
