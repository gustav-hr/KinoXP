package repository;

import model.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TheatreJpaRepository extends JpaRepository<Theatre, Integer> {
}
