const express = require("express");
const router = express.Router();
const usersdb = require("../../db/models/users/index.js");

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
    return err;
  }
});

module.exports = router;
