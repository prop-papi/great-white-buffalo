const mysql = require("promise-mysql");
const mongoose = require("mongoose");
const _ = require("underscore");

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

mongoose.connect(mongoConnectString, function(err) {
  if (err) {
    console.log("Error connecting to mongo.");
  } else {
    console.log("MySQL/Mongo databases successfully connected.");
  }
});

let mongodb = mongoose.connection;

let messages = new mongoose.Schema({
  user: String,
  lounge: Number,
  text: String,
  media: String,
  createdAt: Date
});

let Message = mongoose.model("Messages", messages);

module.exports.mysqldb = mysqldb;
module.exports.Message = Message;
module.exports.mongodb = mongodb;
