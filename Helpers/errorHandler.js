exports.Handler = (err, req, res, next) => {
    console.log("asdasd1111");
    if (req.xhr) {
        res.status(500).send("Something failed!");
    } else {
        next(err);
    }
};

exports.error404 = (err, req, res, next) => {
    res.status(404).send({ error: "Not found!" });
    next(err);
};
