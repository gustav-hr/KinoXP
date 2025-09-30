package repository;

import model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminJpaRepository extends JpaRepository<Admin, Integer>{
}
