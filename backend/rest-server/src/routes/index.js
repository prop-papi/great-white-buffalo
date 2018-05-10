const express = require("express");
const authRouter = require("../components/auth/");
const betsRouter = require("../components/bets/");
const clubsRouter = require("../components/clubs/");
const usersRouter = require("./../components/users/");
const userPaneRouter = require("../components/users-pane/");
const router = express.Router();

router
  .use("/auth", authRouter)
  .use("/users", usersRouter)
  .use("/bets", betsRouter)
  .use("/clubs", clubsRouter)
  .use("/userpane", userPaneRouter);

module.exports = router;
