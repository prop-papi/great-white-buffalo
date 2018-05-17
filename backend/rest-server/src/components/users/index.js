const express = require("express");
const router = express.Router();

const _ = require("underscore");
const usersdb = require("../../db/models/users/index.js");
const clubsdb = require("../../db/models/clubs/index.js");
const loungesdb = require("../../db/models/lounges/index.js");
const betsdb = require("../../db/models/bets/index.js");
const notificationsdb = require("../../db/models/notifications/index.js");

// fetch global and local club data on user login
router.get("/:id", async function(req, res) {
  // req.params.id is our user id, req.params.club is the default club
  let globalData = {};
  let myClubs = [];
  try {
    let clubs = await clubsdb.selectUsersClubs(req.params.id);
    // create array of my clubs
    _.each(clubs, function(row) {
      myClubs.push(row.club);
    });
    // grab all data for each club in array and assign to global object
    let clubsData = await clubsdb.selectAllClubsData(myClubs);
    globalData["clubs"] = clubsData;
    let betsData = await betsdb.selectAllBetsFromClubsList(
      myClubs,
      req.params.id
    );
    globalData["bets"] = betsData;
    let balances = await usersdb.getBalance(req.params.id);
    globalData["balances"] = balances;
    let globalClub = await clubsdb.selectGlobalClub();
    globalData["globalClub"] = globalClub;
    let defaultClub = await clubsdb.selectDefaultClub(req.params.id);
    globalData["defaultClub"] = defaultClub;

    // send response back to client
    res.json(globalData);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Database error.");
    return err;
  }
});

router.get("/local/:club", async function(req, res) {
  // req.params.id is our user id, req.params.club is the default club
  let localData = {
    currentMainComponent: "bets"
  };

  try {
    // grab all day for local object
    let defaultClub = await clubsdb.selectSingleClubData(req.params.club);
    localData["club"] = defaultClub[0];
    let lounges = await loungesdb.selectAllLoungesInClub(req.params.club);
    localData["lounges"] = lounges;

    // send response back to client
    res.json(localData);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Database error.");
    return err;
  }
});

module.exports = router;
