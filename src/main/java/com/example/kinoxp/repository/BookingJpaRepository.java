package com.example.kinoxp.repository;

import com.example.kinoxp.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingJpaRepository extends JpaRepository<Booking, Integer> {
}
