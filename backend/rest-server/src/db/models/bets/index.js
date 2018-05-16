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
  );`;
  try {
    let data = await mysqldb.query(query);
    const insertedQuery = `SELECT u1.username AS creator_name, u2.username AS challenger_name, Clubs.name AS club_name, Bets.id, description, wager, quantity, Bets.status, creator, challenger, Bets.club, Bets.created_at, end_at, odds, expires, result, creator_vote, challenger_vote, 1 AS is_my_bet FROM Bets 
    LEFT JOIN Users u1 on u1.id = creator
    LEFT JOIN Users u2 on u2.id = challenger
    INNER JOIN Clubs on Clubs.id = Bets.club
    WHERE Bets.id=${data.insertId};`;
    try {
      return await mysqldb.query(insertedQuery);
    } catch (err) {
      console.log("error", err);
      return err;
    }
  } catch (err) {
    console.log("error", err);
    throw new Error(err);
  }
};

const selectAllBetsFromClubsList = async (clubs, myId) => {
  const query = `SELECT u1.username AS creator_name, u2.username AS challenger_name, Clubs.name AS club_name, Bets.id, description, wager, quantity, Bets.status, creator, challenger, Bets.club, Bets.created_at, end_at, odds, expires, result, creator_vote, challenger_vote, IF ((Bets.creator=${myId} OR Bets.challenger=${myId}), 1, 0) AS is_my_bet FROM Bets 
  LEFT JOIN Users u1 on u1.id = creator
  LEFT JOIN Users u2 on u2.id = challenger
  INNER JOIN Clubs on Clubs.id = Bets.club
  WHERE club in (${[
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
  const query = `UPDATE Bets SET status = IF(ISNULL(CHALLENGER), 'canceled', status) WHERE id=${betId};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const acceptBet = async (betId, myId) => {
  const query = `UPDATE Bets SET challenger = IF(ISNULL(CHALLENGER) AND status='pending', ${myId}, challenger), status = IF(status='pending', 'active', status) WHERE id=${betId};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const voteLoss = async (
  betId,
  status,
  result,
  creator_vote,
  challenger_vote
) => {
  const query = `UPDATE Bets SET status='${status}', result=${result}, creator_vote=${creator_vote}, challenger_vote=${challenger_vote} WHERE id=${betId};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const voteWin = async (betId, updateField, checkField) => {
  const query = `UPDATE Bets SET ${updateField} = 1, status = IF(${checkField} = 1, 'disputed', status) WHERE id = ${betId};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const getActiveBets = async () => {
  const query = `SELECT id, status, end_at, creator, challenger FROM Bets WHERE status='active';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const getPendingBets = async () => {
  const query = `SELECT id, status, end_at, creator FROM Bets WHERE status='pending';`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const updateToVotingBets = async ids => {
  const query = `UPDATE Bets SET status='voting' WHERE id in (${[...ids]});`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const updateToExpiredBets = async ids => {
  const query = `UPDATE Bets SET status='expired' WHERE id in (${[...ids]});`;
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
module.exports.voteLoss = voteLoss;
module.exports.voteWin = voteWin;
module.exports.getActiveBets = getActiveBets;
module.exports.getPendingBets = getPendingBets;
module.exports.updateToVotingBets = updateToVotingBets;
module.exports.updateToExpiredBets = updateToExpiredBets;
