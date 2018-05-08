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

module.exports.mysqldb = mysqldb;
module.exports.mongodb = mongodb;
