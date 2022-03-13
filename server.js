require("dotenv").config();
const express = require("express");
const app = express();
server = require("http").createServer(app);
const io = require('socket.io')(server);
const multirooms = require('./modules/multirooms.js')
const logger = require('./log/logger.js')
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
  logger.eventLogger.log('info', "Socket connected...")
  io.emit('connection');
  try {
    socket.users = await db.users.getUsers()
  } catch (e) {
    console.log(e);
  }

  socket.on("userlist", (data, callback) => {
    callback(socket.users.map(u => u.user_id + ":" + u.pseudo));
  });

  socket.on("new user", async function (name, callback) {
    socket.user = await db.users.getUserData(name)
    // If user dont exist
    if (socket.user.user_id) {
      logger.eventLogger.log('info', `connected : ${socket.user.pseudo}`)
      multirooms.joinRooms(socket)
      console.log(socket.user);
      callback(socket.user)
    } else {
      callback(false)
    }
  })

  // Send Message
  socket.on("send message", (data, callback) => {
    console.log(data);
    logger.eventLogger.log('info', `[${data.chan}]${socket.user.pseudo} : ${data.msg}`)

    io.to(`chan-${data.chan}`).emit('new message', {
      msg: data.msg,
      room_id: data.chan,
      user: socket.user.pseudo
    }, callback(true))
  })

  // Create room
  socket.on("create room", async (data, callback) => {
    let room = await multirooms.createRoom(socket, data)
    logger.eventLogger.log('info', `${socket.user.pseudo} : Created room id:${room.room_id}, name:${room.name}, image:${room.image}, private:${room.private}`)
    callback(socket.user, room.room_id)
  })

  //Disconnect
  socket.on("disconnect", function (data) {
    if (!socket.user?.pseudo) {
      return;
    }
    logger.eventLogger.log('info', `disconnected : ${socket.user?.pseudo}`);
    multirooms.disconnect(socket.user, io.sockets)
  });
})

