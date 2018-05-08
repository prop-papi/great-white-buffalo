require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./routes/index.js");
const path = require("path");
const passport = require("passport");
const PORT = process.env.PORT || 1337; // process.env.PORT || 1337;
const request = require("request");
const _ = require("underscore");
const parseString = require("xml2js").parseString;

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  express.static(path.join(__dirname, "../../../frontend/client/public"))
);
app.use("/api", router);

app.get("/*", function(req, res) {
  res.sendFile(
    path.join(__dirname, "../../../frontend/client/public/index.html"),
    function(err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

let test = async () => {
  request.get(
    "http://scores.nbcsports.msnbc.com/ticker/data/gamesMSNBC.js.asp?jsonp=true&sport=MLS&period=20180509",
    function(err, res, body) {
      let data = body
        .replace("shsMSNBCTicker.loadGamesData(", "")
        .replace(");", "");
      let data2 = JSON.parse(data);
      _.each(data2.games, function(game) {
        parseString(game, function(err, result) {
          console.log(
            result["ticker-entry"]["visiting-team"][0]["$"].display_name
          );
          console.log(result["ticker-entry"]["home-team"][0]["$"].display_name);
        });
      });
    }
  );
};

test();

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
