const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const { log_errors } = require("./Helpers/logger");

if (!process.env.dbString) log_errors("db string no exist!");

module.exports = {
    appDir: path.resolve(__dirname),
    PORT: process.env.PORT || 3000,
    dbString: process.env.dbString,
    secret: process.env.secret || QWERTY123,
    saltRounds: process.env.saltRounds || 10
};
