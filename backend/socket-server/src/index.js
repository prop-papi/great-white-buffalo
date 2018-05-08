const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', socket => {
  socket.on('user.enter', msg => {
    console.log(msg.user, 'entered');
  });

  // console.log('a user connected');

  socket.on('message.send', msg => {
    console.log('message: ', msg);
    io.emit('message.send', msg);
  });

  socket.on('test', color => {
    io.emit('test', color);
  });

  // disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // error handling
  socket.on('error', err => {
    console.log('received error: ', err);
  });
});

io.listen(3000, err => {
  if (err) throw err;
  console.log('listening on PORT:3000');
});
