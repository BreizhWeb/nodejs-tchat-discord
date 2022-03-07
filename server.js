require("dotenv").config();
const express = require("express");
const app = express();
server = require("http").createServer(app);
const io = require('socket.io')(server);
const fakedata = require('./modules/fakedata.js')
const multirooms = require('./modules/multirooms.js')
<<<<<<< HEAD
//const fs = require('fs');
=======
const db = require('./db/db.js')

>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe


app.use(express.static('public'))

app.get("/", (req, res) => {
<<<<<<< HEAD
  res.sendFile(__dirname + "/public/index.html");
=======
    res.sendFile(__dirname + "/public/index.html");
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
})

const PORT = process.env.PORT;
server.listen(PORT, () => {
<<<<<<< HEAD
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

=======
    console.log(`le serveur écoute sur le port ${PORT}`);
});

io.sockets.on("connection", (socket) => {
    console.log("Socket connected...")
    io.emit('connection');
    try {
        socket.users = db.users.getUsers()
    } catch (e) {
        console.log(e);
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
    }
  });
  // Send Message
  socket.on("send message", (data, callback) => {
    console.log(`[${data.chan}]${socket.user.name} : ${data.msg}`);
    
    io.sockets.to(`chan-${data.chan}`).emit('new message', {
      msg: data.msg,
      chan: data.chan,
      user: socket.user.name
    }, callback())
  });

<<<<<<< HEAD
  //Disconnect
  socket.on("disconnect", function (data) {
    if (!socket.user?.name) {
      return;
    }
    console.log(`disconnected : ${socket.user?.name}`);
    multirooms.disconnect(socket.user, io.sockets)
  });
=======
    socket.on("userlist", (data, callback) => {
        console.log("userlist");
        callback(fakedata.users.map(u => u.name));
    });

    socket.on("new user", function (name, callback) {
        socket.user = fakedata.users.find(v => v.name == name)
        // If user dont exist
        if (!socket.user) {
            callback(false);
        } else {
            console.log(`connected : ${name}`);
            callback(socket.user)
        }
    });
    // Send Message
    socket.on("send message", (data, callback) => {
        console.log(`[${data.chan}]${socket.user.name} : ${data.msg}`);

        io.to(`chan-${data.chan}`).emit('new message', {
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
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe


})

