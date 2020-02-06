/*
 ! Router
 * / - Ścieżka domowa
 */

module.exports = function(app) {
    app.use("/", require("./home"));
    app.use("/auth", require("./auth"));
    app.use("/user", require("./user"));
};
