const mysqldb = require("../../index.js").mysqldb;
//const mysql = require("mysql");
const SqlString = require("sqlstring");

const insertNewBet = async (club, wager, odds, desc, expiresAt, endsAt, user) => {
  const query = `INSERT INTO Bets (club, wager, odds, description, expires, end_at, creator) VALUES (
    ${SqlString.escape(Number(club))},
    ${SqlString.escape(Number(wager))},
    ${SqlString.escape(odds)},
    ${SqlString.escape(desc)},
    ${SqlString.escape(expiresAt)},
    ${SqlString.escape(endsAt)},
    ${SqlString.escape(Number(user))}
  )`;
  console.log(query)
  try {
    let data = await mysqldb.query(query);
    console.log("Successfully added bet - data - ", data);
    return data;
  } catch (err) {
    console.log("error", err);
    throw new Error(err);
  }
};

module.exports.insertNewBet = insertNewBet;