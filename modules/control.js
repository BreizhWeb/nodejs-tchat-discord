const permission = require('./permissions');
const db = require('../db/db');
const cache = require('./cacheData');
const multirooms = require('./multirooms.js')
const logger = require('../log/logger')

async function createRoom(socket, data) {
  let room = await db.rooms.create(data.name, data.image, data.private);
  db.roles.create(room.room_id, socket.user.user_id, 0);
  await cache.add(socket.user.user_id, room.room_id, 0);
  multirooms.joinRooms(socket);
  logger.eventLogger.log('info', `${socket.user.pseudo} : Created room id:${room.room_id}, name:${room.name}, image:${room.image}, private:${room.private}`)
  return room;

  // il faut corriger la fonction

}

async function sendMessage(io, user, room_id, content) {
  if (permission.getActionRight(user.user_id, room_id, permission.actions.sendMessage)) {
    let msg_id = await db.messages.create(user.user_id, room_id, content)
    logger.eventLogger.log('info', `action:"send message", room_id:${room_id}, user_id:${user.user_id}, message_id:${msg_id}`)
    await io.to(`room-${room_id}`).emit('new message', {
      content: content,
      msg_id: msg_id,
      room_id: room_id,
      user: user
    })
    return true
  } else {
    return false
  }
}

function deleteMessage(io, user, room_id, msg_id) {
  if (permission.getActionRight(user.user_id, room_id, permission.actions.deleteMessage)) {
    logger.eventLogger.log('info', `action:"delete message", room_id:${room_id}, user_id:${user.user_id}, message_id:${msg_id}`)
    db.messages.deleteMsg(msg_id)
    io.to(`room-${room_id}`).emit('delete message', msg_id)
    return true
  } else {
    return false
  }
}

async function inviteUser(user_id, room_id, invited_user_id) {
  if (permission.getActionRight(user_id, room_id, permission.actions.inviteUser)) {
    db.roles.create(room_id, invited_user_id, 0);
    cache.add(invited_user_id, room_id, 0);
    // TODO emit update to specific user
  } else {
    return false
  }
}

async function deleteUser(user_id, room_id, deleted_user_id) {
  if (permission.getActionRight(user_id, room_id, permission.actions.deleteUser)) {
    db.roles.deleteUser(room_id, invited_user_id);
    cache.deleteUser(invited_user_id, room_id);
    // TODO find right socket to push :
    //socket.emit('delete room', room_id)
  } else {
    return false
  }
}

async function deleteRoom(io, user_id, room_id) {
  if (permission.getActionRight(user_id, room_id, permission.actions.deleteRoom)) {
    let room = await db.rooms.select(room_id)
    logger.eventLogger.log('info', `action: "delete room", room_id:${room.room_id}, name:"${room.name}", image:"${room.image}", private:${room.private}`)
    io.to(`room-${room_id}`).emit('delete room', room_id)
    db.roles.deleteByRoom(room_id);
    cache.deleteRoom(room_id);
    return true
  } else {
    return false
  }
}

async function changeRole(user_id, room_id) {
  if (permission.getActionRight(user, room, permission.actions.changeRole)) {
    // TODO
  } else {
    return false
  }
}


module.exports = {
  createRoom,
  sendMessage,
  deleteMessage,
  inviteUser,
  deleteUser,
  deleteRoom,
  changeRole,
}
