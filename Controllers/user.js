const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const validate = require("./validator");
const { secret } = require("../config");
const { log_errors } = require("../Helpers/logger");

//* Get all users
exports.getAll = async (req, res, next) => {
    await User.find({}, (err, users) => {
        if (err) {
            log_errors(null, err, 1);
            return res.json({ success: false, err: "Something went wrong." });
        }
        if (users.length === 0)
            return res.json({ success: false, err: "No users found." });
        res.json({ success: true, users: users });
    });
};

//* Get user by id
exports.getOne = async (req, res, next) => {
    //* Valid id
    const id = req.params.id;
    if (!validate.Id(id)) return res.json({ success: false, msg: "Wrong ID" });

    await User.findById(id, (err, user) => {
        if (err) return res.json({ success: false, err: err });
        if (user == null)
            return res.json({
                success: false,
                msg: "User not found."
            });
        else res.json({ success: true, users: users });
    });
};

//* Sign up
exports.newUser = async (req, res, next) => {
    //* Validate
    const { error } = validate.User(req.body);
    if (error) {
        log_errors(null, error, 1);
        return res.json({ success: false, msg: "Something went wrong." });
    }

    //* If login and email al in use.
    let user = await User.findOne({ login: req.body.login });
    if (user)
        return res.json({
            success: false,
            data: { field: "login", msg: "Login is already taken." }
        });

    user = await User.findOne({ email: req.body.email });
    if (user)
        return res.json({
            success: false,
            data: { field: "email", msg: "Email is already taken." }
        });

    //* New user
    user = new User({
        name: req.body.name,
        last_name: req.body.last_name,
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    });

    //* Save user to DB
    await user.save();
    var token = jwt.sign(user.toJSON(), secret, {
        expiresIn: "15m"
    });
    return res.status(201).json({ success: true, user: user, token: token });
};

//* Sign in
exports.login = async (req, res, next) => {
    if (!req.body.login || !req.body.password)
        return res.json({
            success: false,
            msg: "Login or password is missing."
        });

    const login = req.body.login;
    const password = req.body.password;
    User.findOne({ login: login }, async function(err, user) {
        if (err) {
            log_errors(null, err, 1);
            return res.json({ success: false, msg: "Something went wrong." });
        }
        if (!user)
            return res.json({
                success: false,
                msg: "User not found."
            });

        await user.comparePassword(password, (err, isMatch) => {
            if (isMatch && !err) {
                //* if user is found and password is right create a token
                var token = jwt.sign(user.toJSON(), secret, {
                    expiresIn: "15m"
                });
                //* return the information including token as JSON
                return res.json({ success: true, user: user, token: token });
            } else {
                return res.json({
                    success: false,
                    msg: "Password is incorrect."
                });
            }
        });
    });
};

//* Delete user
exports.delete = async (req, res, next) => {
    //* Valid id
    const id = req.params.id;
    if (!validate.Id(id)) {
        return res.json({ success: false, msg: "Wrong ID." });
    }

    await User.findOneAndDelete({ _id: id }, err => {
        if (err) {
            log_errors(null, error, 1);
            return res.json({ success: false, msg: "Something went wrong." });
        } else res.json({ success: true, msg: "The user has been removed." });
    });
};

//* Update user
exports.update = async (req, res, next) => {
    //* Valid
    const id = req.params.id;
    if (!validate.Id(id)) return res.json({ success: false, msg: "Wrong ID." });

    //* Get user by id
    let user = await User.findById(id);
    if (!user) res.json({ success: false, msg: "User not found." });

    //* If login already taken
    if (req.body.login && req.body.login !== user.login) {
        user = await User.findOne({ login: req.body.login });
        if (user)
            return res.json({
                success: false,
                msg: "Login is already taken."
            });
    }

    //* If email already taken
    if (req.body.email && req.body.email !== user.email) {
        user = await User.findOne({ email: req.body.email });
        if (user)
            return res.json({
                success: false,
                msg: "Email is already taken."
            });
    }

    user = await User.findById(id);
    const updatedUser = {
        name:
            req.body.name && req.body.name !== user.name
                ? req.body.name
                : user.name,
        last_name:
            req.body.last_name !== user.last_name && req.body.last_name
                ? req.body.last_name
                : user.last_name,
        email:
            req.body.email !== user.email && req.body.email
                ? req.body.email
                : user.email,
        login:
            req.body.login !== user.login && req.body.login
                ? req.body.login
                : user.login,
        password: user.password
    };

    //* Valid new user
    const { validateUser } = validate.User(updatedUser);
    if (validateUser)
        return res.json({ success: false, err: validateUser.details });

    //* Update in DB
    const updated = await User.findOneAndUpdate({ _id: id }, updatedUser);
    if (!updated) {
        log_warn(null, error);
        return res.json({ success: false, msg: "Something went wrong." });
    }

    res.status(201).json({
        success: true,
        msg: "The user has been successfully updated."
    });
};
