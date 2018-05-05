const express = require("express");
const router = express.Router();
const pass = require("../../middleware/passport.js");

const _ = require("underscore");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const authdb = require("../../db/models/auth/index.js");

// handle user login route
router.post("/login", async function(req, res, next) {
  passport.authenticate(
    "local-login",
    { session: false, failureRedirect: "/login" },
    function(err, user, info) {
      if (err || !user) {
        return res.status(401).send(JSON.stringify(info));
      }
      req.login(user, { session: false }, function(err) {
        if (err) {
          console.log("Error: ", err);
          res.send(err);
        }
        let token = jwt.sign(
          { data: JSON.parse(user[0].id) },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "1d"
          }
        );
        res.set(
          "auth",
          JSON.stringify({ auth: true, token: token, id: user[0].id })
        );
        res.set("Access-Control-Expose-Headers", "auth");
        res.send(JSON.stringify(user));
      });
    }
  )(req, res, next);
});

router.post("/signup", async function(req, res) {
  let data = await authdb.selectUser(req.body.username);
  if (data.length) {
    res.send("Username already exists.");
  } else {
    try {
      const newUser = await authdb.insertNewUser(
        req.body.username,
        req.body.password
      );
      const token = jwt.sign(
        { data: req.body.signup_email },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "1d"
        }
      );
      const user = await authdb.selectNewUser(newUser.insertId);
      res.set(
        "auth",
        JSON.stringify({ auth: true, token: token, id: data.id })
      );
      res.set("Access-Control-Expose-Headers", "auth");
      res.send(JSON.stringify(user));
    } catch (err) {
      console.log(err);
      res.status(401).send();
    }
  }
});

router.get("/logout", function(req, res) {
  res.redirect("/login");
});

module.exports = router;
