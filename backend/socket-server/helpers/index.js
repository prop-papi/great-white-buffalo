const redis = require("redis");
const redisClient = require("../../redis-server/src/index.js").client;

const getListLength = (loungeID, cb) => {
  redisClient.llen(loungeID, (err, result) => {
    if (err) {
      console.log("error: ", err);
    } else {
      cb(err, result);
    }
  });
};

module.exports.getListLength = getListLength;
