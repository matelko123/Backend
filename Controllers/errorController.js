exports.Handler = (err, req, res, next) => {
    if (req.xhr) {
        res.status(200).send(err);
    } else {
        next(err);
    }
};

exports.logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
};

exports.error404 = (err, req, res, next) => {
    res.status(404).send({ error: "Not found!" });
    next(err);
};
