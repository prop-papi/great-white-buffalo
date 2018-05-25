const express = require("express");
const router = express.Router();
const {
  insertNewMessage,
  selectTop50Messages
} = require("../../db/models/messages/");

router.post("/send", async (req, res) => {
  try {
    console.log("payload: ", req.body);
    let { user, currentLoungeID, createdAt, text, media } = req.body;
    insertNewMessage(user, currentLoungeID, createdAt, text, media);
    res.status(200).send("successful post");
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error storing to database");
    return err;
  }
});

router.get("/:lounge", async (req, res) => {
  try {
    let { lounge } = req.params;
    let messages = await selectTop50Messages(lounge);
    res.status(200).send(messages);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Error getting");
    return err;
  }
});

module.exports = router;
