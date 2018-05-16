require("dotenv").config();
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const _ = require("underscore");
const redis = require("redis");
const redisClient = require("../../redis-server/src/index.js").client;
const schedule = require("node-schedule");
const { getListLength, renderRecent50 } = require("../helpers/index.js");
const cronUtils = require("../helpers/cronUtils");

io.listen(3000, err => {
  if (err) throw err;
  console.log("listening on PORT:3000");
});

const usersOnline = {};

// chat namespace
const chat = io.of("/chat").on("connection", socket => {
  socket.on("user.enter", msg => {
    socket.join(`lounge:${msg.currentLoungeID}`);
    renderRecent50(`lounge:${msg.currentLoungeID}`, (err, result) => {
      chat
        .to(`lounge:${msg.currentLoungeID}`)
        .emit(`user.enter.${msg.user}`, result);
    });
  });

  socket.on("message.send", msg => {
    chat.to(`lounge:${msg.currentLoungeID}`).emit("message.send", msg);
    redisClient.lpush(`lounge:${msg.currentLoungeID}`, JSON.stringify(msg));
    getListLength(`lounge:${msg.currentLoungeID}`, (err, result) => {
      if (result > 50) {
        redisClient.rpop(`lounge:${msg.currentLoungeID}`);
      }
    });
  });

  // on user typing ...
  socket.on("message.typing", msg => {
    socket.broadcast
      .to(`lounge:${msg.currentLoungeID}`)
      .emit("message.typing", msg);
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
const notification = io.of("/notifications").on("connection", socket => {
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
const bets = io.of("/bets").on("connection", socket => {
  socket.on("user.enter", payload => {
    payload.clubList.forEach(c => {
      socket.join(c.id);
    });
  });

  socket.on("bet", packet => {
    console.log(packet);
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
    } else if (packet.action === "newLounge") {
      console.log("lounge was heard");
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
const activeUsers = io.of("/activeUsers").on("connection", socket => {
  socket.on("user.enter", user => {
    socket.join(user.online);
    usersOnline[user.username] = { id: user.id, socket_id: socket.id };
    activeUsers.to("online").emit("user.enter", usersOnline);
  });
  // disconnect
  socket.on("disconnect", socket => {
    for (val in usersOnline) {
      if (val.socket_id === socket.id) {
        delete usersOnline[val];
      }
    }
    console.log("Usersonline: ", usersOnline);
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

let cron1 = schedule.scheduleJob("30 * * * *", async function() {
  cronUtils.updateActiveBetsAndEmit();
  cronUtils.updatePendingBetsAndEmit();
});

let cron2 = schedule.scheduleJob("0 * * * *", async function() {
  cronUtils.updateActiveBetsAndEmit();
  cronUtils.updatePendingBetsAndEmit();
});

module.exports.io = io;
