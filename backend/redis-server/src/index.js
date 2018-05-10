const redis = require('redis');

// create new client -- createClient(PORT, HOST)
// HOST defaults to 127.0.0.1
// PORT defaults to 6379
const client = redis.createClient();

client.on('connect', () => {
  console.log('redis server connected!');
});
