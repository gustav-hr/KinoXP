package com.example.kinoxp.repositorytest;

import com.example.kinoxp.model.Seat;
import com.example.kinoxp.model.Theatre;
import com.example.kinoxp.repository.SeatJpaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
public class SeatJpaRepositoryTest {

    @Autowired
    private SeatJpaRepository seatJpaRepository;

    @Autowired
    private TestEntityManager entityManager;


    //Tester den custom-definerede query-metode: getAllByTheatre_TheatreId
    @Test
    void whenGetAllByTheatreId_thenReturnCorrectSeats() {
        // ARRANGE (Opsætning af testdata)
        Theatre theatre1 = new Theatre();
        theatre1.setName("Sal 1");
        // Gem Theatre1 og Theatre2 i den midlertidige database.
        theatre1 = entityManager.persistAndFlush(theatre1); // ID er sat

        Theatre theatre2 = new Theatre();
        theatre2.setName("Sal 2");
        theatre2 = entityManager.persistAndFlush(theatre2); // ID er sat

        // Opret pladser til Theatre 1
        Seat seat1A = new Seat();
        seat1A.setSeat_row(1);
        seat1A.setSeat_number(1);
        seat1A.setTheatre(theatre1);
        entityManager.persist(seat1A); // Gem i database

        Seat seat1B = new Seat();
        seat1B.setSeat_row(1);
        seat1B.setSeat_number(2);
        seat1B.setTheatre(theatre1);
        entityManager.persist(seat1B); // Gem i database

        // Opret plads til Theatre 2
        Seat seat2A = new Seat();
        seat2A.setSeat_row(1);
        seat2A.setSeat_number(1);
        seat2A.setTheatre(theatre2);
        entityManager.persist(seat2A); // Gem i database

        // VIGTIGT: Flush for at sikre, at alle gemme-operationer er skrevet til databasen.
        // Clear for at tømme JPA's cache. Dette tvinger repository'et til at hente data
        // direkte fra H2-databasen og ikke fra Persistence Context.
        entityManager.flush();
        entityManager.clear(); // <--- DÉT ER LØSNINGEN!

        // ACT (Udfør handlingen)
        // Hent alle pladser fra Theatre 1's ID.
        List<Seat> foundSeats = seatJpaRepository.getAllByTheatre_TheatreId(theatre1.getTheatreId());

        // ASSERT (Verificer resultatet)
        // 1. Tjek at listen har den korrekte størrelse (2 pladser).
        assertThat(foundSeats).hasSize(2);
        // 2. Tjek at alle pladser i listen faktisk tilhører Theatre 1.
        Theatre finalTheatre = theatre1;
        assertTrue(foundSeats.stream().allMatch(s -> s.getTheatre().getTheatreId() == finalTheatre.getTheatreId()),
                "Alle fundne pladser skal have Theatre ID " + theatre1.getTheatreId());
        // 3. Tjek at den plads, der tilhører Theatre 2, IKKE er i listen.
        Theatre finalTheatre1 = theatre2;
        assertFalse(foundSeats.stream().anyMatch(s -> s.getTheatre().getTheatreId() == finalTheatre1.getTheatreId()),
                "Pladser fra andre biografer bør ikke være i listen.");
    }
}