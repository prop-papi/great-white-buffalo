const axios = require("axios");
const redis = require("redis");
const redisClient = require("../../redis-server/src/index.js").client;

module.exports = {
  getListLength: (loungeID, cb) => {
    redisClient.llen(loungeID, (err, result) => {
      err ? console.log("error: ", err) : cb(err, result);
    });
  },

  renderRecent50: (loungeID, cb) => {
    redisClient.lrange(loungeID, 0, -1, (err, result) => {
      err ? console.log("error: ", err) : cb(err, result);
    });
  }
};
