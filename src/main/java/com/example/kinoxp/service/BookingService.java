package com.example.kinoxp.service;

import com.example.kinoxp.model.Booking;
import com.example.kinoxp.model.ReservedSeat;
import com.example.kinoxp.model.Seat;
import com.example.kinoxp.model.Showing;
import com.example.kinoxp.repository.BookingJpaRepository;
import com.example.kinoxp.repository.ReservedSeatJpaRepository;
import com.example.kinoxp.repository.SeatJpaRepository;
import com.example.kinoxp.repository.ShowJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingJpaRepository bookingJpaRepository;
    private final ReservedSeatJpaRepository reservedSeatJpaRepository;
    private final SeatJpaRepository seatJpaRepository;
    private final ShowJpaRepository showingJpaRepository;

    @Autowired
    public BookingService(BookingJpaRepository bookingJpaRepository, ReservedSeatJpaRepository reservedSeatJpaRepository, SeatJpaRepository seatJpaRepository, ShowJpaRepository showingJpaRepository) {
        this.bookingJpaRepository = bookingJpaRepository;
        this.reservedSeatJpaRepository = reservedSeatJpaRepository;
        this.seatJpaRepository = seatJpaRepository;
        this.showingJpaRepository = showingJpaRepository;
    }

    public Booking createBookingWithSeats(String email, int showId, List<Integer> seatIds) {

        // 1. Opret og gem bookingen for at få et booking_id
        Booking newBooking = new Booking();
        newBooking.setEmail(email);
        Booking savedBooking = bookingJpaRepository.save(newBooking);

        // 2. Find show-objektet baseret på showId
        Showing showing = showingJpaRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));

        // 3. For hvert sæde-ID, opret et ReservedSeat-objekt
        for (int seatId : seatIds) {

            // Find sæde-objektet
            Seat seat = seatJpaRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found"));

            // Opret et nyt ReservedSeat-objekt
            ReservedSeat reservedSeat = new ReservedSeat();

            // 4. Etabler eksplicit de tre relationer
            reservedSeat.setBooking(savedBooking);
            reservedSeat.setSeat(seat);
            reservedSeat.setShow(showing);

            // 5. Gem reservedSeat-objektet
            reservedSeatJpaRepository.save(reservedSeat);
        }

        return savedBooking;
    }

    public void deleteBooking(int id) {
        bookingJpaRepository.deleteById(id);
    }

    public List<Booking> findAllBookings() {
        return bookingJpaRepository.findAll();
    }

    public Booking findBookingById(int id) {
        return bookingJpaRepository.findById(id).orElse(null);
    }

    public boolean deleteByEmailAndCode(String email, int bookingCode) {

        Booking booking = bookingJpaRepository.findByEmailAndBooking_id(email, bookingCode);

        if (booking != null) {
            // Slet først alle reserverede sæder for denne booking
            reservedSeatJpaRepository.deleteByBookingId(booking.getBooking_id());

            // Slet derefter selve bookingen
            bookingJpaRepository.deleteByEmailAndBooking_id(email, bookingCode);
            return true;
        }

        return false;
    }

}