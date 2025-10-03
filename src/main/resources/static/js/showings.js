const currentWeekElement = document.getElementById('currentWeek');
const pastWeekBtn = document.getElementById('pastWeek');
const comingWeekBtn = document.getElementById('comingWeek');

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

    if(currentWeekElement) {
        currentWeekElement.textContent = `${formattedMonday} - ${formattedSunday}`
    }
}

// Eksporter en funktion, der henter og render showings

 export function fetchAndRenderShowings(movie, showingsContainer) {
    showingsContainer.innerHTML = '';

    const  { dates: weekDates } = getWeekDates(currentWeekOffset)

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
                const dateKey = showingDate.toLocaleDateString('da-DK', {day: '2-digit', month: '2-digit', year: '2-digit'});

                if (!showingsByDate[dateKey]) {
                    showingsByDate[dateKey] = [];
                }
                showingsByDate[dateKey].push(showing);
            });


            // Opret HTML for hver af ugens dage

            weekDates.forEach(dayDate => {
                const showtimesCol = document.createElement('div');
                showtimesCol.classList.add('col');

                const dateKey = dayDate.toLocaleDateString('da-DK', {day: '2-digit', month: '2-digit', year: '2-digit'});

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
        if(currentWeekOffset > 0) {
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