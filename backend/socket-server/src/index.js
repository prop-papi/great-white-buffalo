const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const redis = require("redis");
const redisClient = require("../../redis-server/src/index.js").client;
const { getListLength, renderRecent50 } = require("../helpers/index.js");

io.on("connection", socket => {
  socket.on("user.enter", msg => {
    socket.join(msg.currentLoungeID);
    renderRecent50(msg.currentLoungeID, (err, result) => {
      io.to(msg.currentLoungeID).emit(`user.enter.${msg.user}`, result);
    });
  });

  socket.on("message.send", msg => {
    io.to(msg.currentLoungeID).emit("message.send", msg);
    redisClient.lpush(msg.currentLoungeID, JSON.stringify(msg));
    getListLength(msg.currentLoungeID, (err, result) => {
      if (result > 50) {
        redisClient.rpop(msg.currentLoungeID);
      }
    });
  });

  // on user typing ...
  socket.on("message.typing", msg => {
    socket.broadcast.to(msg.currentLoungeID).emit("message.typing", msg);
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

io.listen(3000, err => {
  if (err) throw err;
  console.log("listening on PORT:3000");
});
