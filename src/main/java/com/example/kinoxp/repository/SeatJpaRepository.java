package com.example.kinoxp.repository;

import com.example.kinoxp.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatJpaRepository extends JpaRepository<Seat, Integer> {
}
