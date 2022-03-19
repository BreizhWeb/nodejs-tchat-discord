const permission = require('./permissions');
const db = require('../db/db');
const cache = require('./cacheData');
const multirooms = require('./multirooms.js')
const logger = require('../log/logger')

async function createRoom(socket, data) {
  let room = await db.rooms.create(data.name, data.image, data.private);
  db.roles.create(room.room_id, socket.user.user_id, 1);
  await cache.addToCache(socket.user.user_id, room.room_id, 1);
  socket.user.rooms.push(room);
  joinRooms(socket);
  return room;

  // il faut corriger la fonction

}
function sendMessage(io, user, room_id, content) {
  console.log(user, room_id, content);
  if (permission.getActionRight(user.user_id, room_id, permission.actions.sendMessage)) {
    let msg_id = db.messages.create(user.user_id, room_id, content)
    logger.eventLogger.log('info', `[${room_id}]${user.pseudo} : ${content}`)
    io.to(`room-${room_id}`).emit('new message', {
      msg: content,
      msg_id: msg_id,
      room_id: room_id,
      user: user
    })
    return true
  } else {
    return false
  }
}
async function deleteMessage() {
  if (permission.getActionRight(user.user_id, room_id, permission.actions.deleteMessage)) {

  }

}
async function inviteUser(user_id, room_id, invited_user_id) {
  if (getActionRight(user_id, room_id, permission.actions.inviteUser)) {
    db.roles.create(room_id, invited_user_id, 0);
    cache.add(invited_user_id, room_id, 0);
  }
}
async function deleteUser(user_id, room_id, deleted_user_id) {
  if (getActionRight(user_id, room_id, permission.actions.deleteUser)) {
    db.roles.deleteUser(room_id, invited_user_id);
    cache.deleteUser(invited_user_id, room_id);
  }
}

async function deleteRoom(user_id, room_id) {
  if (getActionRight(user_id, room_id, permission.actions.deleteRoom)) {
    db.roles.deleteRoom(room_id);
    cache.deleteRoom(room_id);
  }
}

async function changeRole(user_id, room_id) {
  if (getActionRight(user, room, permission.actions.changeRole)) {

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
