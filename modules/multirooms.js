const fakedata = require('./fakedata.js')
const db = require('../db/db.js')
/**
 * Boucle sur tous les chans de l'utilisateur
 * Rejoins les rooms de tous les chans
 * @param {object} user objet de l'utilisateur
 * @param {object} socket objet du socket utilisateur
 */
var joinRooms = function (user, socket) {
  getUserRooms(user.name).forEach(chan => {
    socket.join(`chan-${chan.id}`)
  })
}
/**
 * Trouve l'id des chans d'un utilisateur
 * @param {int} id Id de l'utilisateur
 * @returns array des id chans de l'utilisateurs
 */
var getUserRoomsId = function (id) {
  return fakedata.access.filter(acc => acc.id_user == id)?.map(elt => elt.id_room)
}
/**
 * Trouve l'utilisateur en bdd
 * Boucle sur les chans de l'utilisateur
 * @param {string} name Nom de l'utilisateur
 * @returns array des chans de l'utilisateurs
 */
var getUserRooms = function (name) {
  return getUserRoomsId(fakedata.users.find(v => v.name == name)?.id)?.map(r => fakedata.servers.find(s => s.id == r))
}
/**
 * Boucle sur tous les chans de l'utilisateur
 * Push la nouvelle liste des utilisateurs à chaque chan.
 * @param {object} user objet de l'utilisateur
 * @param {object} sockets objet des sockets
 */
var updateUsernames = function (user, sockets) {
  /*getUserRoomsId(user.id).forEach(chan => {
    
    var theChan = fakedata.servers.find(s => s.id == chan);
    if (theChan.users?.indexOf(user.name) == -1)
      theChan.users.push(user)
    sockets.to(`chan-${chan.id}`).emit(`usernames${theChan.id}`, theChan.users);
  })*/
}
/**
 * Boucle sur tous les chans de l'utilisateur
 * Push la nouvelle liste des utilisateurs à chaque chan.
 * @param {object} user objet de l'utilisateur
 * @param {object} sockets objet des sockets
 */
var disconnect = function (user, sockets) {
  getUserRoomsId(user.id).forEach(chan => {
    let theChan = fakedata.servers.find(s => s.name == chan.name);
    if (theChan.users.indexOf(user) != -1)
      theChan.users.splice(theChan.users.indexOf(user.name), 1);
    sockets.to(`chan-${chan.id}`).emit(`usernames${theChan.id}`, theChan.users);
  })
}
module.exports = {
  joinRooms: joinRooms,
  getUserRooms: getUserRooms,
  updateUsernames: updateUsernames,
  disconnect: disconnect
}
