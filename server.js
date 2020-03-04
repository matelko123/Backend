const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const methodOverride = require('method-override');

const ConnectDB = require('./Controllers/db.js');
const { isDev } = require('./Helpers/express');
const log = require('./Helpers/logger');
const config = require('./config');
const Router = require('./Router');
const handler = require('./Helpers/errorHandler');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!!');
});

if (isDev) {
    app.use(morgan('dev'));
    log.logger(config);
}

Router(app);
ConnectDB();

// ******************************** */

app.use(handler.logErrors);
// app.use(handler.clientErrorHandler);
app.use((error, req, res, next) => {
    res.json({ message: error.message });
});

// ******************************** */

const { PORT, HOSTNAME } = config;
const server = http.createServer(app);
server.listen(
    PORT,
    HOSTNAME,
    log.success(`Server running at http://${HOSTNAME}:${PORT}`)
);
