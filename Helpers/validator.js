const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../Models/user');
const { Secret } = require('../config');
const log = require('./logger');

exports.Id = id => {
    if (!id || id == null) return false;
    const validate = mongoose.Types.ObjectId.isValid(id);
    if (!validate) {
        log.warn('User not found.', { id, validate });
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

    if (!Secret) {
        log.error("Empty key 'Secret' in .env file!", null, 1);
        return false;
    }

    const verify = jwt.verify(token, Secret, (err, decoded) => {
        if (err) {
            //* If token expired
            if (err.name === 'TokenExpiredError') {
                log.warn('Token expired!');
                return false;
            }
            if (err.name === 'JsonWebTokenError') {
                log.warn('Wrong token.');
                return false;
            }
            log.error('Wrong token.');
            return false;
        }

        //* Validate id
        if (!decoded._id) return false;
        if (!this.Id(decoded._id))
            // log.warn("User not found.", decoded._id);
            return false;

        //* If user exist
        User.findById(decoded._id, (err, user) => {
            if (err) {
                log.error(null, err);
                return false;
            }
            if (user == null)
                // log.warn("User not found.", decoded._id);
                return false;
        });
        return true;
    });

    // logger(verify);
    return verify;
};
