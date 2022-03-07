const express = require("express");
const app = express();
server = require("http").createServer(app);
const io = require('socket.io')(server);
const fakedata = require('./modules/fakedata.js')
const multirooms = require('./modules/multirooms.js')
//const fs = require('fs');


app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

const PORT = 3000;
server.listen(PORT, () => {
  console.log('le serveur ecoute sur le port %d', PORT);
});

io.sockets.on("connection", (socket) => {
  console.log("Socket connected...");

  socket.on("userlist", (data, callback) => {
    console.log("userlist");
    callback(fakedata.users.map(u => u.name));
  });

  socket.on("new user", function (name, callback) {
    // If user dont exist
    if (!fakedata.users.find(v => v.name == name)) {
      callback(false);
    } else {
      console.log(`connected : ${name}`);
      
      socket.user = {
        name: name,
        chans: multirooms.getUserRooms(name)
      }

      multirooms.joinRooms(socket.user, socket)
      multirooms.updateUsernames(socket.user, io.sockets)
      callback(socket.user);

    }
  });
  // Send Message
  socket.on("send message", (data, callback) => {
    console.log(`[${data.chan}]${socket.user.name} : ${data.msg}`);
    
    socket.emit('new message', {
      msg: data.msg,
      chan: data.chan,
      user: socket.user.name
    }, callback())
  });

  //Disconnect
  socket.on("disconnect", function (data) {
    if (!socket.user?.name) {
      return;
    }
    console.log(`disconnected : ${socket.user?.name}`);
    multirooms.disconnect(socket.user, io.sockets)
  });


})

