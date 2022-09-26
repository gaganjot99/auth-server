const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { db, addUserData, findUser } = require("./db");
const bodyParser = require("body-parser");
const path = require("path");
const ensureLogIn = require("connect-ensure-login").ensureLoggedIn;

const authRouter = express.Router();

const ensureLoggedIn = ensureLogIn();

authRouter.use(bodyParser.urlencoded({ extended: true }));

authRouter.get("/", ensureLoggedIn, (req, res) => {
  res.sendFile(path.resolve("../build/main.html"));
});

authRouter.use(express.static("../build"));

authRouter.get("/login", (req, res) => {
  res.sendFile(path.resolve("../build/index.html"));
});

authRouter.get("/user", ensureLoggedIn, (req, res) => {
  res.json({ user: req.user, id: req.id });
});

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    console.log("I'm serializing");
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  console.log("I'm deserializing");
  process.nextTick(function () {
    return cb(null, user);
  });
});

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
      const data = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        salt: salt,
      };
      addUserData(data)
        .then((data) => {
          console.log("user added with ID: ", data.id);
          req.login(data, function (err) {
            if (err) {
              return next(err);
            }
            res.redirect("/");
          });
        })
        .catch((err) => console.log(err));
    }
  );
});

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    findUser(username)
      .then((data) => {
        if (!data) {
          console.log("users not found");
          return cb(null, false, {
            message: "Incurrect username or password.",
          });
        }
        crypto.pbkdf2(
          password,
          data.salt,
          310000,
          32,
          "sha256",
          function (err, hashedPassword) {
            if (err) {
              return cb(err);
            }
            if (!crypto.timingSafeEqual(data.password, hashedPassword)) {
              console.log("passwords didn't match");
              return cb(null, false, {
                message: "Incorrect username or password.",
              });
            }
            return cb(null, data);
          }
        );
      })
      .catch((err) => cb(err));
  })
);

authRouter.post(
  "/login/password",
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

authRouter.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = { authRouter };
