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
  io.emit('connection');
  try {
    socket.users = db.users.getUsers()
  } catch (e) {
    console.log(e);
  }

  socket.on("userlist", (data, callback) => {
    console.log("userlist");
    callback(fakedata.users.map(u => u.name));
  });

  socket.on("new user", async function (name, callback) {
    let userid = await db.users.getIdByPseudo(name)
    console.log(userid);
    socket.user = await db.users.getUserById(userid)
    console.log(socket.user);
    // If user dont exist
    if (!socket.user) {
      callback(false);
    } else {

      const test = (await db.roles.selectAllByUser(1))
      socket.user.chans = test;
      console.log(`connected : ${name}`,socket.user)
      callback(socket.user)
    }
  });
  // Send Message
  socket.on("send message", (data, callback) => {
    console.log(`[${data.chan}]${socket.user.pseudo} : ${data.msg}`);

    io.to(`chan-${data.chan}`).emit('new message', {
      msg: data.msg,
      chan: data.chan,
      user: socket.user.pseudo
    }, callback())
  })

  //Disconnect
  socket.on("disconnect", function (data) {
    if (!socket.user?.pseudo) {
      return;
    }
    console.log(`disconnected : ${socket.user?.pseudo}`);
    multirooms.disconnect(socket.user, io.sockets)
  });


})

