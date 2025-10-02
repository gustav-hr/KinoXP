package com.example.kinoxp.controller;

import com.example.kinoxp.model.Booking;
import com.example.kinoxp.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingRestController {

    @Autowired
    BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<Booking> createBookingWithParams(
            @RequestParam("email") String email,
            @RequestParam("showId") int showId,
            @RequestParam("seatIds") List<Integer> seatIds) {
        try {
            Booking savedBooking = bookingService.createBookingWithSeats(email, showId, seatIds);
            return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}


