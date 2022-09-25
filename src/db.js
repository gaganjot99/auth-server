const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/users.db", (err) => {
  if (err) {
    console.log(err);
  }
  console.log("in file database connected");
  db.serialize(() => {
    createUserTable();
    createNotesTable();
    addUserData({
      username: "johnsnow",
      email: "johncommander@nw.com",
      password: "IamTargareon",
      salt: "knowsNothing",
    });
    addNotesData({
      heading: "default header",
      content: "something about something",
      user_id: 1,
    });
    showAllUserData();
    showAllNotesData();
    setTimeout(() => {
      db.serialize(() => {
        updateNotesData({
          heading: "new header",
          content: "something new about something",
          user_id: 1,
        });
        showAllNotesData();
      });
    }, 5000);
  });
});

const createUserTable = () => {
  db.run(
    "CREATE TABLE users (user_id INTEGER PRIMARY KEY, username VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, password TEXT NOT NULL, salt TEXT NOT NULL)",
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
  db.run(
    "INSERT INTO users(username, email, password, salt) values(?, ?, ?, ? )",
    [data.username, data.email, data.password, data.salt],
    (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("User data added");
    }
  );
};
const addNotesData = (data) => {
  db.run(
    "INSERT INTO notes (heading, content, user_id) values(?, ?, ?)",
    [data.heading, data.content, data.user_id],
    (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("notes data created");
    }
  );
};

const updateNotesData = (data) => {
  db.run(
    "UPDATE notes SET heading = ?, content = ?, modified_on = CURRENT_TIMESTAMP WHERE note_id=?",
    [data.heading, data.content, data.user_id],
    (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("notes data updated");
    }
  );
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

module.exports = { db };
