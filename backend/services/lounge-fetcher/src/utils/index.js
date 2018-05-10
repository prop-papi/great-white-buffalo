const request = require("request");
const _ = require("underscore");
const parseString = require("xml2js").parseString;
const loungedb = require("../../../../rest-server/src/db/models/lounges/index");
const moment = require("moment");

let addNewLounges = async () => {
  let date = new Date();
  let formattedDate = moment(date).format("YYYYMMDD");
  let loungeDate = moment(date).format("MMM Do");
  let backupDate = moment(date).format("YYYY-MM-DD HH:mm:ss");

  let formattedDate1 = moment(date)
    .add(1, "d")
    .format("YYYYMMDD");
  let loungeDate1 = moment(date)
    .add(1, "d")
    .format("MMM Do");
  let backupDate1 = moment(date)
    .add(1, "d")
    .format("YYYY-MM-DD HH:mm:ss");

  let formattedDate2 = moment(date)
    .add(2, "d")
    .format("YYYYMMDD");
  let loungeDate2 = moment(date)
    .add(2, "d")
    .format("MMM Do");
  let backupDate2 = moment(date)
    .add(2, "d")
    .format("YYYY-MM-DD HH:mm:ss");

  // current day
  let nba = await makeSportRequest(
    "NBA",
    formattedDate,
    loungeDate,
    4,
    backupDate
  );
  let mlb = await makeSportRequest(
    "MLB",
    formattedDate,
    loungeDate,
    2,
    backupDate
  );
  let mls = await makeSportRequest(
    "MLS",
    formattedDate,
    loungeDate,
    5,
    backupDate
  );
  let nhl = await makeSportRequest(
    "NHL",
    formattedDate,
    loungeDate,
    3,
    backupDate
  );
  let nfl = await makeSportRequest(
    "NFL",
    formattedDate,
    loungeDate,
    1,
    backupDate
  );

  // tomorrow
  let nba1 = await makeSportRequest(
    "NBA",
    formattedDate1,
    loungeDate1,
    4,
    backupDate1
  );
  let mlb1 = await makeSportRequest(
    "MLB",
    formattedDate1,
    loungeDate1,
    2,
    backupDate1
  );
  let mls1 = await makeSportRequest(
    "MLS",
    formattedDate1,
    loungeDate1,
    5,
    backupDate1
  );
  let nhl1 = await makeSportRequest(
    "NHL",
    formattedDate1,
    loungeDate1,
    3,
    backupDate1
  );
  let nfl1 = await makeSportRequest(
    "NFL",
    formattedDate1,
    loungeDate1,
    1,
    backupDate1
  );

  // two days from now
  let nba2 = await makeSportRequest(
    "NBA",
    formattedDate2,
    loungeDate2,
    4,
    backupDate2
  );
  let mlb2 = await makeSportRequest(
    "MLB",
    formattedDate2,
    loungeDate2,
    2,
    backupDate2
  );
  let mls2 = await makeSportRequest(
    "MLS",
    formattedDate2,
    loungeDate2,
    5,
    backupDate2
  );
  let nhl2 = await makeSportRequest(
    "NHL",
    formattedDate2,
    loungeDate2,
    3,
    backupDate2
  );
  let nfl2 = await makeSportRequest(
    "NFL",
    formattedDate2,
    loungeDate2,
    1,
    backupDate2
  );
};

let makeSportRequest = async (sport, date, loungeDate, club, backupDate) => {
  let body = await asyncRequest(
    `http://scores.nbcsports.msnbc.com/ticker/data/gamesMSNBC.js.asp?jsonp=true&sport=${sport}&period=${date}`
  );
  // parse out response
  let data = JSON.parse(
    body.replace("shsMSNBCTicker.loadGamesData(", "").replace(");", "")
  );
  _.each(data.games, async function(game) {
    // extract data from XML
    parseString(game, async function(err, result) {
      let homeTeam =
        result["ticker-entry"]["visiting-team"][0]["$"].display_name;
      let visitingTeam =
        result["ticker-entry"]["home-team"][0]["$"].display_name;
      let gameTime = await dateParser(
        result["ticker-entry"].gamestate[0]["$"].gamedate,
        result["ticker-entry"].gamestate[0]["$"].gametime
      );
      if (gameTime === "Invalid date") {
        gameTime = backupDate;
      }
      // console.log(gameTime);
      let loungeName = visitingTeam + " @ " + homeTeam + " - " + loungeDate;
      let checkLoungeExist = await loungedb.checkLoungeExist(loungeName);
      if (!checkLoungeExist.length) {
        let insert = await loungedb.insertLounge(club, loungeName, gameTime);
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

let dateParser = async (m, t) => {
  // convert month to mm/dd format
  // convert time to hh:mm without am or pm
  m = m.split("/");
  if (m[0].length === 1) {
    m[0] = "0" + m[0];
  }
  if (m[1].length === 1) {
    m[1] = "0" + m[1];
  }
  t = t.split(" ");

  if (t[1] === "AM") {
    let hour = t[0].split(":");
    if (hour[0].length === 1) {
      hour[0] = "0" + hour[0];
    }
    t[0] = hour.join(":");
  } else {
    let hour = t[0].split(":");
    hour[0] = (parseInt(hour[0]) + 12).toString();
    t[0] = hour.join(":");
  }
  // 2018-05-11T20:00:00
  let fullTimeString =
    new Date().getFullYear() + "-" + m[0] + "-" + m[1] + " " + t[0] + ":00";
  return fullTimeString;
};

let archiveLounges = async () => {
  let idsToArchive = [];
  let lounges = await loungedb.selectLoungesForArchive();
  lounges = JSON.parse(JSON.stringify(lounges));
  _.each(lounges, function(lounge) {
    let fromNow = moment(lounge.end_time, "YYYY-MM-DD HH:mm:ss").fromNow();
    if (fromNow === "2 days ago") {
      idsToArchive.push(lounge.id);
    }
  });

  // update is_archived to 1 for all ids that are 2 days old
  if (idsToArchive.length) {
    let archive = await loungedb.archiveLounges(idsToArchive);
  }
};

module.exports.addNewLounges = addNewLounges;
module.exports.archiveLounges = archiveLounges;
module.exports.dateParser = dateParser;
