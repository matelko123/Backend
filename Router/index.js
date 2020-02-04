/*
 ! Router
 * / - Ścieżka domowa
 */

module.exports = function(app) {
  app.use("/", require("./homeRoute"));
  // app.use("/auth", require("./authRoute"));
  // app.use("/user", require("./userRoute"));
};
