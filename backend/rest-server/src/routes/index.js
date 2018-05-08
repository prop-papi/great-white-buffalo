let express = require("express");
let authRouter = require("../components/auth/");
let betsRouter = require("../components/bets/");
let loungeUsersRouter = require("../components/loungeUsers/");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/bets", betsRouter);
router.use("/loungeUsers", loungeUsersRouter);

module.exports = router;
