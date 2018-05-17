const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const usersdb = require("../../db/models/users/index.js");
const clubsdb = require("../../db/models/clubs/index.js");

router.post("/updateDefault", async function(req, res) {
  try {
    let data = await usersdb.updateDefaultClub(
      parseInt(req.body.user),
      req.body.club
    );
    res.status(200).send();
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error updating user default club.");
  }
});

router.post("/insertclub", async function(req, res) {
  try {
    let data = await clubsdb.insertClub(
      req.body.name,
      req.body.security,
      req.body.logo,
      req.body.adminId
    );
    console.log(data);
    res.status(200).send(data[0]);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error inserting clubs.");
  }
});

router.get("/getAvailableClubs", async function(req, res) {
  try {
    let data = await clubsdb.selectAllJoinableClubsForUser(req.query.userId);
    res.json(data);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error fetching available clubs.");
  }
});

router.post("/addUsersClubs", async function(req, res) {
  try {
    let data = await clubsdb.insertIntoUsersClubs(req.body.add);
    res.status(200).send();
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error updating user's clubs.");
  }
});

router.post("/removeUsersClubs", async function(req, res) {
  try {
    let data = await clubsdb.removeFromUsersClubs(req.body.leave);
    res.status(200).send();
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error updating user's clubs.");
  }
});

module.exports = router;
