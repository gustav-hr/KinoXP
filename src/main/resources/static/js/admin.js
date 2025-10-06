const movieContainer = document.getElementById('movie-container');
const movieTemplate = document.getElementById('movie-template');
const currentWeekElement = document.getElementById('currentWeek');
const pastWeekBtn = document.getElementById('pastWeek');
const comingWeekBtn = document.getElementById('comingWeek');
const logoutBtn = document.getElementById('logout-btn');

// NYE variabler til redigering/oprettelse
const editMovieModal = document.getElementById('editMovieModal');
const editMovieForm = document.getElementById('editMovieForm');
const modalTitleSpan = document.getElementById('modal-movie-title');
const modalActionTypeSpan = document.getElementById('modal-action-type');
const saveMovieBtn = document.getElementById('save-movie-btn');

// NY variabel til Tilføj Film knap
const addMovieBtn = document.getElementById('add-movie-btn');


// holder styr på ugen: 0 = denne uge
let currentWeekOffset = 0;

// --- UGE-LOGIK OG VISNING ---

function getWeekDates(weekOffset) {
    const today = new Date();
    // juster startdato baseret på offset
    today.setDate(today.getDate() + (weekOffset * 7))
    const monday = new Date(today);

    let dayOfWeek = monday.getDay(); // 0 (Søn) til 6 (Lør)
    // Justering: Søndag (0) til 7
    if (dayOfWeek === 0) {
        dayOfWeek = 7;
    }
    let diffToMonday = dayOfWeek - 1;

    // sæt datoen til ugens mandag og søndag
    monday.setDate(monday.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    // array med alle ugens 7 datoer
    const weekDates = [];
    let currentDay = new Date(monday);
    for (let i = 0; i < 7; i++) {
        weekDates.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
    }

    return {monday, sunday, dates: weekDates};
}

// Opdaterer overskiften (currentWeekElement) med datointervallet.
function updateWeekHeader() {
    const {monday, sunday} = getWeekDates(currentWeekOffset)
    const options = {day: '2-digit', month: '2-digit', year: '2-digit'}
    const formattedMonday = monday.toLocaleDateString('da-DK', options)
    const formattedSunday = sunday.toLocaleDateString('da-DK', options)

    if (currentWeekElement) {
        currentWeekElement.textContent = `${formattedMonday} - ${formattedSunday}`
    }
}

// Eksporter en funktion, der henter og render showings

export function fetchAndRenderShowings(movie, showingsContainer) {
    showingsContainer.innerHTML = '';

    const {dates: weekDates} = getWeekDates(currentWeekOffset)

    // Brug filmens ID til at hente showings fra backend
    fetch(`/showings/movie/${movie.movie_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(showings => {
            //Gruppér showings efter dato
            const showingsByDate = {};
            showings.forEach(showing => {
                const showingDate = new Date(showing.start_time);
                // Opret en nøgle i formatet dd/mm/yy
                const dateKey = showingDate.toLocaleDateString('da-DK', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                });

                if (!showingsByDate[dateKey]) {
                    showingsByDate[dateKey] = [];
                }
                showingsByDate[dateKey].push(showing);
            });


            // Opret HTML for hver af ugens dage

            weekDates.forEach(dayDate => {
                const showtimesCol = document.createElement('div');
                showtimesCol.classList.add('col');

                const dateKey = dayDate.toLocaleDateString('da-DK', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                });

                // Datooverskirft
                const dateHeader = document.createElement('h6');
                dateHeader.classList.add('text-center', 'fw-bold', 'text-nowrap');
                dateHeader.textContent = dateKey;

                // Knapcontainer
                const showtimeButtonsContainer = document.createElement('div');
                showtimeButtonsContainer.classList.add('d-grid', 'gap-2', 'mt-3');

                // showings på given dag
                const dailyShowings = showingsByDate[dateKey] || [];

                // Opret en knap for hver showing på en given dag
                dailyShowings.forEach(showing => {
                    const button = document.createElement('a');
                    button.href = '#';
                    button.classList.add('btn', 'btn-light', 'text-nowrap', 'showtime-btn');

                    // Formater tidspunktet
                    const time = new Date(showing.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    button.textContent = `Sal ${showing.theatre.theatre_id} kl. ${time}`;
                    showtimeButtonsContainer.appendChild(button);
                });

                showtimesCol.appendChild(dateHeader);
                showtimesCol.appendChild(showtimeButtonsContainer);
                showingsContainer.appendChild(showtimesCol);
            });

        })
        .catch(error => {
            console.error(`Fejl ved indlæsning af forestillinger for film:`, error);
        });
}

export function setupWeekNavigation(renderAllMoviesCallBack) {
    updateWeekHeader();

    pastWeekBtn.disable = currentWeekOffset === 0;

    pastWeekBtn.addEventListener('click', () => {
        if (currentWeekOffset > 0) {
            currentWeekOffset--;
            updateWeekHeader();
            pastWeekBtn.disable = currentWeekOffset === 0;
            renderAllMoviesCallBack();
        }
    });

    comingWeekBtn.addEventListener('click', () => {
        currentWeekOffset++;
        updateWeekHeader();
        pastWeekBtn.disable = false;
        renderAllMoviesCallBack();
    })

}

// --- NY REDIGERING/OPRETTELSE LOGIK ---

// Konverterer en dato i ISO-format (som fra backend) til en yyyy-MM-dd streng
function formatDateToInput(isoDateString) {
    const date = new Date(isoDateString);
    // Vi skal bruge YYYY-MM-DD for <input type="date">
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Måneder er 0-indekseret
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Håndterer opdatering/oprettelse af filmen via POST kald til backend
function handleMovieUpdate(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const movieData = {};
    let isCreating = false;

    // Byg et objekt ud fra formulardata
    formData.forEach((value, key) => {
        // Konverter numeriske felter
        if (['movie_id', 'duration_minutes', 'age_rating'].includes(key)) {
            // movie_id vil være enten et tal (ved redigering) eller en tom streng (ved oprettelse)
            const numVal = parseInt(value) || 0;
            movieData[key] = numVal;
            if (key === 'movie_id' && numVal === 0) {
                isCreating = true;
            }
        } else if (key === 'published_date') {
            // Sørg for at datoen sendes i et format backend kan forstå (ISO 8601)
            movieData[key] = new Date(value + 'T00:00:00Z').toISOString();
        } else {
            movieData[key] = value;
        }
    });

    const successMessage = isCreating
        ? `Filmen '${movieData.title}' blev OPRETTET!`
        : `Filmen '${movieData.title}' blev OPDATERET!`;


    fetch(`/addmovie`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(updatedMovie => {
            // Luk modalen
            const modal = bootstrap.Modal.getInstance(editMovieModal);
            if (modal) {
                modal.hide();
            }
            // Opdater filmvisningen for at afspejle ændringerne
            renderAllMovies();
            alert(successMessage);
        })
        .catch(error => {
            console.error('Fejl ved opdatering/oprettelse af filmen:', error);
            alert('Kunne ikke gemme ændringer. Se konsollen for detaljer.');
        });
}

// Event listener for formularen
editMovieForm.addEventListener('submit', handleMovieUpdate);


// --- NY FUNKTION: HÅNDTER KLIK PÅ "TILFØJ FILM" ---
addMovieBtn.addEventListener('click', () => {
    // 1. Nulstil formularen
    editMovieForm.reset();

    // 2. Nulstil det skjulte movie_id for at sikre INSERT i backend
    document.getElementById('edit-movie-id').value = 0;

    // 3. Opdater modalens titel og knaptekst
    modalActionTypeSpan.textContent = 'Tilføj Ny';
    modalTitleSpan.textContent = ''; // Titlen er ukendt
    saveMovieBtn.textContent = 'Opret Film';
});


// --- RENDER LOGIK (Opdateret) ---

function renderAllMovies() {

    // ... (resten af fetch-logikken) ...

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
                // Redigeringsknap og filmkort div
                const editButton = movieCard.querySelector('.edit-movie-btn');
                const movieCardDiv = movieCard.querySelector('.border.rounded-3.p-4.mb-4.shadow-sm');


                // Udfyld elementerne med data fra filmen
                movieCardDiv.dataset.movieId = movie.movie_id; // Sæt film ID på kortet
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

                // Tilføj event listener til Rediger knappen
                editButton.addEventListener('click', () => {
                    // Sæt data ind i modal-felterne
                    document.getElementById('edit-movie-id').value = movie.movie_id;
                    document.getElementById('edit-title').value = movie.title;
                    document.getElementById('edit-description').value = movie.description;
                    document.getElementById('edit-duration-minutes').value = movie.duration_minutes;
                    document.getElementById('edit-age-rating').value = movie.age_rating;
                    document.getElementById('edit-poster-url').value = movie.poster_url;
                    document.getElementById('edit-actors').value = movie.actors;
                    document.getElementById('edit-genre').value = movie.genre;
                    document.getElementById('edit-published-date').value = formatDateToInput(movie.published_date);

                    // Opdater modalens titel og knaptekst til redigering
                    modalActionTypeSpan.textContent = 'Rediger';
                    modalTitleSpan.textContent = movie.title;
                    saveMovieBtn.textContent = 'Gem Ændringer';
                });

                // Kald funktionen fra showings.js for at hente og vise forestillinger
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
    setupWeekNavigation(renderAllMovies);

    // Initialiser Bootstrap modal (ikke strengt nødvendigt, men god praksis)
    new bootstrap.Modal(editMovieModal);
})