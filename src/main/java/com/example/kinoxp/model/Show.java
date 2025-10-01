package com.example.kinoxp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int show_id;
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
    @ManyToOne
    @JoinColumn(name = "theatre_id")
    private Theatre theatre;
    private LocalDateTime start_time;

    public Show() {}

}
