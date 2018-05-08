const mysqldb = require("../../index.js").mysqldb;

const selectUsers = async lounge => {
  const query =
    "SELECT Users.username FROM UsersLounges INNER JOIN Users ON Users.id = UsersLounges.user WHERE UsersLounges.lounge=?";
  try {
    let data = await mysqldb.query(query, [lounge]);
    return data;
  } catch (err) {
    console.log("error selecting Users from lounge ", err);
    return;
  }
};

module.exports.selectUsers = selectUsers;
