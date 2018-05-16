const express = require("express");
const router = express.Router();
const redisClient = require("../../../../redis-server/src/").client;

const columnNames = [
  "wins",
  "losses",
  "totalBets",
  "win_ratio",
  "available_balance"
];

const redisHelper = (columnNamesArray, cb) => {
  columnNamesArray.forEach((name, i) => {
    redisClient.get(name, (err, result) => {
      err ? console.log("error: ", err) : cb(err, result, name, i);
    });
  });
};

router.get("/", async (req, res) => {
  let leaderboardData = {};

  try {
    redisHelper(columnNames, (err, response, name, i) => {
      err
        ? console.log("error: ", err)
        : (leaderboardData[name] = JSON.parse(response));
      return i === 4 && res.status(200).send(leaderboardData);
    });

    // redisHelper("wins", (err, response) => {
    //   if (err) {
    //     console.log("error: ", err);
    //   } else {
    //     leaderboardData.wins = JSON.parse(response);
    //     redisHelper("losses", (err, response) => {
    //       if (err) {
    //         console.log("error: ", err);
    //       } else {
    //         leaderboardData.losses = JSON.parse(response);
    //         redisHelper("totalBets", (err, response) => {
    //           if (err) {
    //             console.log("error: ", err);
    //           } else {
    //             leaderboardData.losses = JSON.parse(response);
    //             redisHelper("win_ratio", (err, response) => {
    //               if (err) {
    //                 console.log("error: ", err);
    //               } else {
    //                 leaderboardData.winRatio = JSON.parse(response);
    //                 redisHelper("available_balance", (err, response) => {
    //                   if (err) {
    //                     console.log("error: ", err);
    //                   } else {
    //                     leaderboardData.availableBalance = JSON.parse(response);
    //                     return res.status(200).send(leaderboardData);
    //                   }
    //                 });
    //               }
    //             });
    //           }
    //         });
    //       }
    //     });
    //   }
    // });
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Error getting from redis");
    return err;
  }
});

module.exports = router;
