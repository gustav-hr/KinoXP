package com.example.kinoxp.service;

import com.example.kinoxp.model.ReservedSeat;
import com.example.kinoxp.repository.ReservedSeatJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservedSeatService {

    @Autowired
    ReservedSeatJpaRepository reservedSeatJpaRepository;

    public List<ReservedSeat> getReservedSeatsByShowingId(int showingId) {
        return reservedSeatJpaRepository.getAllByShow_ShowId(showingId);
    }

}
