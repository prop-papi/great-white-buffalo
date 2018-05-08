const mysqldb = require("../../index.js").mysqldb;

const selectUsersClubs = async user => {
  const query = `select club from UsersClubs WHERE user=${user};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const selectAllClubsData = async clubs => {
  const query = `select * from Clubs WHERE id in (${[...clubs]})`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const selectSingleClubData = async club => {
  const query = `select * from Clubs WHERE id=${club};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const selectGlobalClub = async () => {
  const query = `select * from Clubs WHERE id=12;`;
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
module.exports.selectGlobalClub = selectGlobalClub;
