/**
 * Réalisé par : Ronan, 
 */
const db = require('../db/db.js')
const control = require('./control')
const logger = require('../log/logger')
const permission = require('./permissions');
const cache = require('./cacheData');
/**
 * Boucle sur tous les rooms de l'utilisateur
 * Rejoins les rooms de tous les rooms
 * @param {object} socket objet du socket utilisateur
 */
var joinRooms = function (socket) {
  socket.user.rooms?.forEach(room => {
    if (room.room_id)
      socket.join(`room-${room.room_id}`)
  })
}

var listen = function (io, socket) {

  logger.eventLogger.log('info', "Socket connected...")

  socket.emit('connection')
  let users = []
  cache.set()


  /**
   * Debug pour Denis
   */
  /*socket.onAny((event, ...args) => {
    console.log(event, args);
  })*/

  // TODO : A refaire quand le login sera là
  socket.on("new user", async function (name, callback) {
    socket.user = await db.users.getUserData(name)
    // If user dont exist
    if (typeof socket.user != 'undefined') {
      logger.eventLogger.log('info', `connected : ${socket.user.pseudo}`)
      joinRooms(socket)
      callback(socket.user)

      // TODO ranger le merdier
      users = []
      for (let [id, socket] of io.of("/").sockets) {
        if (typeof socket.user != 'undefined')
          users.push({
            socket_id: id,
            user: socket.user,
          });
      }
      io.emit("users", users)
      console.log(users)
    } else {
      callback(false)
    }
  })

  socket.on("getRoom", async (room_id, callback) => {
    let room = await db.rooms.select(room_id);
    let listMessages = await db.messages.selectByIdRoom(room_id);
    callback(room, listMessages);
  })

  /**
   * Send Message
   */
  socket.on("sendMessage", async ({room_id, content}) => {
    let message_id = control.sendMessage(2, room_id, content)
    if(message_id){
      io.to(`messages`).emit('new message', {
        content: content,
        message_id: message_id,
        room_id: room_id,
        user: socket.user
      })
    }
  })

  /**
   * get Message
   */
  socket.on("get message", async (room_id, callback) => {
    if (permission.getActionRight(socket.user.user_id, room_id, permission.actions.sendMessage)) {
      let messages = await db.messages.selectByIdRoom(room_id)
      callback(messages)
    } else
      callback([])
  })

  /**
   * Delete message
   */
  socket.on("delete message", async ({room_id, message_id}) => {
    if(control.deleteMessage(2, room_id, message_id))
      io.to(`room-${room_id}`).emit("delete message", message_id)
  })

  /**
   * Create room
   */
  socket.on("create room", async ({ name, image, private }, callback) => {
    control.createRoom(socket, { name, image, private }).then((room) => {
      socket.user.rooms.push(room)
      joinRooms(socket)
      callback()
      socket.emit("update rooms", socket.user)
    })
  })

  /**
   * Create MP room
   */
  socket.on("create mp", async ({ name, image, private, target_user_id }, callback) => {
    room = cache.value.find(r => r.role_id == 5 && r.room_id == cache.value.find(t => t.role_id == 5 && t.user_id == target_user_id)?.room_id)
    if (typeof room === 'undefined') {
      control.createMp(socket, { name, image, private, target_user_id }).then((room) => {
        socket.user.rooms.push(room)
        joinRooms(socket)
        callback(true)
        socket.emit("update rooms", socket.user)
        let to = users.find(u => u.user.user_id == target_user_id)
        if (to)
          io.to(to.socket_id).emit("join room")
      })
    } else {
      callback(false)
    }
  })

  /**
   * Delete room
   */
  socket.on("delete room", async (room_id) => {
    if (await control.deleteRoom(socket.user.user_id, room_id))
      io.to(`room-${room_id}`).emit("delete room", room_id)
  })

  /**
   * Update rooms
   */
  socket.on("update rooms", async () => {
    db.users.getUserData(socket.user.user_id).then((user) => {
      socket.user = user
      joinRooms(socket)
      socket.emit("update rooms", socket.user)
    })
  })

  /**
   * Public rooms
   */
  socket.on("public rooms", async (callback) => {
    let publicrooms = await db.rooms.selectPublic();
    callback(publicrooms)
  })

  /**
   * Join room
   */
  socket.on("join room", async (room_id) => {
    if (await control.joinRoom(socket.user.user_id, room_id)) {
      db.users.getUserData(socket.user.user_id).then((user) => {
        socket.user = user
        joinRooms(socket)
        socket.emit("update rooms", socket.user)
      })
    }
  })

  /**
   * Invite user
   */
  socket.on("invite user", async ({ target_user_id, room_id }) => {
    if (control.inviteUser(socket.user.user_id, room_id, target_user_id)) {
      logger.eventLogger.log('info', `${socket.user.pseudo} : Invited user id:${target_user_id}, room id:${room_id}`)
      // Should be in control i guess...
      let to = users.find(u => u.user.user_id == target_user_id)
      if (to)
        io.to(to.socket_id).emit("join room")
    }
  })

  /**
   * Kick user
   */
  socket.on("delete user", async ({ room_id, deleted_user_id }) => {
    if (control.deleteUser(socket.user.user_id, room_id, deleted_user_id)) {
      logger.eventLogger.log('info', `${socket.user.pseudo} : Kicked user id:${deleted_user_id}, room id:${room_id}`)
      // TODO emit to room ?
      let to = users.find(u => u.user.user_id == deleted_user_id)
      if (to)
        io.to(to.socket_id).emit("update rooms")
    }
  })

  /**
   * Disconnect
   */
  socket.on("disconnect", function (data) {
    // TODO 
    if (!socket.user?.pseudo) {
      return;
    }
    logger.eventLogger.log('info', `disconnected : ${socket.user?.pseudo}`);
    //disconnect(socket.user, io.sockets)
  });
}

module.exports = {
  listen,
  joinRooms
}
