const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const usersdb = require("../../db/models/users/index.js");

router.get("/selected", async (req, res) => {
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

router.get("/allUsers", async (req, res) => {
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

router.get("/friends", async (req, res) => {
  const id = req.query.id;
  try {
    let friends = await usersdb.getFriends(id);
    // console.log(friends);
    res.json(friends);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Database error.");
    return err;
  }
});

router.post("/addFriend", async (req, res) => {
  const { user_1, user_2, action_user } = req.body;
  try {
    await usersdb.addFriend(user_1, user_2, action_user);
    res.status(201).send();
  } catch (err) {
    console.log("err ", err);
    res.status(401).send();
  }
});

router.post("/removeFriend", async (req, res) => {
  const { user_1, user_2 } = req.body;
  try {
    await usersdb.removeFriend(user_1, user_2);
    res.status(201).send();
  } catch (err) {
    res.status(401).send();
  }
});

router.post("/block", async (req, res) => {
  const { status, myUserID, otherUserID } = req.body;
});

module.exports = router;
