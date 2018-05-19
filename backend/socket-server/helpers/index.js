const axios = require("axios");
const redis = require("redis");
const client = require("../../redis-server/src/index.js").client;
const {
  selectTop50Messages
} = require("../../rest-server/src/db/models/messages/index");

module.exports = {
  // param loungeID needs to take in the form of "lounge:<lounge id int>"
  getListLength: (loungeID, cb) => {
    client.llen(loungeID, (err, result) => {
      err ? console.log("error: ", err) : cb(err, result);
    });
  },

  // param loungeID needs to take in the form of "lounge:<lounge id int>"
  renderRecent50: (loungeID, cb) => {
    console.log("in renderRecent50");
    client.lrange(loungeID, 0, -1, (err, result) => {
      err ? console.log("error: ", err) : cb(err, result);
    });
  },

  // param loungeID(int)
  checkAndStore: loungeID => {
    getListLength(`lounge:${loungeID}`, (err, result) => {
      if (result === 0) {
        selectTop50Messages(loungeID);
      }
    });
  }
};
