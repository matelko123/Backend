const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.DBString) {
    console.log('DB string no exist!');
    process.exit(1);
}

module.exports = {
    AppDir: path.resolve(__dirname),
    PORT: process.env.PORT || 3000,
    HOSTNAME: process.env.HOSTNAME || 'localhost',
    DBString: process.env.DBString,
    Secret: process.env.Secret || 'QWERTY123',
    SaltRounds: process.env.SaltRounds || 10
};
