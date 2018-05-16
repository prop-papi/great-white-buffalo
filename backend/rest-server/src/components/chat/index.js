const express = require("express");
const router = express.Router();
const chatdb = require("../../db/models/messages/");

router.post("/message", async (req, res) => {
  try {
    res.status(200).send();
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error storing to database");
    return err;
  }
});

// router.route("/message").post(async (req, res) => {
//   await console.log("request: ", req);
//   res.send(200);
// });

module.exports = router;
