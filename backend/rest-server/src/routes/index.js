const express = require("express");
const authRouter = require("../components/auth/");
const betsRouter = require("../components/bets/");
const usersRouter = require("./../components/users/");
const userPaneRouter = require("../components/users-pane/");
const router = express.Router();

router
  .use("/auth", authRouter)
  .use("/users", usersRouter)
  .use("/bets", betsRouter)
  .use("/userpane", userPaneRouter);

module.exports = router;
