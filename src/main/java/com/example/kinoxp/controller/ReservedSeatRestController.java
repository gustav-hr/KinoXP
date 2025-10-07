package com.example.kinoxp.controller;

import com.example.kinoxp.model.ReservedSeat;
import com.example.kinoxp.model.Showing;
import com.example.kinoxp.service.ReservedSeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ReservedSeatRestController {

    @Autowired
    ReservedSeatService reservedSeatService;


    @GetMapping("/reserved-seats/showing/{showingId}")
    public List<ReservedSeat> getReservedSeatsByShowing(@PathVariable int showingId) {
        return reservedSeatService.getReservedSeatsByShowingId(showingId);
    }

}
