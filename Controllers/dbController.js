const mongoose = require("mongoose");
const { dbString } = require("../config");

//* Set up default mongoose connection
mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("DB connected successful!"))
  .catch(err => console.error("Something went wrong!", err));

//* Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);

//* Get the default connection
const db = mongoose.connection;

//* Bind connection to error event
db.on("error", console.error.bind(console, "DB connected failed!"));

module.exports = db;
