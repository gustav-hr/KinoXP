package com.example.kinoxp.repositorytest;

import com.example.kinoxp.model.*;
import com.example.kinoxp.repository.ReservedSeatJpaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class ReservedSeatJpaRepositoryTest {

    @Autowired
    private ReservedSeatJpaRepository reservedSeatJpaRepository;

    @Autowired
    private TestEntityManager entityManager;

    /**
     * Tester den indbyggede save()-metode og findById()-metode.
     */
    @Test
    void whenSaveReservedSeat_thenItCanBeFoundById() {
        // ARRANGE (Opsætning af relationer, da ReservedSeat er afhængig af dem)
        // 1. Opret en Theatre og en Movie
        Theatre theatre = new Theatre();
        theatre.setName("Sal 3");
        theatre = entityManager.persistAndFlush(theatre);

        Movie movie = new Movie();
        movie.setTitle("Test Movie");
        movie = entityManager.persistAndFlush(movie);

        // 2. Opret en Showing og Booking
        Showing showing = new Showing();
        showing.setMovie(movie);
        showing.setTheatre(theatre);
        showing.setStart_time(LocalDateTime.now());
        showing = entityManager.persistAndFlush(showing);

        Seat seat = new Seat();
        seat.setTheatre(theatre);
        seat.setSeat_row(5);
        seat.setSeat_number(10);
        seat = entityManager.persistAndFlush(seat);

        Booking booking = new Booking();
        booking.setEmail("test@test.dk");
        booking = entityManager.persistAndFlush(booking);

        // 3. Opret den ReservedSeat vi vil gemme
        ReservedSeat newReservedSeat = new ReservedSeat();
        newReservedSeat.setShow(showing);
        newReservedSeat.setSeat(seat);
        newReservedSeat.setBooking(booking);


        // ACT (Gem entiteten)
        ReservedSeat savedReservedSeat = reservedSeatJpaRepository.save(newReservedSeat);
        // Hent entiteten igen fra databasen
        Optional<ReservedSeat> foundReservedSeat = reservedSeatJpaRepository.findById(savedReservedSeat.getReserved_seat_id());


        // ASSERT (Verificer resultatet)
        // Tjek at entiteten blev fundet
        assertThat(foundReservedSeat).isPresent();
        // Tjek at de gemte værdier er korrekte
        assertThat(foundReservedSeat.get().getSeat().getSeat_row()).isEqualTo(5);
        assertThat(foundReservedSeat.get().getBooking().getEmail()).isEqualTo("test@test.dk");
    }
}