const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const usersdb = require("../../db/models/users/index.js");

router.get("/selected", async function(req, res) {
  const username = req.query.username;
  try {
    let selectedUser = await usersdb.selectUser(username);
    res.json(selectedUser);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Database error.");
    return err;
  }
});

router.get("/allUsers", async function(req, res) {
  const clubID = req.query.clubID;
  try {
    let allUsers = await usersdb.selectAllUsersInClub(clubID);
    res.json(allUsers);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Database error.");
    return err;
  }
});

router.get("/friends", async function(req, res) {
  const id = req.query.id;
  try {
    let friends = await usersdb.getFriends(id);
    res.json(friends);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Database error.");
    return err;
  }
});

module.exports = router;
