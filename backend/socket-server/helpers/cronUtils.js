const betsdb = require("../../rest-server/src/db/models/bets/index");
const moment = require("moment");
const _ = require("underscore");
const io = require("../src/index").notifications;

let updateActiveBetsAndEmit = async () => {
  let date = new Date();
  let idsToSetVoting = [];
  let betsToVoteOn = [];
  console.log("here", date);
  let activeBets = await betsdb.getActiveBets();
  let dateCompare = moment(date)
    .add(1, "m")
    .utc()
    .toDate();

  _.each(activeBets, function(bet) {
    bet["end_at"] < dateCompare
      ? (idsToSetVoting.push(bet["id"]), betsToVoteOn.push(bet))
      : null;
  });

  if (idsToSetVoting.length) {
    // this is where we update to 'voting' and emit some socket message
    await betsdb.updateToVotingBets(idsToSetVoting);
  }
};

let updatePendingBetsAndEmit = async () => {
  let date = new Date();
  let idsToSetExpired = [];
  let betsExpired = [];
  let pendingBets = await betsdb.getPendingBets();
  let dateCompare = moment(date)
    .add(1, "m")
    .utc()
    .toDate();

  _.each(pendingBets, function(bet) {
    bet["end_at"] < dateCompare
      ? (idsToSetExpired.push(bet["id"]), betsExpired.push(bet))
      : null;
  });

  if (idsToSetExpired.length) {
    // this is where we update to 'expired' and emit some socket message
    await betsdb.updateToExpiredBets(idsToSetExpired);
  }
};

module.exports.updateActiveBetsAndEmit = updateActiveBetsAndEmit;
module.exports.updatePendingBetsAndEmit = updatePendingBetsAndEmit;
