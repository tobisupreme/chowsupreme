const socket = io();

socket.on('message', (mesg) => {
  console.log(mesg);
});
