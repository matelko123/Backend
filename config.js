const dotenv = require("dotenv");
dotenv.config();

if (!process.env.dbString) console.log("db string no exist!");

module.exports = {
    PORT: process.env.PORT || 3000,
    dbString: process.env.dbString,
    secret: process.env.secret || QWERTY123,
    saltRounds: process.env.saltRounds || 10
};
