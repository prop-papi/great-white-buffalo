const express = require("express");
const router = express.Router();
const usersdb = require("../../db/models/users/index.js");

// fetch global and local club data on user login
router.post("/updateDefault", async function(req, res) {
  // req.params.id is our user id, req.params.club is the default club
  console.log(req.body);
  try {
    let data = await usersdb.updateDefaultClub(
      parseInt(req.body.user),
      req.body.club
    );
    res.status(200).send();
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error updating user default club.");
    return err;
  }
});

module.exports = router;
