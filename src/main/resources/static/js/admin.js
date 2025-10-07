const movieContainer = document.getElementById('movie-container');
const movieTemplate = document.getElementById('movie-template');
const currentWeekElement = document.getElementById('currentWeek');
const pastWeekBtn = document.getElementById('pastWeek');
const comingWeekBtn = document.getElementById('comingWeek');
const logoutBtn = document.getElementById('logout-btn');

// Variabler til redigering/oprettelse af film
const editMovieModal = document.getElementById('editMovieModal');
const editMovieForm = document.getElementById('editMovieForm');
const modalTitleSpan = document.getElementById('modal-movie-title');
const modalActionTypeSpan = document.getElementById('modal-action-type');
const saveMovieBtn = document.getElementById('save-movie-btn');
const addMovieBtn = document.getElementById('add-movie-btn');

// NYE variabler til SHOWING
const addShowingModal = document.getElementById('addShowingModal');
const addShowingForm = document.getElementById('addShowingForm');
const showingMovieTitleSpan = document.getElementById('showing-movie-title');
const showingTheatreSelect = document.getElementById('showing-theatre');

// holder styr på ugen: 0 = denne uge
let currentWeekOffset = 0;

// --- UGE-LOGIK OG VISNING (Ingen ændringer her) ---
// (getWeekDates, updateWeekHeader, fetchAndRenderShowings, setupWeekNavigation)

function getWeekDates(weekOffset) {
    const today = new Date();
    today.setDate(today.getDate() + (weekOffset * 7));
    const monday = new Date(today);

    let dayOfWeek = monday.getDay();
    if (dayOfWeek === 0) {
        dayOfWeek = 7;
    }
    let diffToMonday = dayOfWeek - 1;

    monday.setDate(monday.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    const weekDates = [];
    let currentDay = new Date(monday);
    for (let i = 0; i < 7; i++) {
        weekDates.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
    }

    return {monday, sunday, dates: weekDates};
}

function updateWeekHeader() {
    const {monday, sunday} = getWeekDates(currentWeekOffset);
    const options = {day: '2-digit', month: '2-digit', year: '2-digit'};
    const formattedMonday = monday.toLocaleDateString('da-DK', options);
    const formattedSunday = sunday.toLocaleDateString('da-DK', options);

    if (currentWeekElement) {
        currentWeekElement.textContent = `${formattedMonday} - ${formattedSunday}`;
    }
}

export function fetchAndRenderShowings(movie, showingsContainer) {
    showingsContainer.innerHTML = '';

    const {dates: weekDates} = getWeekDates(currentWeekOffset);

    fetch(`/showings/movie/${movie.movie_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(showings => {
            const showingsByDate = {};
            showings.forEach(showing => {
                const showingDate = new Date(showing.start_time);
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

            weekDates.forEach(dayDate => {
                const showtimesCol = document.createElement('div');
                showtimesCol.classList.add('col');

                const dateKey = dayDate.toLocaleDateString('da-DK', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                });

                const dateHeader = document.createElement('h6');
                dateHeader.classList.add('text-center', 'fw-bold', 'text-nowrap');
                dateHeader.textContent = dateKey;

                const showtimeButtonsContainer = document.createElement('div');
                showtimeButtonsContainer.classList.add('d-grid', 'gap-2', 'mt-3');

                const dailyShowings = showingsByDate[dateKey] || [];

                dailyShowings.forEach(showing => {
                    const button = document.createElement('a');
                    button.href = '#';
                    button.classList.add('btn', 'btn-light', 'text-nowrap', 'showtime-btn');

                    const time = new Date(showing.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    button.textContent = `Sal ${showing.theatre.theatreId} kl. ${time}`;
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
    });
}
// --- REDIGERING/OPRETTELSE AF FILM LOGIK (Uændret) ---

function formatDateToInput(isoDateString) {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function handleMovieUpdate(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const movieData = {};
    let isCreating = false;

    formData.forEach((value, key) => {
        if (['movie_id', 'duration_minutes', 'age_rating'].includes(key)) {
            const numVal = parseInt(value) || 0;
            movieData[key] = numVal;
            if (key === 'movie_id' && numVal === 0) {
                isCreating = true;
            }
        } else if (key === 'published_date') {
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
            const modal = bootstrap.Modal.getInstance(editMovieModal);
            if (modal) {
                modal.hide();
            }
            renderAllMovies();
            alert(successMessage);
        })
        .catch(error => {
            console.error('Fejl ved opdatering/oprettelse af filmen:', error);
            alert('Kunne ikke gemme ændringer. Se konsollen for detaljer.');
        });
}

editMovieForm.addEventListener('submit', handleMovieUpdate);

addMovieBtn.addEventListener('click', () => {
    editMovieForm.reset();
    document.getElementById('edit-movie-id').value = 0;
    modalActionTypeSpan.textContent = 'Tilføj Ny';
    modalTitleSpan.textContent = '';
    saveMovieBtn.textContent = 'Opret Film';
});

// --- SLET FILM LOGIK (NY FUNKTION) ---

function handleDeleteMovie(movieId, movieTitle) {
    if (confirm(`Er du SIKKER på, at du vil slette filmen: "${movieTitle}"? Dette sletter også alle dens forestillinger!`)) {
        fetch(`/deletemovie/${movieId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    // Tjek for 204 No Content, som er normalt ved successfuld DELETE
                    if (response.status !== 204) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                // Film slettet succesfuldt
                alert(`Filmen '${movieTitle}' blev slettet.`);
                renderAllMovies(); // Genindlæs alle film for at opdatere listen
            })
            .catch(error => {
                console.error('Fejl ved sletning af filmen:', error);
                alert('Kunne ikke slette filmen. Se konsollen for detaljer.');
            });
    }
}

// --- NY SHOWING LOGIK (Uændret) ---

async function fetchTheatres() {
    try {
        const response = await fetch('/theatres');
        if (!response.ok) throw new Error('Kunne ikke hente teatersale');
        return await response.json();
    } catch (error) {
        console.error('Fejl ved hentning af teatersale:', error);
        return [];
    }
}

async function populateTheatreDropdown() {
    const theatres = await fetchTheatres();
    showingTheatreSelect.innerHTML = '<option value="" disabled selected>Vælg en sal</option>';

    theatres.forEach(theatre => {
        const option = document.createElement('option');
        option.value = theatre.theatreId;
        option.textContent = `Sal ${theatre.theatreId} (${theatre.name || 'Ukendt'}) - ${theatre.capacity} pladser`;
        showingTheatreSelect.appendChild(option);
    });
}

function handleAddShowing(movieTitle, movieId) {
    showingMovieTitleSpan.textContent = movieTitle;
    document.getElementById('showing-movie-id').value = movieId;
    addShowingForm.reset();

    // Sætter min-dato til i dag
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('showing-date').min = today;

    populateTheatreDropdown();
}

addShowingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const movieId = document.getElementById('showing-movie-id').value;
    const dateStr = document.getElementById('showing-date').value;
    const timeStr = document.getElementById('showing-time').value;
    const theatreId = document.getElementById('showing-theatre').value;

    // Kombiner dato og tidspunkt til ISO-format for backend (LocalDateTime)
    // Starter med YYYY-MM-DDTHH:MM:SS
    const startTimeISO = `${dateStr}T${timeStr}:00`;

    const showingData = {
        // Bemærk: Backend forventer Movie og Theatre objekter, men Spring kan
        // ofte håndtere kun ID'et, hvis du sætter det som et nested objekt.
        // Vi sender det som nested ID for at matche JPA's forventning.
        movie: { movie_id: parseInt(movieId) },
        theatre: { theatreId: parseInt(theatreId) },
        start_time: startTimeISO
    };

    fetch('/addshowing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(showingData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(newShowing => {
            const modal = bootstrap.Modal.getInstance(addShowingModal);
            if (modal) {
                modal.hide();
            }
            renderAllMovies(); // Genindlæs film for at vise den nye showing
            alert(`Ny forestilling for ${showingMovieTitleSpan.textContent} i sal ${theatreId} blev oprettet!`);
        })
        .catch(error => {
            console.error('Fejl ved oprettelse af forestilling:', error);
            alert('Kunne ikke oprette forestilling. Se konsollen for detaljer.');
        });
});


// --- RENDER LOGIK (Opdateret med ny knap event listener) ---

function renderAllMovies() {

    fetch('/movies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movies => {
            movieContainer.innerHTML = '';

            movies.forEach(movie => {
                const movieCard = movieTemplate.content.cloneNode(true);

                const titleEl = movieCard.querySelector('.movie-title');
                const posterEl = movieCard.querySelector('.movie-poster');
                const movieCardDiv = movieCard.querySelector('.border.rounded-3.p-4.mb-4.shadow-sm');
                const showtimesContainer = movieCard.querySelector('.movie-showtimes-container');
                const editButton = movieCard.querySelector('.edit-movie-btn');

                // Hent knappen til at tilføje showing
                const addShowingButton = movieCard.querySelector('.add-showing-btn');

                // NY: Hent knappen til at slette film
                const deleteButton = movieCard.querySelector('.delete-movie-btn');


                // Udfyld elementerne...
                movieCardDiv.dataset.movieId = movie.movie_id;
                titleEl.textContent = movie.title;
                posterEl.src = movie.poster_url;

                // ... (resten af udfyldning af movie info)
                movieCard.querySelector('.movie-genre').textContent = movie.genre;
                movieCard.querySelector('.movie-duration').textContent = `${movie.duration_minutes}m`;
                movieCard.querySelector('.movie-duration-text').textContent = `${movie.duration_minutes}m`;
                movieCard.querySelector('.movie-age-limit').textContent = movie.age_rating;
                movieCard.querySelector('.movie-age-limit-text').textContent = movie.age_rating;
                movieCard.querySelector('.movie-release-date').textContent = new Date(movie.published_date).toLocaleDateString();
                movieCard.querySelector('.movie-description').textContent = movie.description;
                movieCard.querySelector('.movie-actors').textContent = movie.actors;


                // Tilføj event listener til Rediger knappen (Uændret)
                editButton.addEventListener('click', () => {
                    // ... (sætter værdier i editMovie modal) ...
                    document.getElementById('edit-movie-id').value = movie.movie_id;
                    document.getElementById('edit-title').value = movie.title;
                    document.getElementById('edit-description').value = movie.description;
                    document.getElementById('edit-duration-minutes').value = movie.duration_minutes;
                    document.getElementById('edit-age-rating').value = movie.age_rating;
                    document.getElementById('edit-poster-url').value = movie.poster_url;
                    document.getElementById('edit-actors').value = movie.actors;
                    document.getElementById('edit-genre').value = movie.genre;
                    document.getElementById('edit-published-date').value = formatDateToInput(movie.published_date);

                    modalActionTypeSpan.textContent = 'Rediger';
                    modalTitleSpan.textContent = movie.title;
                    saveMovieBtn.textContent = 'Gem Ændringer';
                });

                // Tilføj event listener til Tilføj Forestilling knappen
                addShowingButton.addEventListener('click', () => {
                    handleAddShowing(movie.title, movie.movie_id);
                });

                // NY: Tilføj event listener til Slet knappen
                deleteButton.addEventListener('click', () => {
                    handleDeleteMovie(movie.movie_id, movie.title);
                });


                fetchAndRenderShowings(movie, showtimesContainer);
                movieContainer.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('Der var et problem med at hente filmene:', error);
            movieContainer.innerHTML = '<p>Kunne ikke indlæse film. Prøv venligst igen senere.</p>';
        });
}

document.addEventListener("DOMContentLoaded", () => {
    renderAllMovies();
    setupWeekNavigation(renderAllMovies);

    new bootstrap.Modal(editMovieModal);
    new bootstrap.Modal(addShowingModal); // Initialiser den nye modal

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Logger ud... Omdirigerer til login siden.');
            window.location.href = 'login';
        });
    }
});