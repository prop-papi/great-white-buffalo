const mysql = require("promise-mysql");
const mongoClient = require("mongodb").MongoClient;
let _ = require("underscore");

const mongoConnectString = `mongodb://${process.env.MONGO_USERNAME}:${
  process.env.MONGO_PASSWORD
}@${process.env.MONGO_DATABASE}-shard-00-00-du3wx.mongodb.net:27017,${
  process.env.MONGO_DATABASE
}-shard-00-01-du3wx.mongodb.net:27017,${
  process.env.MONGO_DATABASE
}-shard-00-02-du3wx.mongodb.net:27017/${
  process.env.MONGO_DATABASE
}?ssl=true&replicaSet=${process.env.MONGO_DATABASE}-shard-0&authSource=admin`;

// connects mongo db and grabs all messages to view
const mongo = mongoClient.connect(mongoConnectString, async function(err, db) {
  let data = await db
    .collection("messages")
    .find({})
    .toArray();
  db.close();
});

// connect mysql db config
const connection = mysql.createPool({
  host: process.env.AWS_HOST,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  database: process.env.AWS_DATABASE
});

// example function for pulling global data
// let test = async () => {
//   let query1 = `select club from UsersClubs WHERE user=1;`;
//   let data = await connection.query(query1);
//   let clubs = [];
//   _.each(data, function(row) {
//     clubs.push(row.club);
//   });
//   let query2 = `select * from Clubs WHERE id in (${[...clubs]})`;
//   let query3 = `select * from Bets WHERE club in (${[...clubs]})`;
//   let data2 = await connection.query(query2);
//   let data3 = await connection.query(query3);
//   let global = {};
//   global["clubs"] = JSON.parse(JSON.stringify(data2));
//   global["bets"] = JSON.parse(JSON.stringify(data3));
//   console.log(global);
// };

// example function for pulling local club data
// let test2 = async () => {
//   let query1 = `select * from Clubs WHERE id=4;`;
//   let data = await connection.query(query1);
//   let local = {};
//   local["club"] = JSON.parse(JSON.stringify(data));
//   let query2 = `select * from Lounges WHERE club=4;`;
//   let data2 = await connection.query(query2);
//   local["lounges"] = JSON.parse(JSON.stringify(data2));
//   let query3 = `select * from Bets WHERE club=4;`;
//   let data3 = await connection.query(query3);
//   local["bets"] = JSON.parse(JSON.stringify(data3));
//   console.log(local);
// };

module.exports = connection;
