    document.addEventListener('DOMContentLoaded', function () {
    // Hent alle de elementer, vi skal bruge
    const step1 = document.getElementById('modal-step-1');
    const step2 = document.getElementById('modal-step-2');
    const footer1 = document.getElementById('footer-step-1');
    const footer2 = document.getElementById('footer-step-2');

    const submitBtn = document.getElementById('submit-booking-code');
    const backBtn = document.getElementById('back-to-step-1');

    // Lyt efter klik på "Submit"-knappen
    submitBtn.addEventListener('click', function(event) {
    // Forhindrer formen i at genindlæse siden
    event.preventDefault();

    // HER vil du senere indsætte din logik til at tjekke koden.
    // For nu skifter vi bare til næste step med det samme.

    // Skjul step 1 og vis step 2
    step1.classList.add('d-none');
    footer1.classList.add('d-none');
    step2.classList.remove('d-none');
    footer2.classList.remove('d-none');
});

    // Lyt efter klik på "Go Back"-knappen (Annullere)
    backBtn.addEventListener('click', function() {
    // Skjul step 2 og vis step 1 igen
    step2.classList.add('d-none');
    footer2.classList.add('d-none');
    step1.classList.remove('d-none');
    footer1.classList.remove('d-none');
});



    const seatMapContainer = document.getElementById('seat-map-container');
    const rows = 20;
    const seatsPerRow = 12;

    // --- DEL 1: Byg sæde-gitteret dynamisk ---
    function generateSeats() {
    seatMapContainer.innerHTML = ''; // Nulstil gitteret
    for (let i = 0; i < rows * seatsPerRow; i++) {
    const seat = document.createElement('div');
    seat.classList.add('seat');

    // Simuler at nogle sæder allerede er solgt (tilfældigt)
    if (Math.random() < 0.2) { // Ca. 20% chance for at et sæde er solgt
    seat.classList.add('sold');
}
    seatMapContainer.appendChild(seat);
}
}

    // --- DEL 2: Håndter klik på sæder (Event Delegation) ---
    seatMapContainer.addEventListener('click', function(event) {
    const clickedEl = event.target;
    // Tjek om der blev klikket på et sæde, og at det ikke er solgt
    if (clickedEl.classList.contains('seat') && !clickedEl.classList.contains('sold')) {
    // "toggle" skifter klassen: tilføjer den hvis den mangler, fjerner den hvis den er der.
    clickedEl.classList.toggle('selected');
}
});

    // --- DEL 3: Håndter klik på visningsknapperne ---
    const showtimeButtons = document.querySelectorAll('.showtime-btn');
    const seatModalElement = document.getElementById('seatSelectionModal');
    const seatModal = new bootstrap.Modal(seatModalElement);

    showtimeButtons.forEach(button => {
    button.addEventListener('click', function(event) {
    event.preventDefault(); // Forhindrer linket i at hoppe til toppen af siden

    // Byg et nyt (tilfældigt) sæde-layout, hver gang man åbner modalen
    generateSeats();

    // Åbn modalen
    seatModal.show();
});
});
});
