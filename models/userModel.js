const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../config");
const Schema = mongoose.Schema;

//* Model użytkownika
const UserSchema = new Schema(
    {
        name: {
            type: String,
            lowercase: true,
            required: [true, "not empty"],
            match: [/^[a-zA-Z]+$/, "is incorrect"],
            index: true
        },
        last_name: {
            type: String,
            lowercase: true,
            required: [true, "not empty"],
            match: [/^[a-zA-Z]+$/, "is incorrect"],
            index: true
        },
        login: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "not empty"],
            match: [/^[a-zA-Z0-9]+$/, "is incorrect"],
            index: true
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "not empty"],
            match: [/\S+@\S+\.\S+/, "is incorrect"],
            index: true
        },
        password: String
    },
    { timestamps: true } // UpdatedAt, CreatedAt
);

//* Hash password
UserSchema.pre("save", function(next) {
    const user = this;

    //* If password modified
    if (!user.isModified("password")) return next();

    //* Generate Salt
    // console.log(typeof saltRounds, saltRounds);
    bcrypt.genSalt(parseInt(saltRounds), (err, salt) => {
        if (err) return next(err);

        //* Hashowanie hasła
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

//* Walidacja hasła
UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);
