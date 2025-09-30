package repository;

import model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatJpaRepository extends JpaRepository<Seat, Integer> {
}
