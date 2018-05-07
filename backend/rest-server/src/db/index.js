const mysql = require("promise-mysql");
const mongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
let _ = require("underscore");

// connect mysql db config
const mysqldb = mysql.createPool({
  host: process.env.AWS_HOST,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  database: process.env.AWS_DATABASE
});

const mongoConnectString = `mongodb://${process.env.MONGO_USERNAME}:${
  process.env.MONGO_PASSWORD
}@${process.env.MONGO_DATABASE}-shard-00-00-du3wx.mongodb.net:27017,${
  process.env.MONGO_DATABASE
}-shard-00-01-du3wx.mongodb.net:27017,${
  process.env.MONGO_DATABASE
}-shard-00-02-du3wx.mongodb.net:27017/${
  process.env.MONGO_DATABASE
}?ssl=true&replicaSet=${process.env.MONGO_DATABASE}-shard-0&authSource=admin`;

let promise = mongoose.connect(mongoConnectString);
console.log(process.env.AWS_DATABASE)
console.log(process.env.AWS_HOST)
console.log(process.env.AWS_USER)
// example function for pulling global data
let test = async () => {
  let query1 = `select club from UsersClubs WHERE user=1;`;
  let data = await connection.query(query1);
  let clubs = [];
  _.each(data, function(row) {
    clubs.push(row.club);
  });
  let query2 = `select * from Clubs WHERE id in (${[...clubs]})`;
  let query3 = `select * from Bets WHERE club in (${[...clubs]})`;
  let data2 = await connection.query(query2);
  let data3 = await connection.query(query3);
  let global = {};
  global["clubs"] = JSON.parse(JSON.stringify(data2));
  global["bets"] = JSON.parse(JSON.stringify(data3));
  console.log(global);
};

let mongodb = mongoose.connection;
mongodb.on("error", console.error.bind(console, "connection error:"));
mongodb.once("open", async function() {
  console.log("MySQL/Mongo databases successfully connected.");
  // **** TEST FUNCTION to pull all messages from mongo db ****
  // let data = await mongodb
  //   .collection("messages")
  //   .find({})
  //   .toArray();
  // console.log(data);
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

module.exports.mysqldb = mysqldb;
module.exports.mongodb = mongodb;
module.exports = connection;
