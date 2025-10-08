package com.example.kinoxp.repository;

import com.example.kinoxp.model.ReservedSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ReservedSeatJpaRepository extends JpaRepository<ReservedSeat, Integer> {

    List<ReservedSeat> getAllByShow_ShowId(int showId);

    @Transactional
    void deleteAllByShow_ShowId(int showId);

}
