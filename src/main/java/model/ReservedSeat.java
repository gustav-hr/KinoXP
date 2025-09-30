package model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ReservedSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int reserved_seat_id;
    @ManyToOne
    @JoinColumn(name = "show_id")
    private Show show;
    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;


}
