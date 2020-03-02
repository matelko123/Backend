const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const Joi = require("joi");
const { secret } = require("../config");
const { log_errors, log_warn } = require("../Helpers/logger");

exports.Id = id => {
    if (!id || id == null) return false;
    const validate = mongoose.Types.ObjectId.isValid(id);
    // logger(validate);
    if (!validate) {
        log_warn("User not found.", { id, validate });
        return false;
    }
    return true;
};

//* Validate user
exports.User = user => {
    const schema = {
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),
        last_name: Joi.string()
            .min(5)
            .max(50)
            .required(),
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        login: Joi.string()
            .min(5)
            .max(255)
            .required(),
        password: Joi.string()
            .min(5)
            .max(255)
            .required()
    };
    return Joi.validate(user, schema);
};

//* Validate token JWT
exports.JWT = token => {
    if (!token) return false;

    if (!secret) {
        log_errors("Empty key 'secret' in .env file!", null, 1);
        return false;
    }

    const verify = jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            //* If token expired
            if (err.name === "TokenExpiredError") {
                log_errors("Token expired!");
                return false;
            } else if (err.name === "JsonWebTokenError") {
                log_errors("Wrong token.");
                return false;
            } else {
                log_errors("Wrong token.");
                return false;
            }
        }

        //* Validate id
        if (!decoded._id) return false;
        if (!this.Id(decoded._id)) {
            // log_warn("User not found.", decoded._id);
            return false;
        }

        //* If user exist
        User.findById(decoded._id, function(err, user) {
            if (err) {
                log_errors(null, err);
                return false;
            }
            if (user == null) {
                // log_warn("User not found.", decoded._id);
                return false;
            }
        });
        return true;
    });

    // logger(verify);
    return verify;
};
