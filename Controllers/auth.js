const validator = require("./validator");

//* If logged in
exports.isLogged = async (req, res, next) => {
    const jwtToken = req.header("auth_token");

    const validateToken = validator.JWT(jwtToken);
    if (validateToken) return next();

    return res.status(401).json({
        success: false,
        err_msg: "Authentication failed."
    });
};
