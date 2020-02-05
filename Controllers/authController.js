const validator = require("./validatorController");

//* Weryfikacja Routera
exports.isLogged = async (req, res, next) => {
    //* Pobranie tokenu z headera
    const jwtToken = req.header("auth_token");

    const validateToken = validator.JWT(jwtToken);
    //console.log(validateToken);
    if (validateToken.success === true) return next();
    else return next({ status: 401, msg: validateToken.msg });
};
