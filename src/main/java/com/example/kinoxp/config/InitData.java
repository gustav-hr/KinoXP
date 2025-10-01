package com.example.kinoxp.config;

import com.example.kinoxp.model.Movie;
import com.example.kinoxp.model.Seat;
import com.example.kinoxp.model.Showing;
import com.example.kinoxp.model.Theatre;
import com.example.kinoxp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class InitData implements CommandLineRunner {

    @Autowired
    private TheatreJpaRepository theatreJpaRepository;

    @Autowired
    private SeatJpaRepository seatJpaRepository;

    @Autowired
    private MovieJpaRepository movieJpaRepository;

    @Autowired
    private ShowJpaRepository showtimeRepository;

    // Tilføj disse, hvis du også vil oprette test-bookinger
    
    @Autowired
    private BookingJpaRepository bookingJpaRepository;
    
    @Autowired
    private ReservedSeatJpaRepository reservedSeatJpaRepository;


    @Override
    public void run(String... args) throws Exception {

        // 1. Slet eksisterende data i den korrekte rækkefølge for at undgå foreign key-fejl
        // Start med de tabeller, der har flest afhængigheder
        reservedSeatJpaRepository.deleteAll();
        bookingJpaRepository.deleteAll();
        showtimeRepository.deleteAll();
        seatJpaRepository.deleteAll();
        theatreJpaRepository.deleteAll();
        movieJpaRepository.deleteAll();

        // 2. Opret Sal 1 med sæder
        Theatre theatre = new Theatre();
        theatre.setName("Sal 1");
        int theatre1Rows = 20;
        int theatre1SeatsPerRow = 12;
        theatre.setCapacity(theatre1Rows * theatre1SeatsPerRow);
        theatreJpaRepository.save(theatre);

        List<Seat> hall1Seats = new ArrayList<>();
        for (int r = 1; r <= theatre1Rows; r++) {
            for (int s = 1; s <= theatre1SeatsPerRow; s++) {
                Seat seat = new Seat();
                seat.setTheatre(theatre);
                seat.setSeat_row(r);
                seat.setSeat_number(s);
                hall1Seats.add(seat);
            }
        }
        seatJpaRepository.saveAll(hall1Seats);
        System.out.println("Oprettet Sal 1 med " + hall1Seats.size() + " sæder.");

        // 3. Opret Sal 2 med sæder
        Theatre theatre2 = new Theatre();
        theatre2.setName("Sal 2");
        int hall2Rows = 25;
        int hall2SeatsPerRow = 16;
        theatre2.setCapacity(hall2Rows * hall2SeatsPerRow);
        theatreJpaRepository.save(theatre2);

        List<Seat> hall2Seats = new ArrayList<>();
        for (int r = 1; r <= hall2Rows; r++) {
            for (int s = 1; s <= hall2SeatsPerRow; s++) {
                Seat seat = new Seat();
                seat.setTheatre(theatre2);
                seat.setSeat_row(r);
                seat.setSeat_number(s);
                hall2Seats.add(seat);
            }
        }
        seatJpaRepository.saveAll(hall2Seats);
        System.out.println("Oprettet Sal 2 med " + hall2Seats.size() + " sæder.");

        // 4. Opret et par film
        Movie movie1 = new Movie();
        movie1.setTitle("Dune: Part Two");
        movie1.setDescription("Paul Atreides forener sig med Chani og Fremen, mens han søger hævn mod de sammensvorne, der ødelagde hans familie.");
        movie1.setDuration_minutes(166);
        movie1.setAge_rating(11);
        movieJpaRepository.save(movie1);

        Movie movie2 = new Movie();
        movie2.setTitle("The Super Mario Bros. Movie");
        movie2.setDescription("En blikkenslager ved navn Mario rejser gennem et underjordisk labyrint med sin bror, Luigi, for at redde en tilfangetagen prinsesse.");
        movie2.setDuration_minutes(92);
        movie2.setAge_rating(7);
        movieJpaRepository.save(movie2);
        System.out.println("Oprettet 2 film.");

        // 5. Opret nogle forestillinger
        Showing showing1 = new Showing();
        showing1.setMovie(movie1);
        showing1.setTheatre(theatre);
        showing1.setStart_time(LocalDateTime.now().withHour(18).withMinute(0).withSecond(0)); // I dag kl. 18:00
        showtimeRepository.save(showing1);

        Showing showing2 = new Showing();
        showing2.setMovie(movie2);
        showing2.setTheatre(theatre2);
        showing2.setStart_time(LocalDateTime.now().withHour(19).withMinute(30).withSecond(0)); // I dag kl. 19:30
        showtimeRepository.save(showing2);
        Showing showing3 = new Showing();
        showing3.setMovie(movie1);
        showing3.setTheatre(theatre);
        showing3.setStart_time(LocalDateTime.now().plusDays(1).withHour(21).withMinute(0).withSecond(0)); // I morgen kl. 21:00
        showtimeRepository.save(showing3);
        System.out.println("Oprettet 3 forestillinger.");
    }
}