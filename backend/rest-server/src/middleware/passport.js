const _ = require("underscore");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const authdb = require("../db/models/auth/index.js");

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    async function(req, username, password, callback) {
      try {
        let data = await authdb.selectUser(username);
        if (!data.length) {
          callback(null, false, "Username does not exist.");
        } else {
          try {
            let verified = await authdb.verifyUser(password, data[0].password);
            verified === true
              ? callback(null, data, "Login successful.")
              : callback(null, false, "Incorrect password.");
          } catch (err) {
            console.log("Error: ", err);
            throw new Error(err);
          }
        }
      } catch (err) {
        console.log("Error: ", err);
        throw new Error(err);
      }
    }
  )
);

let authenticate = (req, res, next) => {
  if (req.url === "/login" || req.url === "/signup") {
    next();
  } else {
    jwt.verify(req.cookies.token, process.env.TOKEN_SECRET, function(
      err,
      token
    ) {
      if (err) {
        res.status(500).send();
      } else {
        next();
      }
    });
  }
};

module.exports.authenticate = authenticate;
