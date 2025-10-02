package com.example.kinoxp.dto;

import java.util.List;

public class BookingRequest {
    private String email;
    private int showId;
    private List<Integer> seatIds;

    // Getters and setters, or use Lombok
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getShowId() { return showId; }
    public void setShowId(int showId) { this.showId = showId; }
    public List<Integer> getSeatIds() { return seatIds; }
    public void setSeatIds(List<Integer> seatIds) { this.seatIds = seatIds; }
}