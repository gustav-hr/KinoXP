// Importer funktionen
import { fetchAndRenderShowings, setupWeekNavigation } from './showings.js';

    const movieContainer = document.getElementById('movie-container');
    const movieTemplate = document.getElementById('movie-template');
    const seatModalElement = document.getElementById('seatSelectionModal');
    const seatModal = new bootstrap.Modal(seatModalElement);


 function renderAllMovies() {

    // Hent filmdata fra backend
    fetch('/movies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movies => {
            //tømmer container
            movieContainer.innerHTML = '';

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
                console.log("yaaaaaaaaaaaaaaaaaaank")
                console.log("Movie:", movie)
                console.log("Showtimecontainer:",showtimesContainer)
                fetchAndRenderShowings(movie, showtimesContainer);

                // Tilføj det udfyldte filmkort til containeren
                movieContainer.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('Der var et problem med at hente filmene:', error);
            movieContainer.innerHTML = '<p>Kunne ikke indlæse film. Prøv venligst igen senere.</p>';
        })
 }

 document.addEventListener("DOMContentLoaded", () => {
     renderAllMovies();
     setupWeekNavigation(renderAllMovies)

     const submitBtn = document.getElementById("submit-booking-code");
     console.log("heeeeeeeeeeere")
     console.log("submitBtn:", submitBtn);
     const emailInput = document.getElementById("emailInput");
     const bookingCodeInput = document.getElementById("bookingCodeInput");
     const cancelModalElement = document.getElementById("cancelBookingModal");
     const cancelModal = new bootstrap.Modal(cancelModalElement);


     submitBtn.addEventListener('click', async () => {
         const email = emailInput.value;
         const bookingCode = parseInt(bookingCodeInput.value);

         console.log("Email: " + email + " | Code: " + bookingCode);

         if (!email || isNaN(bookingCode)) {
             alert("Indtast både gyldig email og bookingkode (kun tal).");
             return;
         }
         try {
             const response = await fetch("http://localhost:8080/api/bookings/delete/booking", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ email, bookingCode })
             });

             const message = await response.text();

             if (!response.ok) {
                 throw new Error(message);
             }

             showConfirmationModal(message);

         } catch (err) {
             alert("Fejl: " + err.message);
         }
     });
 });

function showConfirmationModal(message) {
    let confirmModalEl = document.getElementById("confirmationModal");

    if (!confirmModalEl) {
        confirmModalEl = document.createElement("div");
        confirmModalEl.className = "modal fade";
        confirmModalEl.id = "confirmationModal";
        confirmModalEl.tabIndex = -1;
        confirmModalEl.innerHTML = `
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Booking annulleret</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p id="confirmationMessage"></p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Luk</button>
              </div>
            </div>
          </div>`;
        document.body.appendChild(confirmModalEl);
    }

    document.getElementById("confirmationMessage").textContent = message;
    new bootstrap.Modal(confirmModalEl).show();
}








