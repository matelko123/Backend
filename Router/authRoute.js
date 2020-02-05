/*
 ! Router - Autoryzacja
 *  - (POST)    /auth/login      - Logowanie
 *  - (POST)    /auth/register   - Rejestracja
 */

const router = require("express").Router();
const { userController } = require("../controllers");

router.post("/login", userController.login);
router.post("/register", userController.newUser);

module.exports = router;
