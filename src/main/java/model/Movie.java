package model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int movie_id;
    private String title;
    private String description;
    private int duration_minutes;
    private int age_rating;
    private String poster_url;
    private String actors;
    private String genre;
    private Date published_date;

    public Movie() {}









}
