const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "greatwhitebuffalo.ciminvuvr2we.us-east-2.rds.amazonaws.com",
  user: "gwbuff",
  password: "gwbuffboys*21",
  database: "greatwhitebuffalo"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Mysql Connected!");
});

module.exports = connection;
