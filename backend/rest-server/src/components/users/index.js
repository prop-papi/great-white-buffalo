const express = require("express");
const router = express.Router();

const _ = require("underscore");
const bodyParser = require("body-parser");
const usersdb = require("../../db/models/users/index.js");

// fetch global and local club data on user login
router.get("/:id", async function(req, res, next) {
  // req.params.id is our user id
  console.log(req.params.id);
});

module.exports = router;
