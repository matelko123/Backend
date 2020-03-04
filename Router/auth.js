/*
 ! Router - Auth Route
 *  - (POST)    /auth/login      - Login
 *  - (POST)    /auth/register   - Register
 */

const router = require('express').Router();
const userController = require('../Controllers/user');

router.post('/login', userController.login);
router.post('/register', userController.newUser);

module.exports = router;
