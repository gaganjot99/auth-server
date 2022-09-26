const express = require("express");
const {
  findUser,
  allNotesData,
  addNotesData,
  updateNotesData,
  deleteNote,
} = require("./db");

const dataRouter = express.Router();

dataRouter.get("/user", (req, res) => {
  findUser(req.user.username)
    .then((data) => {
      if (!data) {
        res.json({ error: "some error happened" });
      }
      res.json({
        username: data.username,
        user_id: data.user_id,
        email: data.email,
      });
    })
    .catch((err) => console.log(err));
});

dataRouter.get("/notes", (req, res) => {
  allNotesData(req.user.user_id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));
});

dataRouter.post("/addnotes", (req, res) => {
  addNotesData(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));
});

dataRouter.post("/updatenote", (req, res) => {
  // Another authenticated user can't change someone's else data
  if (+req.body.user_id !== +req.user.user_id) {
    console.log(req.body.user_id, " fi ", req.user.user_id);
    return res.json({ status: "unautherised action" });
  }
  updateNotesData(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.json({ status: "Some error happended" }));
});

dataRouter.delete("/deletenote/:note_id", (req, res) => {
  deleteNote(req.params.note_id, req.user.user_id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.json({ status: "some error happened" }));
});

module.exports = { dataRouter };
