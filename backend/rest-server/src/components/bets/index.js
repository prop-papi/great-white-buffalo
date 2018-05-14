const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const betsdb = require("../../db/models/bets/index.js");

router.post("/create", async function(req, res) {
  try {
    const newBet = await betsdb.insertNewBet(
      req.body.club,
      req.body.wager,
      req.body.odds,
      req.body.description,
      req.body.formattedExpiresAt,
      req.body.formattedEndsAt,
      req.body.user
    );
    res.send(newBet[0]);
  } catch (err) {
    console.log(err);
    res.status(401).send();
  }
});

router.post("/cancel", async function(req, res) {
  try {
    const updated = await betsdb.cancelBet(req.body.betId);
    res.send(updated);
  } catch (err) {
    console.log(err);
    res.status(401).send();
  }
});

router.post("/accept", async function(req, res) {
  try {
    const updated = await betsdb.acceptBet(req.body.betId, req.body.myId);
    res.send(updated);
  } catch (err) {
    console.log(err);
    res.status(401).send();
  }
});

router.post("/vote", async function(req, res) {
  const { bet, myId, vote } = req.body;
  if (vote === 0) {
    const creator_vote = bet.creator === myId ? 0 : 1;
    const challenger_vote = bet.creator === myId ? 1 : 0;
    const status = "resolved";
    const result = creator_vote === 0 ? bet.challenger : bet.creator;
    try {
      const updated = await betsdb.voteLoss(
        bet.id,
        status,
        result,
        creator_vote,
        challenger_vote
      );
      console.log("vote 0 db returned ", updated);
      res.send(updated);
    } catch (err) {
      console.log(err);
      res.status(401).send();
    }
  } else if (vote === 1) {
    const updateField =
      myId === bet.creator ? "creator_vote" : "challenger_vote";
    const checkField =
      myId === bet.creator ? "challenger_vote" : "creator_vote";
    try {
      const updated = await betsdb.voteWin(bet.id, updateField, checkField);
      console.log("vote 1 db returned ", updated);
      res.send(updated);
    } catch (err) {
      console.log(err);
      res.status(401).send();
    }
  }
});

module.exports = router;
