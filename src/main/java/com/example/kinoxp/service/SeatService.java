package com.example.kinoxp.service;

import com.example.kinoxp.model.Seat;
import com.example.kinoxp.repository.SeatJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    private final SeatJpaRepository seatJpaRepository;

    @Autowired
    public SeatService(SeatJpaRepository seatJpaRepository) {
        this.seatJpaRepository = seatJpaRepository;
    }

    public List<Seat> getSeatsByTheatreId(int theatreId) {

        return seatJpaRepository.getAllByTheatre_TheatreId(theatreId);

    }

}
