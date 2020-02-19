/*
 ! Router
 * / - Ścieżka domowa
 * /auth - Autoryzacja
 *  - (POST)    /login      - Logowanie
 *  - (POST)    /register   - Rejestracja
 * /user - Kontroler użytkowików
 *  - (GET)     /           - Pobranie wszystkich użytkowników
 *  - (GET)     /:id        - Pobranie jednego użytkownika
 *  - (POST)    /           - Dodanie nowego użytkownika
 *  - (DELETE)  /:id        - Usunięcie użytkownika
 *  - (PATCH)   /:id        - Aktualizacja użytkownika
 */

module.exports = function(app) {
    app.use("/", require("./home"));
    app.use("/auth", require("./auth"));
    app.use("/user", require("./user"));
};
