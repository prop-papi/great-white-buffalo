const _ = require("underscore");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const db = require("../db/index.js");
const auth = require("../db/models/auth/index.js");

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    async function(req, username, password, callback) {
      let data = await auth.getAllUsers();
      // Users.findUser(email, function(err, data) {
      //   if (err) {
      //     callback(err);
      //   }
      //   // if user doesn't exist, send notification
      //   if (!data.length) {
      //     callback(null, false, "User not found.");
      //   } else {
      //     // compare user password to hashed password
      //     Users.verifyUser(password, data[0].pw, function(result) {
      //       // if result = true -> log the user in
      //       if (result) {
      //         callback(null, data, "Login successful.");
      //       } else {
      //         callback(null, false, "Incorrect password.");
      //       }
      //     });
      //   }
      // });
    }
  )
);

let authenticate = (req, res, next) => {
  if (req.url === "/login" || req.url === "/signup") {
    next();
  } else {
    jwt.verify(req.headers.cookie, configs.HASHKEY, function(err, token) {
      if (err) {
        // should send an error response here and reload login page - TO DO
        res.redirect("/login");
        console.log(err);
      } else {
        // token verified
        next();
      }
    });
  }
};

module.exports.authenticate = authenticate;
