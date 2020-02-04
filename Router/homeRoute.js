const router = require("express").Router();

router.route("/").get((req, res) => {
  res.send("hello");
});

module.exports = router;
