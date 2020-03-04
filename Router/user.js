/*
 ! Router - User Cotroller Route
 *  - (GET)     /           - Get all users
 *  - (GET)     /:id        - Get ona user by id
 *  - (DELETE)  /:id        - Delete user
 *  - (PATCH)   /:id        - Update user
 */

const router = require('express').Router();
const userController = require('../Controllers/user');
const { isLogged } = require('../Controllers/auth');

router
    .get('/', isLogged, userController.getAllUsers)
    .get('/:id', isLogged, userController.getUserById)
    .patch('/:id', isLogged, userController.updateUser)
    .delete('/:id', isLogged, userController.deleteUser);

module.exports = router;
