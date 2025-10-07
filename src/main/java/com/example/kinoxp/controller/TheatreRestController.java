package com.example.kinoxp.controller;

import com.example.kinoxp.model.Seat;
import com.example.kinoxp.service.SeatService;
import com.example.kinoxp.service.ShowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TheatreRestController {

    @Autowired
    ShowingService showingService;

    @Autowired
    SeatService seatService;

    @GetMapping("/seats/theatre/{theatreId}")
    public List<Seat> getAllSeatByTheatreId(@PathVariable int theatreId) {
        return seatService.getSeatsByTheatreId(theatreId);
    }


}
