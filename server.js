const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const { PORT } = require("./config");
const router = require("./Router");
const logger = require("./Helpers/logger");
const errorHandler = require("./Helpers/errorHandler");
const connectDB = require("./Controllers/db");

//* Init App
const app = express();

//* Connect Database
connectDB();

//* Config
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//* Error handling
app.use(errorHandler.Handler);
app.use(errorHandler.error404);

//* Router
router(app);

app.listen(PORT, console.log(`Server running on port :${PORT}`));
