const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const betsdb = require("../../db/models/bets/index.js");

router.post("/create", async function(req, res) {
  console.log(req.body);
  try {
    const newUser = await betsdb.insertNewBet(
      req.body.club,
      req.body.wager,
      req.body.odds,
      req.body.description,
      req.body.formattedExpiresAt,
      req.body.formattedEndsAt,
      req.body.user
    );
    res.send(newUser);
  } catch (err) {
    console.log(err);
    res.status(401).send();
  }
});

module.exports = router;
