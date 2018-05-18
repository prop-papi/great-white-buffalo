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

const selectAllUsersInClub = async (clubID, currUser) => {
  const query = `SELECT Users.username 
  FROM UsersClubs
  INNER JOIN Users 
  ON UsersClubs.user = Users.id
  WHERE (UsersClubs.club = ? AND Users.username != ?);`;

  try {
    return await mysqldb.query(query, [clubID, currUser]);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const getFriends = async user => {
  const query = `SELECT u1.username AS user1, u2.username AS user2, Friends.status FROM Friends
  inner join Users u1 on u1.id = user_1
  inner join Users u2 on u2.id = user_2
  WHERE (Friends.user_1 = ? OR Friends.user_2 = ?)
  AND Friends.status in (0, 1);`;

  try {
    return await mysqldb.query(query, [user, user]);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const addFriend = async (user_1, user_2, action_user) => {
  const query1 = `SELECT * FROM Friends WHERE (user_1=${user_1} AND user_2=${user_2}) OR (user_1=${user_2} AND user_2=${user_1});`;
  const query2 = `INSERT INTO Friends (user_1, user_2, Friends.status, action_user)
  VALUES (?, ?, 0, ?);`;
  try {
    let friendship = await mysqldb.query(query1);
    if (!friendship.length) {
      return await mysqldb.query(query2, [user_1, user_2, action_user]);
    } else {
      return;
    }
  } catch (err) {
    return err;
  }
};

const removeFriend = async (user_1, user_2) => {
  const query = `DELETE FROM Friends WHERE (user_1=${user_1} AND user_2=${user_2}) OR (user_1=${user_2} AND user_2=${user_1});`;
  try {
    return await mysqldb.query(query);
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

const updateFriendship = async (user1, user2, status) => {
  const query = `UPDATE Friends SET status=${status} WHERE (user_1=${user1} AND user_2=${user2}) OR (user_1=${user2} AND user_2=${user1});`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const getTop100UsersBy = async columnName => {
  const query = `
    SELECT username, wins, totalBets - wins AS losses, totalBets, win_ratio, reputation, available_balance
    FROM Users
    ORDER BY ${columnName} DESC
    LIMIT 100`;
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
module.exports.updateFriendship = updateFriendship;
module.exports.getTop100UsersBy = getTop100UsersBy;
