let express = require("express");
let authRouter = require("../components/auth/");
let betsRouter = require("../components/bets/");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/bets", betsRouter);

module.exports = router;
