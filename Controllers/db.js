const mongoose = require("mongoose");
const { dbString } = require("../config");
const { log_errors } = require("../Helpers/logger");

//* Set up default mongoose connection
const connectDB = async () => {
    try {
        await mongoose.connect(dbString, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            keepAlive: 1
        });
        //* Get Mongoose to use the global promise library
        mongoose.Promise = global.Promise;

        mongoose.connection.on("disconnected", connectDB);

        console.log("MongoDB connected successful!");
    } catch (err) {
        log_errors("DB connected failed!", err.message, 1);
    }
};

module.exports = connectDB;
