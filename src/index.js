require('dotenv').config();
const express = require('express');
const eSession = require('express-session');
const mongoStore = require('connect-mongo');
const sharedsession = require('express-socket.io-session');
const http = require('http');
const path = require('path');

// Set up express app and server
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Set up session middleware
const mongoUrl = process.env.DATABASE_URL;
const store = new mongoStore({ mongoUrl });
const session = eSession({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store,
});

// Use session middleware
app.use(session);
io.use(sharedsession(session, { autoSave: true }));

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// message history
const messageStore = ['Welcome to ChowSupreme!'];

io.on('connection', (socket) => {
  // Get session ID
  const clientId = socket.handshake.session.id;

  // Join the session room
  socket.join(clientId);

  // Emit the array of messages to the new user
  io.to(clientId).emit('welcome', messageStore);

  // listen for chat message
  socket.on('chat message', (msg) => {
    // Add the message to the array
    messageStore.push(msg);

    // Broadcast the message to all clients in the room
    io.to(clientId).emit('incoming', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
