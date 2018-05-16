const mysqldb = require("../../index.js").mysqldb;
const SqlString = require("sqlstring");

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
  const query = `select * from Clubs where id=12;`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const selectDefaultClub = async id => {
  const query = `select Clubs.id, Clubs.name, Clubs.security, Clubs.is_archived, Clubs.logo from Clubs inner join Users on Users.default_club=Clubs.id where Users.id='${id}';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const insertClub = async (name, security, logo, adminId) => {
  const query = `insert into Clubs (name, security, logo, admin_id) values (${SqlString.escape(
    name
  )}, '${security}', '${logo}', '${adminId}');`;
  try {
    let data = await mysqldb.query(query);
    const insertedQuery = `SELECT * FROM Clubs WHERE Clubs.id=${
      data.insertId
    };`;
    try {
      console.log(data);
      return await mysqldb.query(insertedQuery);
    } catch (err) {
      console.log("error", err);
      return err;
    }
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

module.exports.selectUsersClubs = selectUsersClubs;
module.exports.selectAllClubsData = selectAllClubsData;
module.exports.selectSingleClubData = selectSingleClubData;
module.exports.selectGlobalClub = selectGlobalClub;
module.exports.selectDefaultClub = selectDefaultClub;
module.exports.insertClub = insertClub;
