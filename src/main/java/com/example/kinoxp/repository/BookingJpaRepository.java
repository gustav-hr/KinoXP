package com.example.kinoxp.repository;

import com.example.kinoxp.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

public interface BookingJpaRepository extends JpaRepository<Booking, Integer> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Booking b WHERE b.email = :email AND b.booking_id = :bookingId")
    int deleteByEmailAndBooking_id(@Param("email") String email, @Param("bookingId") int bookingId);

    @Transactional
    @Query("SELECT b FROM Booking b WHERE b.email = :email AND b.booking_id = :bookingId")
    Booking findByEmailAndBooking_id(@Param("email") String email, @Param("bookingId") int bookingId);
}