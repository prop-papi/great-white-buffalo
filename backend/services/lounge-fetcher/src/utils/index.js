const request = require("request");
const _ = require("underscore");
const parseString = require("xml2js").parseString;
const loungedb = require("../../../../rest-server/src/db/models/lounges/index");
const moment = require("moment");

let addNewLounges = async () => {
  let date = new Date();
  let formattedDate = moment(date).format("YYYYMMDD");
  let loungeDate = moment(date).format("MMM Do");

  let formattedDate1 = moment(date)
    .add(1, "d")
    .format("YYYYMMDD");
  let loungeDate1 = moment(date)
    .add(1, "d")
    .format("MMM Do");

  let formattedDate2 = moment(date)
    .add(2, "d")
    .format("YYYYMMDD");
  let loungeDate2 = moment(date)
    .add(2, "d")
    .format("MMM Do");

  // current day
  let nba = await makeSportRequest("NBA", formattedDate, loungeDate, 4);
  let mlb = await makeSportRequest("MLB", formattedDate, loungeDate, 2);
  let mls = await makeSportRequest("MLS", formattedDate, loungeDate, 5);
  let nhl = await makeSportRequest("NHL", formattedDate, loungeDate, 3);
  let nfl = await makeSportRequest("NFL", formattedDate, loungeDate, 1);

  // tomorrow
  let nba1 = await makeSportRequest("NBA", formattedDate1, loungeDate1, 4);
  let mlb1 = await makeSportRequest("MLB", formattedDate1, loungeDate1, 2);
  let mls1 = await makeSportRequest("MLS", formattedDate1, loungeDate1, 5);
  let nhl1 = await makeSportRequest("NHL", formattedDate1, loungeDate1, 3);
  let nfl1 = await makeSportRequest("NFL", formattedDate1, loungeDate1, 1);

  // two days from now
  let nba2 = await makeSportRequest("NBA", formattedDate2, loungeDate2, 4);
  let mlb2 = await makeSportRequest("MLB", formattedDate2, loungeDate2, 2);
  let mls2 = await makeSportRequest("MLS", formattedDate2, loungeDate2, 5);
  let nhl2 = await makeSportRequest("NHL", formattedDate2, loungeDate2, 3);
  let nfl2 = await makeSportRequest("NFL", formattedDate2, loungeDate2, 1);
};

let makeSportRequest = async (sport, date, loungeDate, club) => {
  let body = await asyncRequest(
    `http://scores.nbcsports.msnbc.com/ticker/data/gamesMSNBC.js.asp?jsonp=true&sport=${sport}&period=${date}`
  );
  let data = JSON.parse(
    body.replace("shsMSNBCTicker.loadGamesData(", "").replace(");", "")
  );
  _.each(data.games, async function(game) {
    parseString(game, async function(err, result) {
      let homeTeam =
        result["ticker-entry"]["visiting-team"][0]["$"].display_name;
      // examples of dates from api
      // console.log(result["ticker-entry"].gamestate[0]["$"].gametime); 7:30 PM
      // console.log(result["ticker-entry"].gamestate[0]["$"].gamedate); 5/9
      let visitingTeam =
        result["ticker-entry"]["home-team"][0]["$"].display_name;
      let loungeName = visitingTeam + " @ " + homeTeam + " - " + loungeDate;
      let checkLoungeExist = await loungedb.checkLoungeExist(loungeName);
      if (!checkLoungeExist.length) {
        let insert = await loungedb.insertLounge(club, loungeName);
        console.log("New Lounge Added.");
      }
    });
  });
};

// custom async request function using promises
let asyncRequest = async value =>
  new Promise((resolve, reject) => {
    request.get(value, (error, response, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });

module.exports.addNewLounges = addNewLounges;
