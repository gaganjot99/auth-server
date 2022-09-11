const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const SQLiteStore = require("connect-sqlite3")(session);
const csrf = require("csurf");

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

app.get("/", (req, res) => {
  res.sendFile(path.resolve("../build/main.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.resolve("../build/index.html"));
});

app.use("/auth/", authRouter);

app.get("/main", (req, res) => {
  res.sendFile(path.resolve("../build/main.html"));
});

app.use(express.static("../build"));

app.listen(4000, () => {
  console.log("server is running at 4000");
});
