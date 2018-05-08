const mysqldb = require("../../index.js").mysqldb;
const mysql = require("mysql");

const selectUser = async user => {
  const query = `SELECT * FROM Users WHERE username='${user}';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

module.exports.selectUser = selectUser;
