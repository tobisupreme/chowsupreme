const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
let messages = document.getElementById('messages');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('welcome', (...msg) => {
  messages = document.createElement('ul');
  for (ms of msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
  }

});

socket.on('incoming', (msg) => {
  console.log('🚀 ~ file: main.js:15 ~ msg:', msg);
  for (e of msg) {
    console.log(e);
  }
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('messages', (msg) => {
  console.log('🚀 ~ file: main.js:23 ~ msg:', msg);
  console.log('🚀 ~ file: main.js:15 ~ event: messages');
  for (e of msg) {
    const item = document.createElement('li');
    item.textContent = e;
    messages.appendChild(item);
  }
  // messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('chat message', () => {});
