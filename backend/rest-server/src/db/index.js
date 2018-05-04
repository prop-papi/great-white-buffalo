let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: ""
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Mysql Connected!");
});

module.exports = connection;
