const currentWeekElement = document.getElementById('currentWeek');
const pastWeekBtn = document.getElementById('pastWeek');
const comingWeekBtn = document.getElementById('comingWeek');

let selectedSeats = [];
let currentShowingId = null;
let currentTheatreId = null;

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

                    button.dataset.showingId = showing.showId;
                    button.dataset.theatreId = showing.theatre.theatreId;

                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const sId = parseInt(e.currentTarget.dataset.showingId);
                        const tId = parseInt(e.currentTarget.dataset.theatreId);
                        console.log(showings);

                        currentShowingId = sId;
                        currentTheatreId = tId;


                        renderSeatMap(sId, tId);
                        seatModal.show();
                    });

                    // Formater tidspunktet
                    const time = new Date(showing.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    console.log("Showing:", showing);
                    console.log("Theatre:", showing.theatre);
                    console.log("test test test test test test ")

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

function updatePastWeekButtonState() {
    if (currentWeekOffset === 0) {
        // Deaktiver og skjul knappen, når vi er i den aktuelle uge
        pastWeekBtn.disabled = true;
        pastWeekBtn.style.visibility = 'hidden';
    } else {
        // Aktiver og vis knappen for tidligere uger
        pastWeekBtn.disabled = false;
        pastWeekBtn.style.visibility = 'visible';
    }
}

export function setupWeekNavigation(renderAllMoviesCallBack) {
    updateWeekHeader();
    updatePastWeekButtonState();

    pastWeekBtn.disable = currentWeekOffset === 0;

    pastWeekBtn.addEventListener('click', () => {
        if (currentWeekOffset > 0) {
            currentWeekOffset--;
            updateWeekHeader();
            updatePastWeekButtonState();
            renderAllMoviesCallBack();
        }
    });

    comingWeekBtn.addEventListener('click', () => {
        currentWeekOffset++;
        updateWeekHeader();
        updatePastWeekButtonState();
        renderAllMoviesCallBack();
    })

}

// ---------------------------------------- SEATS, SELECT AND CONFIRM BOOKING ----------------------------------------

// Hent modal-elementet og opret en Bootstrap modal-instans
const seatModalElement = document.getElementById('seatSelectionModal');
const seatModal = new bootstrap.Modal(seatModalElement);
const seatMapContainer = document.getElementById('seat-map-container');

// variabel til at holde de valgte sæder

//funcktion der tegner sæderne i modalen
async function renderSeatMap(showingId, theatreId) {
    selectedSeats = []; //nulstil valgte sæder ved hver ny visning
    console.log("Theatre ID:", theatreId);
    console.log("Showing ID:", showingId);


    try {

        // 1. hent alle sæder for teatret
        const seatResponse = await fetch(`/seats/theatre/${theatreId}`)
        if (!seatResponse.ok) {
            throw new Error('Could not fetch seats.');
        }
        const allSeats = await seatResponse.json();

        // 2. hent reserverede sæder for forestillingen
        const reservedResponse = await fetch(`/reserved-seats/showing/${showingId}`)
        if (!reservedResponse.ok) throw new Error('Could not fetch reserved seats.');
        const reservedSeats = await reservedResponse.json();

        // Lav et Set af ID'er for hurtig opslag
        const reservedSeatIds = new Set(reservedSeats.map(rs => rs.seat.seat_id));

        // 3. Opret sædekortet
        seatMapContainer.innerHTML = '';
        const maxRow = Math.max(...allSeats.map(s => s.seat_row));

        // Gruppér sæder efter række
        const seatsByRow = allSeats.reduce((acc, seat) => {
            if (!acc[seat.seat_row]) {
                acc[seat.seat_row] = [];
            }
            acc[seat.seat_row].push(seat);
            return acc;
        }, {});

        for (let r = 1; r <= maxRow; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('seat-row', 'd-flex', 'justify-content-center', 'gap-2', 'mb-2', 'align-items-center');

            const rowLabel = document.createElement('span');
            rowLabel.classList.add('fw-bold', 'text-warning');
            rowLabel.textContent = `Række ${r}:`;
            rowDiv.appendChild(rowLabel);

            // Sorter sæderne i rækken efter sædenummer
            const seatsInRow = seatsByRow[r] ? seatsByRow[r].sort((a, b) => a.seat_number - b.seat_number) : [];

            seatsInRow.forEach(seat => {
                const isReserved = reservedSeatIds.has(seat.seat_id);

                const seatElement = document.createElement('div');
                seatElement.classList.add('seat-box', 'rounded', 'p-2', 'text-center', 'fw-bold', 'cursor-pointer');
                seatElement.textContent = seat.seat_number;
                seatElement.dataset.seatId = seat.seat_id;

                if (isReserved) {
                    seatElement.classList.add('bg-danger', 'text-white', 'sold');
                    seatElement.style.pointerEvents = 'none'; // Gør udsolgte sæder ikke-klikbare
                } else {
                    seatElement.classList.add('bg-success', 'text-dark', 'available');
                    seatElement.addEventListener('click', () => toggleSeatSelection(seatElement, seat));
                }

                rowDiv.appendChild(seatElement);
            });

            seatMapContainer.appendChild(rowDiv);

        }

        // Tilføj en "Lærred" visuelt
        const screenDiv = document.createElement('div');
        screenDiv.classList.add('text-center', 'mt-4', 'p-2', 'bg-secondary', 'text-white', 'rounded');
        screenDiv.textContent = 'Lærred / Skærm';
        seatMapContainer.prepend(screenDiv);

    } catch (error) {
        console.error("error rendering seat map:", error);
        seatMapContainer.innerHTML = '<p class="text-danger">Kunne ikke indlæse sæder.</p>';
    }


}

// Funktion til at håndtere klik på sæde
function toggleSeatSelection(seatElement, seatData) {
    const seatId = seatData.seat_id;
    const index = selectedSeats.findIndex(s => s.seat_id === seatId);

    if (index > -1) {
        // Sædet er allerede valgt -> afvælg det
        selectedSeats.splice(index, 1);
        seatElement.classList.remove('bg-warning', 'selected');
        seatElement.classList.add('bg-success');
    } else {
        // Sædet er ikke valgt -> vælg det
        selectedSeats.push(seatData);
        seatElement.classList.remove('bg-success');
        seatElement.classList.add('bg-warning', 'selected');
    }
    console.log("Valgte sæder:", selectedSeats);
}

const cancelBtn = document.getElementById('seat-map-cancel-btn'); // Cancel
const closeBtn = document.getElementById('seat-map-close-btn'); // kryds
const confirmBtn = document.getElementById('seat-map-confirm-btn'); // Confirm

console.log('Cancel Button:', cancelBtn);
console.log('Close Button:', closeBtn);

cancelBtn.addEventListener('click', () => {
    seatModal.hide();
    selectedSeats = [];
});

closeBtn.addEventListener('click', () => {
    seatModal.hide();
    selectedSeats = [];
});

confirmBtn.addEventListener('click', async() => {
    const email = prompt("indtast din email for booking:")

    if(!email || selectedSeats.length === 0) {
        alert("ingen sæder valgt eller ingen email!")
        return;
    }

    //lav en liste med seatIds
    const seatIds = selectedSeats.map(seat => seat.seat_id);

    try {
        console.log("Sender booking-data:", JSON.stringify({
            email,
            showId: currentShowingId,
            seatIds: seatIds
        }));

        //opret booking
        const bookingResponse = await fetch("http://localhost:8080/api/bookings/create", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                showId: currentShowingId,
                seatIds: seatIds
            })
        });

        if(!bookingResponse.ok) throw new Error('kunne ikke oprette booking');

        const data = await bookingResponse.json();
        console.log("Booking gennemført:", data);

        alert('Booking gennemført! dit Booking nummer er: '+ data.booking_id);
        seatModal.hide();

        //opdater showing
        renderSeatMap(currentShowingId, currentTheatreId)
    } catch (err) {
        console.error(err);
        alert('Noget gik galt, prøv igen')
    }
});


