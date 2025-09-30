package repository;

import model.ReservedSeat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservedSeatJpaRepository extends JpaRepository<ReservedSeat, Integer> {
}
