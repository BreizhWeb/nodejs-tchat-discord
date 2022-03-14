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

  // Get all public rooms
  socket.on("public rooms", async (data, callback) => {
    console.log("publicrooms",data);
    let rooms = await db.rooms.selectPublic();
    console.log(rooms);
    callback(rooms)
  });

  // Send Message
  socket.on("send message", (data, callback) => {
    logger.eventLogger.log('info', `[${data.chan}]${socket.user.pseudo} : ${data.msg}`)
    //TODO Role send message

    io.to(`chan-${data.chan}`).emit('new message', {
      msg: data.msg,
      room_id: data.chan,
      user: socket.user.pseudo
    }, callback(true))
  })

  // Delete message
  socket.on("delete message", async (data, callback) => {
    logger.eventLogger.log('info', `delete message [${data.chan}]${socket.user.pseudo} : ${data.msg}`)
    //TODO Role delete message
    
    io.to(`chan-${data.chan}`).emit('delete message', {
      msg: data.msg,
      room_id: data.chan
    }, callback(true))
  })

  // Create room
  socket.on("create room", async (data, callback) => {
    // TODO Role create room
    let room = await multirooms.createRoom(socket, data)
    logger.eventLogger.log('info', `${socket.user.pseudo} : Created room id:${room.room_id}, name:${room.name}, image:${room.image}, private:${room.private}`)
    callback(socket.user, room.room_id)
  })

  // Delete room
  socket.on("delete room", async (data, callback) => {
    let room = db.rooms.select(data.room_id)
    // TODO Role delete room
    logger.eventLogger.log('info', `${socket.user.pseudo} : deleted room id:${room.room_id}, name:${room.name}, image:${room.image}, private:${room.private}`)
    
    io.to(`chan-${data.room_id}`).emit('delete room', {
      room_id: data.room_id
    }, callback(true))
  })

  // Invite user
  socket.on("invite user", async (data, callback) => {
    // TODO Role invite user
    logger.eventLogger.log('info', `${socket.user.pseudo} : Invited user id:${data.user_id}, room id:${data.room_id}`)
    // TODO emit to user new room
    callback(socket.user, room.room_id) // ???
  })

  // Kick user
  socket.on("Kick user", async (data, callback) => {
    // TODO Role Kick user
    logger.eventLogger.log('info', `${socket.user.pseudo} : Kicked user id:${data.user_id}, room id:${data.room_id}`)
    // TODO emit to user new room
    callback(socket.user, room.room_id) // ???
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

