const mysqldb = require("../../index.js").mysqldb;
const mysql = require("mysql");
const bcrypt = require("bcrypt-nodejs");
const SqlString = require("sqlstring");

const insertNewUser = async (user, pw) => {
  const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS);
  const hash = bcrypt.hashSync(pw, salt);
  const query = `INSERT INTO Users (username, password) VALUES (${SqlString.escape(
    user
  )}, '${hash}');`;
  try {
    let data = await mysqldb.query(query);
    console.log("Successfully created new user.", data);
    return data;
  } catch (err) {
    console.log("error", err);
    throw new Error(err);
  }
};

const selectUser = async user => {
  const query = `SELECT * FROM Users WHERE username='${user}';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const selectNewUser = async id => {
  const query = `SELECT * FROM Users WHERE id='${id}';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const verifyUser = async (pw, hash) => {
  let found = false;
  if (bcrypt.compareSync(pw, hash)) {
    found = true;
    return found;
  } else {
    return found;
  }
};

module.exports.insertNewUser = insertNewUser;
module.exports.selectUser = selectUser;
module.exports.verifyUser = verifyUser;
module.exports.selectNewUser = selectNewUser;
