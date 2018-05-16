const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const usersdb = require("../../db/models/users/index.js");
const notificationsdb = require("../../db/models/notifications/index.js");

router.post("/friendRequestResponse", async (req, res) => {
  // set notification sent to viewed
  let notificationType1;
  let notificationType2;
  if (req.body.status === 1) {
    notificationType1 = 0;
    notificationType2 = 0.1;
  } else {
    notificationType1 = 0.2;
    notificationType2 = 0.3;
  }
  try {
    let updateFriends = await usersdb.updateFriendship(
      req.body.user1,
      req.body.user2,
      req.body.status
    );
    await notificationsdb.friendRequestResponseNotification(
      req.body.user1,
      req.body.user2,
      notificationType2
    );
    await notificationsdb.friendRequestResponseNotification(
      req.body.user2,
      req.body.user1,
      notificationType1
    );
    await notificationsdb.notificationViewed(req.body.id);
    res.status(200).send();
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Database error.");
    return err;
  }
});

router.get("/:id", async (req, res) => {
  // set notification sent to viewed
  let data = {};
  try {
    let notifications = await notificationsdb.selectUsersNotifications(
      req.params.id
    );
    data["notifications"] = notifications;
    res.json(data);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Database error.");
    return err;
  }
});

router.post("/betAccepted", async (req, res) => {
  // set notification sent to viewed
  try {
    await notificationsdb.insertBetNotification(
      req.body.owner,
      req.body.partner,
      req.body.bet
    );
    res.status(200).send();
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Database error.");
    return err;
  }
});

module.exports = router;
