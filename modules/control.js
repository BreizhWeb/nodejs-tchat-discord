/**
 * Réalisé par : Ronan, Julien
 * Groupe 2, module Role User
 */
const nodeCache= require('./nodeCache');
const permission = require('./permissions');
const db = require('../db/db');
const multirooms = require('./multirooms.js')
const logger = require('../log/logger');
const { io } = require('socket.io-client');


/**
 * Crée un message avec le nom de l'utilsateur et une image
 * @param {object} socket
 * @param {object} data
 * @returns {int}
 */
async function createMp(socket, data) {
  let room = await db.rooms.create(data.name + "-" + socket.user.pseudo, data.image, data.private)
  db.roles.create(room.room_id, socket.user.user_id, 2)
  await nodeCache.add(socket.user.user_id,socket.user.pseudo,room.room_id,room.name,room.private,2)


  logger.eventLogger.log('info', `"action":"create mp room", "room_id":${room.room_id}, "user_id":${socket.user.user_id}`)
  inviteUser(socket.user.user_id, room.room_id, data.target_user_id, 2)
  return room
}

/**
 * Crée la room private ou non entre différents utilisateurs
 * @param {object} socket
 * @param {object} data
 * @returns {int}
 */
async function createRoom(socket, data) {
  let room = await db.rooms.create(data.name, data.image, data.private)
  db.roles.create(room.room_id, socket.user.user_id, 0)
  await nodeCache.add(socket.user.user_id,socket.user.pseudo,room.room_id,room.name,room.private,0)
  logger.eventLogger.log('info', `"action":"create room", "room_id":${room.room_id}, "user_id":${socket.user.user_id}`)
  return room
}

/**
 * Envoie de message dans une room
 * @param {object} io
 * @param {int} user
 * @param {int} room_id
 * @param {string} content
 * @returns {boolean}
 */
async function sendMessage(io, user, room_id, content) {
  if (permission.getActionRight(user.user_id, room_id, permission.actions.sendMessage)) {
    let msg_id = await db.messages.create(user.user_id, room_id, content)
    logger.eventLogger.log('info', `"action":"send message", "room_id":${room_id}, "user_id":${user.user_id}, "message_id":${msg_id}`)
    io.to(`room-${room_id}`).emit('new message', {
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

/**
 * Supprimer un message d'un utilisateur dans une room par quelqu'un d'autorisé
 * @param {object} io
 * @param {int} user_id
 * @param {int} room_id
 * @param {int} msg_id
 * @returns {boolean}
 */
async function deleteMessage(io, user_id, room_id, msg_id) {
  if (permission.getActionRight(user_id, room_id, permission.actions.deleteMessage)) {
    // récupération de l'id du message qui va être supprimer
    db.messages.deleteMsg(msg_id);
    io.to(`room-${room_id}`).emit("delete message", msg_id)
    return true
  } else if (user_id == (await db.messages.selectById(msg_id))?.user_id) {
    db.messages.deleteMsg(msg_id);
    io.to(`room-${room_id}`).emit("delete message", msg_id)
    return true
  } else {
    return false
  }
}

/**
 * Rejoindre une room et actualise le pseudo sur le front
 * @param {int} user_id
 * @param {int} room_id
 * @param {string} pseudo
 * @returns {boolean}
 */
async function joinRoom(user_id, room_id , pseudo) { // rajouté le pseudo dans le front
  let room = await db.rooms.select(room_id)
  if (!room.private) {
    db.roles.create(room_id, user_id, 1);
    await nodeCache.add(user_id,pseudo,room.room_id,room.name,room.private,1)
    return true
  } else {
    return false
  }
}

/**
 * Invite un utilisateur à cette room par un utilisateur agréé à le faire
 * @param {int} user_id
 * @param {int} room_id
 * @param {int} invited_user_id
 * @param {int} invited_user_role=1
 * @returns {boolean}
 */
function inviteUser(user_id, room_id, invited_user_id, invited_user_role = 1) { //
  if (nodeCache.userAlreadyInRoom(room_id,invited_user_id))
    return false
  if (permission.getActionRight(user_id, room_id, permission.actions.inviteUser)) {
    db.roles.create(room_id, invited_user_id, invited_user_role);
    pseudo = db.users.getUserData().pseudo;
    room=nodeCache.getRoomInfo(room_id);
    nodeCache.add(invited_user_id, pseudo, room_id, room.name, room.private, invited_user_role);
    return true
  } else {
    return false
  }
}

/**
 * Supprimer un utilisateur de la room
 * @param {id} user_id
 * @param {id} room_id
 * @param {id} deleted_user_id
 * @returns {boolean}
 */
function deleteUser(user_id, room_id, deleted_user_id) {
  if (permission.getActionRight(user_id, room_id, permission.actions.deleteUser)) {
    db.roles.deleteUserFromRoom(deleted_user_id, room_id);
    nodeCache.deleteUserFromRoom(deleted_user_id,room_id)
    return true
  }
  else {
    return false
  }
}

/**
 * Supprime une room
 * @param {int} user_id
 * @param {int} room_id
 * @returns {boolean}
 */
async function deleteRoom(user_id, room_id) {
  if (permission.getActionRight(user_id, room_id, permission.actions.deleteRoom)) {
    db.roles.deleteByRoom(room_id);
    await nodeCache.deleteRoom(room_id);
    return true
  }
  else {
    return false
  }
}


module.exports = {
  createRoom,
  createMp,
  sendMessage,
  deleteMessage,
  inviteUser,
  joinRoom,
  deleteUser,
  deleteRoom
}
