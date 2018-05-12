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
  const query = `SELECT Users.username 
  FROM UsersClubs
  INNER JOIN Users 
  ON UsersClubs.user = Users.id
  WHERE UsersClubs.club = ?;`;

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

const addFriend = async (user_1, user_2, action_user) => {
  const query = `INSERT INTO Friends (user_1, user_2, Friends.status, action_user)
  VALUES (?, ?, 1, ?);`;
  try {
    return await mysqldb.query(query, [user_1, user_2, action_user]);
  } catch (err) {
    return err;
  }
};

const removeFriend = async (user_1, user_2) => {
  const query = `DELETE FROM Friends WHERE (user_1=? AND user_2=?);`;
  try {
    return await mysqldb.query(query, [user_1, user_2]);
  } catch (err) {
    return err;
  }
};

const toggleBlockFriends = async (status, myUserID, otherUserID) => {
  const query = `UPDATE Friends SET Friends.status=?, action_user=?
  WHERE (user_1=? or user_2=?)
  AND (user_1=? or user_2=?)`;

  try {
    return await mysqldb.query(query, [
      status,
      myUserID,
      myUserID,
      myUserID,
      otherUserID,
      otherUserID
    ]);
  } catch (err) {
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
module.exports.toggleBlockFriends = toggleBlockFriends;
module.exports.addFriend = addFriend;
module.exports.removeFriend = removeFriend;
