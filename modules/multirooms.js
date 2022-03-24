const db = require('../db/db.js')
/**
 * Boucle sur tous les rooms de l'utilisateur
 * Rejoins les rooms de tous les rooms
 * @param {object} socket objet du socket utilisateur
 */
var joinRooms = function (socket) {
  console.log(socket.user.rooms);
  socket.user.rooms?.forEach(room => {
    if(room.room_id)
      socket.join(`room-${room.room_id}`)
  })
}
/**
 * Create a room
 * @param {object} socket socket
 * @param {object} data name image and private bool
 * @returns return the room object
 */
var createRoom = async function (socket, data) {
  let room = await db.rooms.create(data.name, data.image, data.private)
  db.roles.create(room.room_id, socket.user.user_id, 0)
  socket.user.rooms.push(room)
  joinRooms(socket)
  return room
}
/**
 * Boucle sur tous les rooms de l'utilisateur
 * Push la nouvelle liste des utilisateurs à chaque room.
 * @param {object} user objet de l'utilisateur
 * @param {object} sockets objet des sockets
 */
var updateUsernames = function (user, sockets) {
  /*user.rooms?.forEach(room => {
    var theChan = fakedata.servers.find(s => s.id == room); //TODO
    if (theChan.users?.indexOf(user.name) == -1)
      theChan.users.push(user)
    sockets.to(`room-${room.id}`).emit(`usernames${theChan.id}`, theChan.users);
  })*/
}
/**
 * Boucle sur tous les rooms de l'utilisateur
 * Push la nouvelle liste des utilisateurs à chaque room.
 * @param {object} user objet de l'utilisateur
 * @param {object} sockets objet des sockets
 */
var disconnect = function (user, sockets) {
  /*user.rooms?.forEach(room => {
    let theChan = fakedata.servers.find(s => s.name == room.name); //TODO
    if (theChan.users.indexOf(user) != -1)
      theChan.users.splice(theChan.users.indexOf(user.name), 1);
    sockets.to(`room-${room.id}`).emit(`usernames${theChan.id}`, theChan.users);
  })*/
}
module.exports = {
  joinRooms: joinRooms,
  createRoom: createRoom,
  updateUsernames: updateUsernames,
  disconnect: disconnect
}
