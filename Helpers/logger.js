/* eslint-disable no-unused-vars */
const { Debug } = require('../config');

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';
const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

exports.logger = data => {
    if (process.env.NODE_ENV === 'dev') {
        if (!data) return;
        const e = new Error();
        const frame = e.stack.split('\n')[2];
        const file = frame.split(' ')[6];

        if (typeof data === 'object') data = JSON.stringify(data, null, 4);

        console.log(
            `${FgBlue}[LOGGER]`,
            `${FgWhite}${Underscore}${file}`,
            `${Reset}${FgBlue}>>${FgWhite}`,
            `${FgGreen}(${typeof data}) ${Reset}${data}`
        );
    }
};

exports.error = (msg = 'Something went wrong.', err, code = false) => {
    const e = new Error();
    const frame = e.stack.split('\n')[2];
    const file = frame.split(' ').reverse()[0];
    let output = `❌  ${FgRed}[LOGGER] ${FgWhite}${file} ${Reset}${FgBlue}>>${FgWhite}${FgGreen} ${Reset}${msg}`;
    if (err) output += ` : ${err}`;
    console.log(output);

    // Exit process with failure
    if (code) process.exit(1);
};
exports.warn = (msg = 'Something went wrong.', err) => {
    const e = new Error();
    const frame = e.stack.split('\n')[2];
    const file = frame.split(' ')[6];
    let output = `⚠  ${FgYellow}[LOGGER] ${FgWhite}${file} ${Reset}${FgBlue}>>${FgWhite}${FgGreen} ${Reset}${msg}`;
    if (err) output += ` : ${err}`;
    console.log(output);
};
exports.success = msg => console.log(`✅  ${msg}`);
