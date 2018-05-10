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

const selectAllUsers = async () => {
  const query = `SELECT username FROM Users`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const getBalance = async user => {
  const query = `SELECT available_balance, escrow_balance FROM Users WHERE id='${user}';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const updateDefaultClub = async (user, club) => {
  const query = `UPDATE Users SET default_club='${club}' WHERE id='${user}';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

module.exports.selectUser = selectUser;
module.exports.getBalance = getBalance;
module.exports.updateDefaultClub = updateDefaultClub;
module.exports.selectAllUsers = selectAllUsers;
