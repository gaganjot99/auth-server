const express = require("express");
const path = require("path");

const { authRouter } = require("./src/auth");

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.resolve("../build/index.html"));
});

app.use("/auth/", authRouter);

app.use(express.static("../build"));

app.listen(4000, () => {
  console.log("server is running at 4000");
});
