const mysqldb = require("../../index.js").mysqldb;
const SqlString = require("sqlstring");

const insertNewBet = async (
  club,
  wager,
  odds,
  desc,
  expiresAt,
  endsAt,
  user
) => {
  const query = `INSERT INTO Bets (club, wager, odds, description, expires, end_at, creator) VALUES (
    ${SqlString.escape(Number(club))},
    ${SqlString.escape(Number(wager))},
    ${SqlString.escape(odds)},
    ${SqlString.escape(desc)},
    ${SqlString.escape(expiresAt)},
    ${SqlString.escape(endsAt)},
    ${SqlString.escape(Number(user))}
  )`;
  try {
    let data = await mysqldb.query(query);
    console.log("Successfully added bet - data - ", data);
    return data;
  } catch (err) {
    console.log("error", err);
    throw new Error(err);
  }
};

const selectAllBetsFromClubsList = async (clubs, myId) => {
  const query = `SELECT *, IF ((Bets.creator=${myId} OR Bets.challenger=${myId}), 1, 0) AS is_my_bet FROM Bets WHERE club in (${[
    //
    ...clubs
  ]}) ORDER BY is_my_bet DESC, status, id`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const selectAllBetsFromClub = async club => {
  const query = `select * from Bets WHERE club=${club};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const cancelBet = async betId => {
  const query = `UPDATE Bets SET status = IF(ISNULL(CHALLENGER), 'closed', status) WHERE id=${betId};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const acceptBet = async (betId, myId) => {
  const query = `UPDATE Bets SET challenger = IF(ISNULL(CHALLENGER) AND status='pending', ${myId}, challenger) WHERE id=${betId};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

module.exports.insertNewBet = insertNewBet;
module.exports.selectAllBetsFromClubsList = selectAllBetsFromClubsList;
module.exports.selectAllBetsFromClub = selectAllBetsFromClub;
module.exports.cancelBet = cancelBet;
module.exports.acceptBet = acceptBet;
