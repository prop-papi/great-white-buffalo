const redis = require("redis");

// create new client -- createClient(PORT, HOST)
// HOST defaults to 127.0.0.1
// PORT defaults to 6379
const client = redis.createClient();

// on connect
client.on("connect", () => {
  client.flushall();
  console.log("client cleaned");
  console.log("redis connected");
});

// on error
client.on("error", err => {
  console.log("error: ", err);
});

module.exports.client = client;
