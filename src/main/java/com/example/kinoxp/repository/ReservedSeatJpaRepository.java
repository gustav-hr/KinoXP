package com.example.kinoxp.repository;

import com.example.kinoxp.model.ReservedSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ReservedSeatJpaRepository extends JpaRepository<ReservedSeat, Integer> {

    List<ReservedSeat> getAllByShow_ShowId(int showId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ReservedSeat rs WHERE rs.booking.booking_id = :bookingId")
    void deleteByBookingId(@Param("bookingId") int bookingId);


}
