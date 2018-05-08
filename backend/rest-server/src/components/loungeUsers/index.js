const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const loungeUsersDB = require("../../db/models/loungeUsers");

router.get("/users", async (req, res) => {
  let data = await loungeUsersDB.selectUsers("9");
  data ? res.status(200).send(data) : res.status(401).send();
});

module.exports = router;
