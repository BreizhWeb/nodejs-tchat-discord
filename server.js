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
    callback(fakedata.users.map(u => u.name));
  });

  //round 2
  socket.on("new user", function (name, callback) {
    // If user dont exist
    if (!fakedata.users.find(v => v.name == name)) {
      callback(false);
    } else {
      console.log(`${name} connected`);
      socket.user = {
        name: name,
        chans: multirooms.getUserRooms(name)
      };
      callback(socket.user);
      multirooms.updateUsernames(socket.user, io.sockets)

    }
  });
  // Send Message
  socket.on("send message", (data, callback) => {
    //round 2 add username
    io.sockets.emit('new message', {
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
    console.log(`${socket.user?.name} disconnected`);
    multirooms.disconnect(socket.user, io.sockets)
  });


})

