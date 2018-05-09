require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const _ = require("underscore");
const parseString = require("xml2js").parseString;
const schedule = require("node-schedule");
const util = require("./utils/index");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

let cron = schedule.scheduleJob("*/5 * * * *", function() {
  // run some function to fetch sports data and write to the db
  util.addNewLounges();
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
