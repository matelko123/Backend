/*
 ! Router - Kontroler użytkowików
 *  - (GET)     /           - Pobranie wszystkich użytkowników
 *  - (GET)     /:id        - Pobranie jednego użytkownika
 *  - (DELETE)  /:id        - Usunięcie użytkownika
 *  - (PATCH)   /:id        - Aktualizacja użytkownika
 */

const router = require("express").Router();
const userController = require("../Controllers/user");
const { isLogged } = require("../Controllers/auth");

router
    .get("/", isLogged, userController.getAllUsers)
    .get("/:id", isLogged, userController.getUserById)
    .patch("/:id", isLogged, userController.updateUser)
    .delete("/:id", isLogged, userController.deleteUser);

module.exports = router;
