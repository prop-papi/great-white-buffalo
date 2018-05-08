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

module.exports.selectAllLoungesInClub = selectAllLoungesInClub;
