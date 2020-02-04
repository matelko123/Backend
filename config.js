const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  PORT: process.env.PORT,
  dbString: process.env.dbString
};
