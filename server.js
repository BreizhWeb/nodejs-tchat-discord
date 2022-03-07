require("dotenv").config();
const express = require("express");
const app = express();
server = require("http").createServer(app);
const io = require('socket.io')(server);
const fakedata = require('./modules/fakedata.js')
const multirooms = require('./modules/multirooms.js')
const db = require('./db/db.js')



app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`le serveur écoute sur le port ${PORT}`);
});

io.sockets.on("connection", async (socket) => {
  console.log("Socket connected...")
  try { 
    socket.users = await db.getUsers()
  } catch (e) {
    console.log(e);
  }
  console.log(socket.users);

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
      //db.getIdByPseudo(name);
      //socket.user.chans = multirooms.getUserRooms(name)
      //console.log(socket.user);
      //multirooms.joinRooms(socket.user, socket)
      //multirooms.updateUsernames(socket.user, io.sockets) 
      //callback(socket.user);
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


})

