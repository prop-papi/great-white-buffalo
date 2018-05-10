const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const redis = require("redis");
const redisClient = require("../../redis-server/src/index.js").client;
const getListLength = require("../helpers/index.js").getListLength;

// redis get length helper function

io.on("connection", socket => {
  socket.on("user.enter", msg => {
    console.log("user enter: ", msg);
    // redisClient.set("test", "test value", redis.print);
    // redisClient.get("test", (error, result) => {
    //   if (error) throw error;
    //   console.log("GET result: ", result);
    // });
    socket.join(msg.currentLoungeID);
  });

  // console.log('a user connected');

  socket.on("message.send", msg => {
    console.log("message: ", msg);
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
