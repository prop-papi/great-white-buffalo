const express = require("express");
const router = express.Router();
const loungesdb = require("../../db/models/lounges/index.js");

router.post("/insertlounge", async function(req, res) {
  try {
    console.log(req.body);
    let newLounge = await loungesdb.insertLounge(
      req.body.club,
      req.body.name,
      req.body.time,
      req.body.security,
      req.body.adminId,
      req.body.videoLink
    );
    res.status(200).send(newLounge[0]);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error inserting new Lounge.");
  }
});

module.exports = router;
