const mongoose = require('mongoose');

const { DBString } = require('../config');
const log = require('../Helpers/logger');

const connect = async () => {
    try {
        await mongoose.connect(DBString, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            keepAlive: 1
        });
        // Get Mongoose to use the global promise library
        mongoose.Promise = global.Promise;

        mongoose.connection.on('disconnected', connect);

        log.success('DB connected successful!');
    } catch (err) {
        log.error('DB connected failed!', err.message, 1);
    }
};

module.exports = connect;
