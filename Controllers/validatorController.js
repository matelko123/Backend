const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Joi = require("joi");
const { secret } = require("../config");

exports.Id = id => {
    if (!id || id == null) return false;
    const validate = mongoose.Types.ObjectId.isValid(id);
    // console.log(validate);
    if (!validate) {
        console.log("Użytkownik o takim id nie istnieje");
        return false;
    }
    return true;
};

//* Walidacja danych
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

//* Walidacja tokenu JWT
exports.JWT = token => {
    if (!token) return { success: false, msg: "Brak tokenu" };

    if (!secret) {
        console.log("Brak klucza w .env!");
        return { success: false, msg: "Brak klucza w .env!" };
    }

    const verify = jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            //* Czy token wygasł
            if (err.name === "TokenExpiredError") {
                return { success: false, msg: "Token expired!" };
            } else if (err.name === "JsonWebTokenError") {
                return { success: false, msg: "Nieprawidłowy token!" };
            } else {
                return { success: false, msg: "Nieprawidłowy token!" };
            }
        }

        //* Walidacja id
        if (!decoded._id)
            return { success: false, msg: "Nieprawidłowy token!" };
        if (!this.Id(decoded._id))
            return { success: false, msg: "Brak takiego użytkowika!" };

        //* Czy istnieje taki użytkownik o takim id
        User.findById(decoded._id, function(err, user) {
            if (err) return { success: false, msg: "Coś poszło nie tak" };
            if (user == null)
                return { success: false, msg: "Brak takiego użytkowika!" };
        });

        const tokenExp = (decoded.exp - decoded.iat) / 60;
        console.log(`Token ważny jeszcze: ${tokenExp} minut`);
        return { success: true, msg: "" };
    });

    // console.log(verify);
    return verify;
};
