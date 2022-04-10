/**
 * Réalisé par : Ronan,
 */
const db = require('../db/db.js')
const control = require('./control')
const logger = require('../log/logger')
const permission = require('./permissions');
const nodeCache = require('./nodeCache');
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

  /**
   * Send Message
   */
  socket.on("send message", async (msgdata, callback) => {
    callback(control.sendMessage(io, socket.user, msgdata.room_id, msgdata.content))
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
  socket.on("delete message", async (msgdata) => {
    control.deleteMessage(io, socket.user.user_id, msgdata.room_id, msgdata.msg_id)
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
   * fonctionné avec l'ancien cache 
   */
 /* socket.on("create mp", async ({ name, image, private, target_user_id }, callback) => {
    room = cache.value.find(r => r.role_id == 2 && r.room_id == cache.value.find(t => t.role_id == 2 && t.user_id == target_user_id)?.room_id)
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
  */
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
    nodeCache.getRoomsFromUser(socket.user.user_id).then((rooms) => {
      socket.user.rooms = rooms
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
    if (await control.joinRoom(socket.user.user_id, room_id, socket.user.pseudo)) {
      nodeCache.getRoomsFromUser(socket.user.user_id).then((rooms) => {
        socket.user.rooms = rooms
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
