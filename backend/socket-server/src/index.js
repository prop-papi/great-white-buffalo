require("dotenv").config();
const app = require("express")();
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const _ = require("underscore");
const betsdb = require("../../rest-server/src/db/models/bets/index");
const moment = require("moment");
const redis = require("redis");
const redisClient = require("../../redis-server/src/index.js").client;
const schedule = require("node-schedule");
const { getListLength, renderRecent50 } = require("../helpers/index.js");
const axios = require("axios");
const configs = require("../../../config.js");

// const corsOptions = {
//   origin: 'https://gwbuff.com',
//   credentials: true,
// };

app.use(cors());

server.listen(3000, err => {
  if (err) console.log(err);
  console.log("listening on PORT: 3000");
});

const usersOnline = {};

// chat namespace
const chat = io.of("/chatSocket").on("connection", socket => {
  socket.on("user.enter", async msg => {
    console.log(`${msg.user} entered lounge: ${msg.currentLoungeID}`);

    socket.join(`lounge:${msg.currentLoungeID}`);

    await getListLength(`lounge:${msg.currentLoungeID}`, (err, result) => {
      if (result === 0) {
        axios
          .get(`${configs.HOST2}api/message/get/${msg.currentLoungeID}`)
          .then(res => {
            console.log("res: ", res.data);
            res.data.forEach(message => {
              redisClient.rpush(
                `lounge:${msg.currentLoungeID}`,
                JSON.stringify(message)
              );
            });
          })
          .catch(err => {
            console.log("server get error: ", err);
          });
      }
    });

    renderRecent50(`lounge:${msg.currentLoungeID}`, (err, result) => {
      chat
        .to(`lounge:${msg.currentLoungeID}`)
        .emit(`user.enter.${msg.user}`, result);
    });
  });

  socket.on("message.send", msg => {
    chat.to(`lounge:${msg.currentLoungeID}`).emit("message.send", msg);
    redisClient.rpush(`lounge:${msg.currentLoungeID}`, JSON.stringify(msg));
    getListLength(`lounge:${msg.currentLoungeID}`, (err, result) => {
      if (result > 50) {
        redisClient.lpop(`lounge:${msg.currentLoungeID}`);
      }
    });
  });

  // on user typing ...
  socket.on("message.typing", msg => {
    socket.broadcast
      .to(`lounge:${msg.currentLoungeID}`)
      .emit("message.typing", msg);
  });

  socket.on("user.leave", payload => {
    console.log("event: user.leave");
    socket.leave(`lounge:${payload.previousLoungeID}`);
    chat.emit(`${payload.user}.leave`);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // error handling
  socket.on("error", err => {
    console.log("received error: ", err);
  });
});

// notification namespace
const notifications = io.of("/notificationsSocket").on("connection", socket => {
  socket.on("fr-accepted", payload => {
    notifications.emit(`newFriend-${payload.friend}`, payload.user);
  });

  socket.on("fr-declined", payload => {
    notifications.emit(`noNewFriends-${payload.friend}`, payload.user);
  });

  socket.on("new-request", payload => {
    notifications.emit(`incoming-request-${payload.friend}`, payload.user);
  });

  socket.on("bet-accepted", payload => {
    notifications.emit(`betAccepted-${payload.creator}`, payload);
  });

  socket.on("bet-resolved", payload => {
    notifications.emit(`betWon-${payload.winner}`, payload);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // error handling
  socket.on("error", err => {
    console.log("received error: ", err);
  });
});

// bet namespace
const bets = io.of("/betsSocket").on("connection", socket => {
  socket.on("user.enter", payload => {
    payload.clubList.forEach(c => {
      socket.join(c.id);
    });
  });

  socket.on("bet", packet => {
    if (packet.action === "create") {
      socket.broadcast.to(packet.bet.club).emit("bet.create", packet.bet);
    } else if (packet.action === "cancel") {
      socket.broadcast.to(packet.bet.club).emit("bet.cancel", packet.bet);
    } else if (packet.action === "accept") {
      socket.broadcast
        .to(packet.bet.club)
        .emit("bet.accept", packet.bet, packet.acceptorId);
    } else if (packet.action === "vote") {
      socket.broadcast
        .to(packet.bet.club)
        .emit(
          "bet.vote",
          packet.bet,
          packet.voterId,
          packet.vote,
          packet.myVote
        );
    } else if (packet.action === "externalResolved") {
      bets
        .to(packet.bet.club)
        .emit("bet.externalResolved", packet.bet, packet.vote);
    } else if (packet.action === "newLounge") {
      socket.broadcast
        .to(packet.lounge.club)
        .emit("lounge.create", packet.lounge);
    }
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // error handling
  socket.on("error", err => {
    console.log("received error: ", err);
  });
});

// active users namespace
const activeUsers = io.of("/activeUsersSocket").on("connection", socket => {
  socket.on("user.enter", user => {
    socket.join(user.online);
    usersOnline[user.username] = { id: user.id, socket_id: socket.id };
    activeUsers.to("online").emit("user.enter", usersOnline);
  });
  // disconnect
  socket.on("disconnect", () => {
    for (let val in usersOnline) {
      if (usersOnline[val].socket_id === socket.id) {
        delete usersOnline[val];
      }
    }
    activeUsers.to("online").emit("user.leave", usersOnline);
  });

  // error handling
  socket.on("error", err => {
    console.log("received error: ", err);
  });
});

// friend status namespace
const friendOnline = io.of("/friendOnline").on("connection", socket => {
  // disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // error handling
  socket.on("error", err => {
    console.log("received error: ", err);
  });
});

// cron functions and scheduling
let updateActiveBetsAndEmit = async () => {
  let date = new Date();
  let idsToSetVoting = [];
  let betsToVoteOn = [];
  let activeBets = await betsdb.getActiveBets();
  let dateCompare = moment(date)
    .add(1, "m")
    .utc()
    .add(new Date().getTimezoneOffset(), "minutes")
    .toDate();

  _.each(activeBets, function(bet) {
    bet["end_at"] < dateCompare
      ? (idsToSetVoting.push(bet["id"]), betsToVoteOn.push(bet))
      : null;
  });

  if (idsToSetVoting.length) {
    // this is where we update to 'voting' and emit some socket message
    await betsdb.updateToVotingBets(idsToSetVoting);
    _.each(betsToVoteOn, function(bet) {
      // this is the entire bet object
      notifications.emit(
        `betVoting-${bet.creator_name}`,
        {
          challenger: bet.challenger_name,
          bet: bet.description,
          club: bet.club_name
        },
        bet
      );
      notifications.emit(
        `betVoting-${bet.challenger_name}`,
        {
          challenger: bet.creator_name,
          bet: bet.description,
          club: bet.club_name
        },
        bet
      );
    });
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
    .add(new Date().getTimezoneOffset(), "minutes")
    .toDate();

  _.each(pendingBets, function(bet) {
    bet["expires"] < dateCompare
      ? (idsToSetExpired.push(bet["id"]), betsExpired.push(bet))
      : null;
  });

  if (idsToSetExpired.length) {
    await betsdb.updateToExpiredBets(idsToSetExpired);
    console.log(`Bet id(s): ${idsToSetExpired} have expired.`);
  }
  if (betsExpired.length) {
    betsExpired.forEach(bet => {
      bets.to(bet.club).emit("bet.expired", bet);
    });
  }
};

let cron1 = schedule.scheduleJob("30 * * * *", async function() {
  updateActiveBetsAndEmit();
  updatePendingBetsAndEmit();
});

let cron2 = schedule.scheduleJob("0 * * * *", async function() {
  updateActiveBetsAndEmit();
  updatePendingBetsAndEmit();
});
