let express = require("express");
let authRouter = require("./../components/auth/");
const router = express.Router();

router.use("/auth", authRouter);

module.exports = router;
