const express = require("express");
const authRouter = require("../components/auth/");
const betsRouter = require("../components/bets/");
const usersRouter = require("./../components/users/");
const router = express.Router();

router
  .use("/auth", authRouter)
  .use("/users", usersRouter)
  .use("/bets", betsRouter);

module.exports = router;
