package com.example.kinoxp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int seat_id;
    @ManyToOne
    @JoinColumn(name = "theatre_id")
    private Theatre theatre;
    private int row_number;
    private int seat_number;

    public Seat() {}

}
