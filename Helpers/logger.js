const { debug } = require("../config");
const FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m";
const Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m";

exports.logger = name => {
    if (debug) {
        let e = new Error();
        let frame = e.stack.split("\n")[2];
        let file = frame.split(" ")[6];
        console.log(
            `${FgYellow}[LOGGER]`,
            `${FgWhite}${Underscore}${file}`,
            `${Reset}${FgBlue}>>${FgWhite}`,
            `${FgGreen}(${typeof name}) ${Reset}${name}`
        );
    }
};

exports.log_errors = (msg = "Something went wrong.", err = "", code = 0) => {
    if (debug) {
        let e = new Error();
        let frame = e.stack.split("\n")[2];
        let file = frame.split(" ").reverse()[0];
        let output = `${FgRed}[LOGGER] ${FgWhite}${file} ${Reset}${FgBlue}>>${FgWhite}${FgGreen} ${Reset}${msg}`;
        if (err) output += " : " + err;
        console.log(output);
        //* Exit process with failure
        if (code) process.exit(1);
    }
};
exports.log_warn = (msg = "Something went wrong.", err = "") => {
    if (debug) {
        let e = new Error();
        let frame = e.stack.split("\n")[2];
        let file = frame.split(" ")[6];
        let output = `${FgYellow}[LOGGER] ${FgWhite}${file} ${Reset}${FgBlue}>>${FgWhite}${FgGreen} ${Reset}${msg}`;
        if (err) output += " : " + err;
        console.log(output);
    }
};
