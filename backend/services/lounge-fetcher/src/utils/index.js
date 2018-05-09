const request = require("request");
const _ = require("underscore");
const parseString = require("xml2js").parseString;
const loungedb = require("../../../../rest-server/src/db/models/lounges/index");

const map = {
  1: "NFL",
  2: "MLB",
  3: "NHL",
  4: "NBA",
  5: "MLS"
};

let addNewLounges = async () => {
  let formatedDate = new Date()
    .toJSON()
    .slice(0, 10)
    .replace(/-/g, "");

  _.each(map, async function(league) {
    await request.get(
      `http://scores.nbcsports.msnbc.com/ticker/data/gamesMSNBC.js.asp?jsonp=true&sport=${league}&period=${formatedDate}`,
      async function(err, res, body) {
        let data = JSON.parse(
          body.replace("shsMSNBCTicker.loadGamesData(", "").replace(");", "")
        );
        _.each(data.games, function(game) {
          parseString(game, function(err, result) {
            console.log(
              result["ticker-entry"]["visiting-team"][0]["$"].display_name
            );
            console.log(
              result["ticker-entry"]["home-team"][0]["$"].display_name
            );
          });
        });
      }
    );
  });
};

module.exports.addNewLounges = addNewLounges;
