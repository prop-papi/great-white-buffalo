const mysqldb = require("../../index.js").mysqldb;
const mysql = require("mysql");

const selectUsersClubs = async user => {
  const query = `SELECT * FROM Users WHERE username='${user}';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const selectAllClubsData = async clubs => {
  const query = `SELECT * FROM Users WHERE username='${user}';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const selectSingleClubData = async club => {
  const query = `SELECT * FROM Users WHERE username='${user}';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

module.exports.selectUsersClubs = selectUsersClubs;
module.exports.selectAllClubsData = selectAllClubsData;
module.exports.selectSingleClubData = selectSingleClubData;
