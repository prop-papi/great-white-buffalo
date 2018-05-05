const mysql = require("promise-mysql");

const connection = mysql.createPool({
  host: "greatwhitebuffalo.ciminvuvr2we.us-east-2.rds.amazonaws.com",
  user: "gwbuff",
  password: "gwbuffboys*21",
  database: "greatwhitebuffalo"
});

module.exports = connection;
