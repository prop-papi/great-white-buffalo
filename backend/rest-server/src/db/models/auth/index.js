const db = require("../../index.js");
const mysql = require("mysql");
const bcrypt = require("bcrypt-nodejs");
const SqlString = require("sqlstring");

const getAllUsers = async () => {
  const query = "SELECT * FROM Users;";
  try {
    let data = await db.query(query);
    console.log("success", data);
  } catch {
    console.log("error");
    throw new Error(err);
  }
};

const insertNewUser = async (user, pw, cb) => {
  const query = `INSERT INTO Users (username, password) VALUES (${username}, ${somepw});`;
  try {
    let data = await db.query(query);
    console.log("success", data);
  } catch {
    console.log("error");
    throw new Error(err);
  }
};

module.exports.getAllUsers = getAllUsers;
module.exports.insertNewUser = insertNewUser;
