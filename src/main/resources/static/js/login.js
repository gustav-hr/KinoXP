// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    // Definer det korrekte login her. Du kan ændre det til hvad som helst.
    const correctUsername = 'admin';
    const correctPassword = 'password123';

    // Find formularen i HTML'en
    const loginForm = document.getElementById('login-form');

    // Lyt efter "submit"-eventet på formularen
    loginForm.addEventListener('submit', (event) => {
        // Stop formularen i at genindlæse siden, hvilket er standard-adfærd
        event.preventDefault();

        // Hent de værdier, brugeren har indtastet
        const enteredUsername = document.getElementById('floatingInput').value;
        const enteredPassword = document.getElementById('floatingPassword').value;

        // Tjek om det indtastede matcher det korrekte login
        if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
            // Hvis det er korrekt, send brugeren videre til admin-siden
            console.log('Login successful! Redirecting to admin page...');
            window.location.href = 'admin';
        } else {
            // Hvis det er forkert, vis en simpel fejlmeddelelse
            alert('Forkert brugernavn eller password. Prøv igen.');
        }
    });
});