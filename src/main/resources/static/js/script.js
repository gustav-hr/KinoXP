// Importer funktionen fra loadings.js
import { fetchAndRenderShowings } from './showings.js';

document.addEventListener('DOMContentLoaded', function () {
    const movieContainer = document.getElementById('movie-container');
    const movieTemplate = document.getElementById('movie-template');
    const seatModalElement = document.getElementById('seatSelectionModal');
    const seatModal = new bootstrap.Modal(seatModalElement);

    // Hent filmdata fra backend
    fetch('/movies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movies => {
            movies.forEach(movie => {
                // Klon filmkortets skabelon
                const movieCard = movieTemplate.content.cloneNode(true);

                // Find elementerne i det klonede kort
                const titleEl = movieCard.querySelector('.movie-title');
                const posterEl = movieCard.querySelector('.movie-poster');
                const genreEl = movieCard.querySelector('.movie-genre');
                const durationEl = movieCard.querySelector('.movie-duration');
                const ageLimitEl = movieCard.querySelector('.movie-age-limit');
                const releaseDateEl = movieCard.querySelector('.movie-release-date');
                const descriptionEl = movieCard.querySelector('.movie-description');
                const actorsEl = movieCard.querySelector('.movie-actors');
                const durationTextEl = movieCard.querySelector('.movie-duration-text');
                const ageLimitTextEl = movieCard.querySelector('.movie-age-limit-text');
                const showtimesContainer = movieCard.querySelector('.movie-showtimes-container');

                // Udfyld elementerne med data fra filmen
                titleEl.textContent = movie.title;
                posterEl.src = movie.poster_url;
                posterEl.alt = `Filmplakat for ${movie.title}`;
                genreEl.textContent = movie.genre;
                durationEl.textContent = `${movie.duration_minutes}m`;
                durationTextEl.textContent = `${movie.duration_minutes}m`;
                ageLimitEl.textContent = movie.age_rating;
                ageLimitTextEl.textContent = movie.age_rating;
                releaseDateEl.textContent = new Date(movie.published_date).toLocaleDateString();
                descriptionEl.textContent = movie.description;
                actorsEl.textContent = movie.actors;

                // Kald funktionen fra showings.js for at hente og vise forestillinger
                fetchAndRenderShowings(movie, showtimesContainer);

                // Tilføj det udfyldte filmkort til containeren
                movieContainer.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('Der var et problem med at hente filmene:', error);
            movieContainer.innerHTML = '<p>Kunne ikke indlæse film. Prøv venligst igen senere.</p>';
        });


    // --- Logik for annullering af booking-modal ---
    const step1 = document.getElementById('modal-step-1');
    const step2 = document.getElementById('modal-step-2');
    const footer1 = document.getElementById('footer-step-1');
    const footer2 = document.getElementById('footer-step-2');
    const submitBtn = document.getElementById('submit-booking-code');
    const backBtn = document.getElementById('back-to-step-1');

    submitBtn.addEventListener('click', function (event) {
        event.preventDefault();
        step1.classList.add('d-none');
        footer1.classList.add('d-none');
        step2.classList.remove('d-none');
        footer2.classList.remove('d-none');
    });

    backBtn.addEventListener('click', function () {
        step2.classList.add('d-none');
        footer2.classList.add('d-none');
        step1.classList.remove('d-none');
        footer1.classList.remove('d-none');
    });


    // --- Logik for sædevalg-modal ---
    const seatMapContainer = document.getElementById('seat-map-container');
    const rows = 20;
    const seatsPerRow = 12;

    function generateSeats() {
        seatMapContainer.innerHTML = '';
        for (let i = 0; i < rows * seatsPerRow; i++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            if (Math.random() < 0.2) {
                seat.classList.add('sold');
            }
            seatMapContainer.appendChild(seat);
        }
    }

    seatMapContainer.addEventListener('click', function (event) {
        const clickedEl = event.target;
        if (clickedEl.classList.contains('seat') && !clickedEl.classList.contains('sold')) {
            clickedEl.classList.toggle('selected');
        }
    });

    movieContainer.addEventListener('click', function (event) {
        const clickedEl = event.target;
        if (clickedEl.classList.contains('showtime-btn')) {
            event.preventDefault();
            generateSeats();
            seatModal.show();
        }
    });
});