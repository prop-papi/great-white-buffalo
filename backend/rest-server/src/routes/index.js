const express = require("express");
const authRouter = require("../components/auth/");
const betsRouter = require("../components/bets/");
const clubsRouter = require("../components/clubs/");
const notificationsRouter = require("./../components/notifications/");
const usersRouter = require("../components/users/");
const loungesRouter = require("../components/lounges");
const messageRouter = require("../components/chat/");
const leaderboardRouter = require("../components/leaderboard/");
const userPaneRouter = require("../components/users-pane/");
const router = express.Router();

router
  .use("/auth", authRouter)
  .use("/users", usersRouter)
  .use("/bets", betsRouter)
  .use("/clubs", clubsRouter)
  .use("/notifications", notificationsRouter)
  .use("/lounges", loungesRouter)
  .use("/message", messageRouter)
  .use("/leaderboard", leaderboardRouter)
  .use("/userpane", userPaneRouter);

module.exports = router;
