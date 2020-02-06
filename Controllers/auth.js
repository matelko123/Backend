const validator = require("./validator");
const { logger, log_warn } = require("../Helpers/logger");

//* If logged in
exports.isLogged = async (req, res, next) => {
    const jwtToken = req.header("auth_token");
    const validateToken = validator.JWT(jwtToken);

    // logger(validateToken);
    if (validateToken) return next();
    return res.status(401).send("Not authorized.");
};
