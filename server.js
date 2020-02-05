const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const { errorController } = require("./Controllers");
const { PORT } = require("./config");
const router = require("./Router");

//* Init App
const app = express();

//* Config
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//* Error handling

//* Router
router(app);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.listen(PORT, console.log(`Server running on port :${PORT}`));
