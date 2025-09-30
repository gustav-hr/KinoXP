package repository;

import model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingJpaRepository extends JpaRepository<Booking, Integer> {
}
