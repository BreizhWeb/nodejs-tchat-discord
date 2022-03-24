require("dotenv").config();
const express = require("express");
const app = express();
server = require("http").createServer(app);
const io = require('socket.io')(server);
const permission = require('./modules/permissions');
const multirooms = require('./modules/multirooms')
const control = require('./modules/control')
const logger = require('./log/logger')
const db = require('./db/db')
const cache = require('./modules/cacheData');

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`le serveur écoute sur le port ${PORT}`);
});

cache.set()

const users = []
io.sockets.on("connection", async (socket) => {
  logger.eventLogger.log('info', "Socket connected...")
  socket.emit('connection')
  socket.on('test', () => {
    console.log(socket);
  })

  // TODO : A refaire quand le login sera là
  socket.on("new user", async function (name, callback) {
    socket.user = await db.users.getUserData(name)
    // If user dont exist
    if (socket.user.user_id) {
      logger.eventLogger.log('info', `connected : ${socket.user.pseudo}`)
      multirooms.joinRooms(socket)
      callback(socket.user)

      // TODO ranger le merdier
      for (let [id, socket] of io.of("/").sockets) {
        users.push({
          socket_id: id,
          user: socket.user,
        });
      }
      socket.emit("users", users)
      console.log(users)


    } else {
      callback(false)
    }
  })

  // Send Message
  socket.on("send message", async (msgdata, callback) => {
    callback(control.sendMessage(io, socket.user, msgdata.room_id, msgdata.content))
  })

  // Send private message
  socket.on("send private message", ({ user_id, content }, callback) => {
    // TODO finish + front
    let to = users.find(u => u.user.user_id == user_id)
    if (to)
      socket.to(to.socket_id).emit("private message", {
        content,
        from: socket.id,
      })
    else
      callback(false)
  })

  // get Message
  socket.on("get message", async (room_id, callback) => {
    if (permission.getActionRight(socket.user.user_id, room_id, permission.actions.sendMessage)) {
      let messages = await db.messages.selectByIdRoom(room_id)
      callback(messages)
    } else
      callback([])
  })

  // Delete message
  socket.on("delete message", async (msgdata) => {
    control.deleteMessage(io, socket.user.user_id, msgdata.room_id, msgdata.msg_id)
  })

  // Create room
  socket.on("create room", async (data, callback) => {
    let room
    console.log("create room:",data);
    if (data.mp) {
      room = cache.value.find(r => r.role_id == 5 && r.room_id == cache.value.find(t => t.role_id == 5 && t.user_id == data.mp)?.room_id)
      if (typeof room === 'undefined') {
        console.log("create");
        room = await control.createMp(socket, data)
        socket.to(`room-${room.room_id}`).emit("update rooms", await db.users.getUserData(data.mp))
        callback(socket.user, room.room_id)
      } else {
        callback(false)
      }
    } else {
      room = await control.createRoom(socket, data)
      callback(socket.user, room.room_id)
    }
  })

  // Delete room
  socket.on("delete room", async (room_id) => {
    control.deleteRoom(io, socket.user.user_id, room_id)
  })

  // Invite user
  socket.on("invite user", async (data, callback) => {
    // TODO FRONT
    if (control.inviteUser(socket.user.user_id, data.room_id, data.target_user_id)) {
      logger.eventLogger.log('info', `${socket.user.pseudo} : Invited user id:${data.user_id}, room id:${data.room_id}`)
      // Should be in control i guess...
      let to = users.find(u => u.user.user_id == data.user_id)
      if (to)
        socket.to(to.socket_id).emit("update rooms")
      // TODO create event update rooms on front to ask server for new rooms
      callback(socket.user, room.room_id) // ???
    } else
      callback(false)
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
    // TODO 
    if (!socket.user?.pseudo) {
      return;
    }
    logger.eventLogger.log('info', `disconnected : ${socket.user?.pseudo}`);
    multirooms.disconnect(socket.user, io.sockets)
  });
})

