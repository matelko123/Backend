const validator = require('../Helpers/validator');

exports.isLogged = async (req, res, next) => {
    const jwtToken = req.header('auth_token');

    if (validator.JWT(jwtToken)) return next();

    return res.status(401).json({
        success: false,
        err_msg: 'Authentication failed.'
    });
};
