const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { db } = require("./db");
const bodyParser = require("body-parser");

const authRouter = express.Router();

authRouter.use(bodyParser.urlencoded({ extended: true }));

authRouter.post("/signup", function (req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    function (err, hashedPassword) {
      if (err) {
        return next(err);
      }
      db.run(
        "INSERT INTO users (username, password, salt) VALUES (?, ?, ?)",
        [req.body.username, hashedPassword, salt],
        function (err) {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        }
      );
    }
  );
});

authRouter.get("/login", (req, res) => {
  res.send("successful login");
});

module.exports = { authRouter };
