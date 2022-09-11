const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database("./db/users.db", (err) => {
  if (err) {
    console.log(err);
  }
  console.log("in file database connected");
  // db.run(
  //   "CREATE TABLE users (username TEXT, password TEXT, salt TEXT)",
  //   [],
  //   (err) => {
  //     if (err) {
  //       return console.log(err);
  //     }
  //     console.log("table created");
  //   }
  // );

  //   db.run(
  //     "INSERT INTO users (email, password ) VALUES ('gagan', 'gagan@54')",
  //     [],
  //     (err) => {
  //       if (err) {
  //         return console.log(err);
  //       }
  //       console.log("data added");
  //     }
  //   );

  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return console.log(err);
    }
    rows.forEach((element) => {
      console.log(element);
    });
  });
});

// db.close(() => {
//   console.log("bd closed");
// });

module.exports = { db };
