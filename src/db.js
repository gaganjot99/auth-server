const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/users.db", (err) => {
  if (err) {
    console.log(err);
  }
  console.log("in file database connected");
  db.serialize(() => {
    // createUserTable();
    // createNotesTable();
    // addUserData({
    //   username: "johnsnow",
    //   email: "johncommander@nw.com",
    //   password: "IamTargareon",
    //   salt: "knowsNothing",
    // }).then((data) => console.log(data));
    // addNotesData({
    //   heading: "default header",
    //   content: "something about something",
    //   user_id: 2,
    // });
    showAllUserData();
    showAllNotesData();
  });
});

const createUserTable = () => {
  db.run(
    "CREATE TABLE users (user_id INTEGER PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(50) NOT NULL, password TEXT NOT NULL, salt TEXT NOT NULL)",
    [],
    (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("User table created");
    }
  );
};

const createNotesTable = () => {
  db.run(
    "CREATE TABLE notes (note_id INTEGER PRIMARY KEY, heading VARCHAR(50) NOT NULL, content TEXT NOT NULL, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, modified_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, user_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id))",
    [],
    (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("notes table created");
    }
  );
};

const addUserData = (data) => {
  return new Promise((res, rej) => {
    db.run(
      "INSERT INTO users(username, email, password, salt) values(?, ?, ?, ? )",
      [data.username, data.email, data.password, data.salt],
      function (err) {
        if (err) {
          rej(err);
        }
        res({
          user_id: this.lastID,
          username: data.username,
        });
      }
    );
  });
};

const findUser = (username) => {
  return new Promise((res, rej) => {
    db.get(
      "Select * from users where username=?",
      [username],
      function (err, row) {
        if (err) {
          return rej(err);
        }
        return res(row);
      }
    );
  });
};

const allNotesData = (user_id) => {
  return new Promise((res, rej) => {
    db.all("SELECT * FROM notes WHERE user_id = ?", [user_id], (err, rows) => {
      if (err) {
        return rej(err);
      }
      return res(rows);
    });
  });
};

const addNotesData = (data) => {
  return new Promise((res, rej) => {
    db.run(
      "INSERT INTO notes (heading, content, user_id) values(?, ?, ?)",
      [data.heading, data.content, data.user_id],
      function (err) {
        if (err) {
          return rej(err);
        }
        db.get(
          "SELECT * FROM notes WHERE note_id = ?",
          [this.lastID],
          (err, row) => {
            if (err) {
              return rej(err);
            }
            return res(row);
          }
        );
      }
    );
  });
};

const updateNotesData = (data) => {
  return new Promise((res, rej) => {
    db.run(
      "UPDATE notes SET heading = ?, content = ?, modified_on = CURRENT_TIMESTAMP WHERE note_id=? and user_id=?",
      [data.heading, data.content, data.note_id, data.user_id],
      function (err) {
        if (err) {
          return rej(err);
        }
        db.get(
          "SELECT * FROM notes where note_id = ?",
          [data.note_id],
          function (err, row) {
            if (err) {
              return rej(err);
            }
            return res(row);
          }
        );
      }
    );
  });
};

const deleteNote = (noteId, userId) => {
  return new Promise((res, rej) => {
    db.run(
      "DELETE FROM notes WHERE note_id = ? AND user_id = ?",
      [noteId, userId],
      (err) => {
        if (err) {
          return rej(err);
        }
        return res({ status: "success" });
      }
    );
  });
};

const showAllUserData = () => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return console.log(err);
    }
    rows.forEach((element) => {
      console.log(element);
    });
  });
};

const showAllNotesData = () => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    if (err) {
      return console.log(err);
    }
    rows.forEach((element) => {
      console.log(element);
    });
  });
};

module.exports = {
  findUser,
  addUserData,
  addNotesData,
  allNotesData,
  updateNotesData,
  deleteNote,
};
