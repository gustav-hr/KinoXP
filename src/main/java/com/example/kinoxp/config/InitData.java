package com.example.kinoxp.config;

import com.example.kinoxp.model.*;
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

    @Autowired
    private AdminJpaRepository adminJpaRepository;


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
        movie1.setActors("Timothée Chalamet, Zendaya, Rebecca Ferguson");
        movie1.setGenre("Adventure, Drama, Sci-Fi");
        movie1.setPoster_url("https://img-cdn.sfanytime.com/COVERM/COVERM_9b838abd-3933-48f6-b6ea-e522d1027711_01.jpg?w=415&ar=0.692&fit=crop&fm=pjpg&s=71f2c5c6a9f32865165cf45e55c962d3");
        movieJpaRepository.save(movie1);

        Movie movie2 = new Movie();
        movie2.setTitle("The Super Mario Bros. Movie");
        movie2.setDescription("En blikkenslager ved navn Mario rejser gennem et underjordisk labyrint med sin bror, Luigi, for at redde en tilfangetagen prinsesse.");
        movie2.setDuration_minutes(92);
        movie2.setAge_rating(7);
        movie2.setActors("Chris Pratt, Anya Taylor-Joy, Charlie Day");
        movie2.setGenre("Animation, Adventure, Comedy");
        movie2.setPoster_url("https://img-cdn.sfanytime.com/COVERM/COVERM_477fdb52-7d0b-4cdc-9c25-949a8dfbb14b_da.jpg?w=415&ar=0.692&fit=crop&fm=pjpg&s=61c203cbc1a9dc320ea936d4f453d156");
        movieJpaRepository.save(movie2);

        // --- TILFØJEDE FILM START ---
        Movie movie3 = new Movie();
        movie3.setTitle("Oppenheimer");
        movie3.setDescription("Historien om den amerikanske videnskabsmand J. Robert Oppenheimer og hans rolle i udviklingen af atombomben.");
        movie3.setDuration_minutes(180);
        movie3.setAge_rating(15);
        movie3.setActors("Cillian Murphy, Emily Blunt, Matt Damon");
        movie3.setGenre("Biography, Drama, History");
        movie3.setPoster_url("https://www.tallengestore.com/cdn/shop/products/Oppenheimer-CillianMurphy-ChristopherNolan-HollywoodMoviePoster_1_f2b4d54a-6a90-4df1-b2e8-5cd7949d4c2c.jpg?v=1647424460");
        movieJpaRepository.save(movie3);

        Movie movie4 = new Movie();
        movie4.setTitle("Barbie");
        movie4.setDescription("Barbie og Ken har det sjovt i den tilsyneladende perfekte verden i Barbie Land, indtil de får en chance for at tage til den virkelige verden.");
        movie4.setDuration_minutes(114);
        movie4.setAge_rating(7);
        movie4.setActors("Margot Robbie, Ryan Gosling, America Ferrera");
        movie4.setGenre("Adventure, Comedy, Fantasy");
        movie4.setPoster_url("https://storage.googleapis.com/pod_public/750/262974.jpg");
        movieJpaRepository.save(movie4);

        Movie movie5 = new Movie();
        movie5.setTitle("Mission: Impossible - Dead Reckoning Part One");
        movie5.setDescription("Ethan Hunt og hans IMF-hold går i gang med deres farligste mission hidtil.");
        movie5.setDuration_minutes(163);
        movie5.setAge_rating(11);
        movie5.setActors("Tom Cruise, Hayley Atwell, Ving Rhames");
        movie5.setGenre("Action, Adventure, Thriller");
        movie5.setPoster_url("https://bluraysforeveryone.com/cdn/shop/files/341691_slip.jpg?v=1693231176&width=1946");
        movieJpaRepository.save(movie5);

        Movie movie6 = new Movie();
        movie6.setTitle("Elemental");
        movie6.setDescription("Historien foregår i en by, hvor beboere af ild, vand, land og luft bor sammen.");
        movie6.setDuration_minutes(109);
        movie6.setAge_rating(7);
        movie6.setActors("Leah Lewis, Mamoudou Athie, Ronnie del Carmen");
        movie6.setGenre("Animation, Adventure, Comedy");
        movie6.setPoster_url("https://m.media-amazon.com/images/I/718jC7PE5ZL.jpg");
        movieJpaRepository.save(movie6);
        // --- TILFØJEDE FILM SLUT ---

        System.out.println("Oprettet 6 film.");

        // 5. Opret nogle forestillinger
        Showing showing1 = new Showing();
        showing1.setMovie(movie1);
        showing1.setTheatre(theatre);
        showing1.setStart_time(LocalDateTime.now().withHour(18).withMinute(0).withSecond(0)); // I dag kl. 18:00 (Sal 1)
        showtimeRepository.save(showing1);

        Showing showing2 = new Showing();
        showing2.setMovie(movie2);
        showing2.setTheatre(theatre2);
        showing2.setStart_time(LocalDateTime.now().withHour(19).withMinute(30).withSecond(0)); // I dag kl. 19:30 (Sal 2)
        showtimeRepository.save(showing2);

        Showing showing3 = new Showing();
        showing3.setMovie(movie1);
        showing3.setTheatre(theatre);
        showing3.setStart_time(LocalDateTime.now().plusDays(1).withHour(21).withMinute(0).withSecond(0)); // I morgen kl. 21:00 (Sal 1)
        showtimeRepository.save(showing3);

        // --- TILFØJEDE FORESTILLINGER START ---
        Showing showing4 = new Showing();
        showing4.setMovie(movie3);
        showing4.setTheatre(theatre2);
        showing4.setStart_time(LocalDateTime.now().withHour(17).withMinute(0).withSecond(0)); // I dag kl. 17:00 (Sal 2)
        showtimeRepository.save(showing4);

        Showing showing5 = new Showing();
        showing5.setMovie(movie4);
        showing5.setTheatre(theatre);
        showing5.setStart_time(LocalDateTime.now().withHour(16).withMinute(0).withSecond(0)); // I dag kl. 16:00 (Sal 1)
        showtimeRepository.save(showing5);

        Showing showing6 = new Showing();
        showing6.setMovie(movie5);
        showing6.setTheatre(theatre2);
        showing6.setStart_time(LocalDateTime.now().plusDays(1).withHour(19).withMinute(45).withSecond(0)); // I morgen kl. 19:45 (Sal 2)
        showtimeRepository.save(showing6);

        Showing showing7 = new Showing();
        showing7.setMovie(movie6);
        showing7.setTheatre(theatre);
        showing7.setStart_time(LocalDateTime.now().plusDays(2).withHour(14).withMinute(30).withSecond(0)); // Om to dage kl. 14:30 (Sal 1)
        showtimeRepository.save(showing7);

        Showing showing8 = new Showing();
        showing8.setMovie(movie3);
        showing8.setTheatre(theatre);
        showing8.setStart_time(LocalDateTime.now().plusDays(2).withHour(20).withMinute(30).withSecond(0)); // Om to dage kl. 20:30 (Sal 1)
        showtimeRepository.save(showing8);

        Showing showing9 = new Showing();
        showing9.setMovie(movie4);
        showing9.setTheatre(theatre2);
        showing9.setStart_time(LocalDateTime.now().plusDays(1).withHour(17).withMinute(30).withSecond(0)); // I morgen kl. 17:30 (Sal 2)
        showtimeRepository.save(showing9);

        Showing showing10 = new Showing();
        showing10.setMovie(movie2);
        showing10.setTheatre(theatre);
        showing10.setStart_time(LocalDateTime.now().plusDays(2).withHour(10).withMinute(0).withSecond(0)); // Om to dage kl. 10:00 (Sal 1)
        showtimeRepository.save(showing10);

        Showing showing11 = new Showing();
        showing11.setMovie(movie5);
        showing11.setTheatre(theatre);
        showing11.setStart_time(LocalDateTime.now().plusDays(3).withHour(18).withMinute(0).withSecond(0)); // Om tre dage kl. 18:00 (Sal 1)
        showtimeRepository.save(showing11);

        // --- TILFØJEDE FORESTILLINGER SLUT ---
        System.out.println("Oprettet 11 forestillinger."); // Opdateret tæller

        Admin adm = new Admin();
        adm.setUsername("admin jensen");
        adm.setPassword("1234");
        adminJpaRepository.save(adm);
        System.out.println("Admin oprettet oprettet");

    }
}