const mysqldb = require("../../index.js").mysqldb;
const mysql = require("mysql");

const selectAllLoungesInClub = async club => {
  const query = `select * from Lounges WHERE club=${club};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const checkLoungeExist = async name => {
  const query = `select * from Lounges WHERE name=${name};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const insertLounge = async (club, name) => {
  const query = `insert into Lounges (club, name, type, security) values ('${club}', '${name}', 'text', 'public');`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

module.exports.selectAllLoungesInClub = selectAllLoungesInClub;
module.exports.checkLoungeExist = checkLoungeExist;
