const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validate = require("./validatorController");
const { secret } = require("../config");

//* Pobranie wszystkich
exports.getAll = async (req, res, next) => {
    await User.find({}, (err, users) => {
        if (err) return res.json({ success: false, err: err });
        if (users.length === 0)
            return res.json({ success: false, msg: "Brak użytkowników" });
        res.json({ success: true, users: users });
    });
};

//* Pobranie jednego
exports.getOne = async (req, res, next) => {
    //* Walidacja id
    const id = req.params.id;
    if (!validate.Id(id)) return res.json({ success: false, msg: "Błędne ID" });

    await User.findById(id, (err, user) => {
        if (err) return res.json({ success: false, err: err });
        if (user == null)
            return res.json({
                success: false,
                msg: "Użytkownik o takim id nie istnieje"
            });
        else res.json({ success: true, users: users });
    });
};

//* Rejestracja
exports.newUser = async (req, res, next) => {
    //* Walidacja parametrów
    const { error } = validate.User(req.body);
    if (error) return res.json({ success: false, msg: error.details });

    //* Czy login i email są wolne
    let user = await User.findOne({ login: req.body.login });
    if (user)
        return res.json({
            success: false,
            data: { field: "login", msg: "Ten login jest już zajęty!" }
        });

    user = await User.findOne({ email: req.body.email });
    if (user)
        return res.json({
            success: false,
            data: { field: "email", msg: "Ten email jest już zajęty!" }
        });

    //* Nowy użytkownik
    user = new User({
        name: req.body.name,
        last_name: req.body.last_name,
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    });

    //* Zapis użytkownika do bazy danych
    await user.save();
    var token = jwt.sign(user.toJSON(), secret, {
        expiresIn: "15m"
    });
    return res.status(201).json({ success: true, user: user, token: token });
};

//* Logowanie
exports.login = async (req, res, next) => {
    if (!req.body.login || !req.body.password)
        return res.json({ success: false, msg: "Podaj login i hasło." });

    const login = req.body.login;
    const password = req.body.password;
    User.findOne({ login: login }, async function(err, user) {
        if (err) return res.json({ success: false, err: err });
        if (!user)
            return res.json({
                success: false,
                msg: "Nie znaleziono takiego użytkownika."
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
                return res.json({ success: false, msg: "Błędne hasło" });
            }
        });
    });
};

//* Usuwanie
exports.delete = async (req, res, next) => {
    //* Walidacja id
    const id = req.params.id;
    if (!validate.Id(id)) {
        return res.json({ success: false, msg: "Błędne ID" });
    }

    await User.findOneAndDelete({ _id: id }, err => {
        if (err) {
            return res.json({ success: false, err: err });
        } else res.json({ success: true, msg: "Użytkownik został usunięty" });
    });
};

//* Aktualizacja
exports.update = async (req, res, next) => {
    //* Walidacja id
    const id = req.params.id;
    if (!validate.Id(id)) return res.json({ success: false, msg: "Błędne ID" });

    //* Pobranie danego użytkownika
    let user = await User.findById(id);
    if (!user)
        res.json({ success: false, msg: "Użytkownik o takim id nie istnieje" });

    //* Czy login nie jest zajęty
    if (req.body.login && req.body.login !== user.login) {
        user = await User.findOne({ login: req.body.login });
        if (user)
            return res.json({
                success: false,
                msg: "Użytkownik o takim loginie już istnieje"
            });
    }

    //* Czy email nie jest zajęty
    if (req.body.email && req.body.email !== user.email) {
        user = await User.findOne({ email: req.body.email });
        if (user)
            return res.json({
                success: false,
                msg: "Ten adres email jest już przypisany do innego konta"
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

    //* Walidacja nowego użytkownika
    const { validateUser } = validate.User(updatedUser);
    if (validateUser)
        return res.json({ success: false, err: validateUser.details });

    //* Aktualizacja
    const updated = await User.findOneAndUpdate({ _id: id }, updatedUser);
    if (!updated)
        return res.json({ success: false, msg: "Coś poszło nie tak" });

    res.status(201).json({
        success: true,
        msg: "Użytkownik został pomyślnie zaaktualizowany"
    });
};
