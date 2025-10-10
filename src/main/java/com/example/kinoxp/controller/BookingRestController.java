package com.example.kinoxp.controller;

import com.example.kinoxp.model.Booking;
import com.example.kinoxp.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingRestController {

    @Autowired
    BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<Booking> createBookingWithJson(@RequestBody Map<String, Object> bookingData) {
        try {
            String email = (String) bookingData.get("email");
            int showId = (int) bookingData.get("showId");
            List<Integer> seatIds = (List<Integer>) bookingData.get("seatIds");

            Booking savedBooking = bookingService.createBookingWithSeats(email, showId, seatIds);
            return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/delete/booking")
    public ResponseEntity<String> deleteBooking(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        int bookingCode = (int) request.get("bookingCode");

        boolean deleted = bookingService.deleteByEmailAndCode(email, bookingCode);

        if (deleted) {
            return ResponseEntity.ok("Booking med kode " + bookingCode + " for " + email + " er afbestilt.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ingen booking fundet for " + email + " med kode " + bookingCode + ".");
        }
    }


}


