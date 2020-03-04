const jwt = require('jsonwebtoken');

const User = require('../Models/user');
const validate = require('../Helpers/validator');
const { Secret } = require('../config');
const log = require('../Helpers/logger');

exports.getAllUsers = async (req, res) => {
    try {
        await User.find({}, (err, users) => {
            if (err) {
                log.error(null, err);
                return res.json({
                    success: false,
                    msg: 'Something went wrong.',
                    err
                });
            }

            if (users.length === 0)
                return res.json({
                    success: false,
                    msg: 'No users found.'
                });

            users.map(user => {
                user.password = undefined;
                return user;
            });

            return res.json({ success: true, data: users });
        });
    } catch (err) {
        log.error(null, err);
        res.json({
            success: false,
            msg: 'Something went wrong.',
            err
        });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    if (!validate.Id(id))
        return res.json({ success: false, msg: 'Incorrect ID.' });

    try {
        await User.findById(id, (err, user) => {
            if (err)
                return res.json({
                    success: false,
                    msg: 'Something went wrong.',
                    err
                });

            if (user == null)
                return res.json({
                    success: false,
                    msg: 'User not found.'
                });

            user.password = undefined;
            return res.json({ success: true, data: user });
        });
    } catch (err) {
        log.error(null, err);
        res.json({
            success: false,
            msg: 'Something went wrong.',
            err
        });
    }
};

//* Sign up
exports.newUser = async (req, res) => {
    //* Validate
    const { error } = validate.User(req.body);
    if (error) {
        log.error(null, error);
        return res.json({
            success: false,
            msg: 'Something went wrong.',
            err: error
        });
    }

    try {
        //* If login and email are in use.
        const { name, last_name, login, email, password } = req.body;

        if (await User.findOne({ login }))
            return res.json({
                success: false,
                msg: 'Login is already taken.'
            });

        if (await User.findOne({ email }))
            return res.json({
                success: false,
                msg: 'Email is already taken.'
            });

        const user = new User({
            name,
            last_name,
            login,
            email,
            password
        });
        await user.save();

        const token = jwt.sign(user.toJSON(), Secret, { expiresIn: '15m' });
        return res.json({ success: true, data: { user, token } });
    } catch (err) {
        log.error(null, err);
        // console.log(err);
        res.json({
            success: false,
            msg: 'Something went wrong.',
            err
        });
    }
};

//* Sign in
exports.login = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password)
        return res.json({
            success: false,
            msg: 'Login or password is missing.'
        });

    User.findOne({ login }, async (err, user) => {
        if (err) {
            log.error(null, err);
            return res.json({
                success: false,
                msg: 'Something went wrong.',
                err
            });
        }

        if (!user)
            return res.json({
                success: false,
                msg: 'User not found.'
            });

        await user.comparePassword(password, (err, isMatch) => {
            if (isMatch && !err) {
                const token = jwt.sign(user.toJSON(), Secret, {
                    expiresIn: '15m'
                });
                return res.json({ success: true, data: { user, token } });
            }
            return res.json({
                success: false,
                msg: 'Password is incorrect.'
            });
        });
    });
};

//* deleteUser user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!validate.Id(id)) return res.json({ success: false, msg: 'Wrong ID.' });

    if (!(await User.findById(id)))
        return res.json({
            success: false,
            msg: 'User not found.'
        });

    await User.findOneAndDelete({ _id: id }, err => {
        if (err) {
            log.error(null, err);
            return res.json({
                success: false,
                msg: 'Something went wrong.',
                err
            });
        }
        return res.json({ success: true, msg: 'The user has been removed.' });
    });
};

//* Update user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { login, email } = req.body;

    if (!validate.Id(id))
        return res.json({ success: false, msg: 'ID is invalid.' });

    let user = await User.findById(id);
    if (!user) res.json({ success: false, msg: 'User not found.' });

    if (login && login !== user.login) {
        user = await User.findOne({ login });
        if (user)
            return res.json({
                success: false,
                msg: 'Login is already taken.'
            });
    }

    //* If email already taken
    if (email && email !== user.email) {
        user = await User.findOne({ email });
        if (user)
            return res.json({
                success: false,
                msg: 'Email is already taken.'
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

    const { validateUser } = validate.User(updatedUser);
    if (validateUser)
        return res.json({ success: false, err: validateUser.details });

    try {
        await User.findOneAndUpdate({ _id: id }, updatedUser);
    } catch (err) {
        log.error(null, err);
        return res.json({ success: false, msg: 'Something went wrong.' });
    }

    res.status(201).json({
        success: true,
        msg: 'The user has been successfully updated.'
    });
};
