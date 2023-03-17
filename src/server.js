const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public'));
});

io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('message', 'Welcome to ChowSupreme!');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
