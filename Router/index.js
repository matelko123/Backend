/*
 ! Router
 * / - Home Route
 * /auth - Auth Cotroller
 * /user - User Cotroller
 */

module.exports = app => {
    app.use('/', require('./home'));
    app.use('/auth', require('./auth'));
    app.use('/user', require('./user'));
};
