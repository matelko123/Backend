/*
 ! Router - Kontroler użytkowików
 *  - (GET)     /           - Pobranie wszystkich użytkowników
 *  - (GET)     /:id        - Pobranie jednego użytkownika
 *  - (DELETE)  /:id        - Usunięcie użytkownika
 *  - (PATCH)   /:id        - Aktualizacja użytkownika
 */

const router = require("express").Router();
const userController = require("../Controllers/user");
const authController = require("../Controllers/auth");
const isLogged = authController.isLogged;

router
    .get("/", isLogged, userController.getAll)
    .get("/:id", isLogged, userController.getOne)
    .patch("/:id", isLogged, userController.update)
    .delete("/:id", isLogged, userController.delete);

module.exports = router;
