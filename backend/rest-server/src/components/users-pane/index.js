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

module.exports = router;
