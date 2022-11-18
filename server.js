const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SQLiteStore = require("connect-sqlite3")(session);

const { authRouter } = require("./src/auth");

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./db" }),
  })
);
app.use(passport.authenticate("session"));

app.use("/", authRouter);

app.listen(4000, () => {
  console.log("server is running at 'http://localhost:4000/'");
});
