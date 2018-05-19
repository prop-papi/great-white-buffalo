const express = require("express");
const router = express.Router();
const {
  insertNewMessage,
  selectTop50Messages
} = require("../../db/models/messages/");

router.post("/send", async (req, res) => {
  try {
    console.log("payload: ", req.body);
    let { user, currentLoungeID, text, media } = req.body;
    insertNewMessage(user, currentLoungeID, text, media);
    res.status(200).send("successful post");
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
