require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const { getUsersBy } = require("./utils/");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

// cron scheduled to run every 3 hours, can be changed easily to every day
let cron = schedule.scheduleJob("* */30 * * * *", function() {
  // run some function to fetch sports data and write to the db
  getUsersBy("wins");
  getUsersBy("losses");
  getUsersBy("totalBets");
  getUsersBy("win_ratio");
  getUsersBy("available_balance");
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
