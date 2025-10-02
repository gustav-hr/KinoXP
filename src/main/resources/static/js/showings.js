// Eksporter en funktion, der henter og render showings
export function fetchAndRenderShowings(movie, showtimesContainer) {
    showtimesContainer.innerHTML = '';

    // Brug filmens ID til at hente showings fra backend
    fetch(`/showings/movie/${movie.movie_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(showings => {
            if (showings.length === 0) {
                showtimesContainer.innerHTML = '<p class="text-center text-muted">Ingen forestillinger på nuværende tidspunkt.</p>';
                return;
            }

            // Gruppér showings efter dato
            const showingsByDate = {};
            showings.forEach(showing => {
                const date = new Date(showing.start_time).toLocaleDateString();
                if (!showingsByDate[date]) {
                    showingsByDate[date] = [];
                }
                showingsByDate[date].push(showing);
            });

            // Opret HTML for hver dags forestillinger
            for (const date in showingsByDate) {
                const showtimesCol = document.createElement('div');
                showtimesCol.classList.add('col');

                const dateHeader = document.createElement('h6');
                dateHeader.classList.add('text-center', 'fw-bold', 'text-nowrap');
                dateHeader.textContent = date;

                const showtimeButtonsContainer = document.createElement('div');
                showtimeButtonsContainer.classList.add('d-grid', 'gap-2', 'mt-3');

                // Opret en knap for hver showing
                showingsByDate[date].forEach(showing => {
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
                showtimesContainer.appendChild(showtimesCol);
            }
        })
        .catch(error => {
            console.error(`Fejl ved indlæsning af forestillinger for film:`, error);
        });
}