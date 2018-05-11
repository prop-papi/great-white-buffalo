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

const selectAllUsersInClub = async clubID => {
  const query = `SELECT greatwhitebuffalo.Users.username 
  FROM greatwhitebuffalo.UsersClubs
  INNER JOIN greatwhitebuffalo.Users 
  ON greatwhitebuffalo.UsersClubs.user = greatwhitebuffalo.Users.id
  WHERE greatwhitebuffalo.UsersClubs.club = ?;`;

  try {
    return await mysqldb.query(query, [clubID]);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const getFriends = async user => {
  const query = `SELECT u1.username AS user1, u2.username AS user2 FROM Friends
  inner join Users u1 on u1.id = user_1
  inner join Users u2 on u2.id = user_2
  WHERE (Friends.user_1 = ? OR Friends.user_2 = ?)
  AND Friends.status = 1;`;

  try {
    return await mysqldb.query(query, [user, user]);
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
module.exports.selectAllUsersInClub = selectAllUsersInClub;
module.exports.getFriends = getFriends;
