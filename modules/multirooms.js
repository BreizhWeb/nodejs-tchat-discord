const fakedata = require('./fakedata.js')
/**
 * Boucle sur tous les chans de l'utilisateur
 * Rejoins les rooms de tous les chans
 * @param {object} user objet de l'utilisateur
 * @param {object} socket objet du socket utilisateur
 */
var joinRooms = function (user, socket) {
<<<<<<< HEAD
  getUserRoomsId(user.id).forEach(chan => {
=======
  getUserRooms(user.name).forEach(chan => {
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
    socket.join(`chan-${chan.id}`)
  })
}
/**
 * Trouve l'id des chans d'un utilisateur
 * @param {int} id Id de l'utilisateur
 * @returns array des id chans de l'utilisateurs
 */
var getUserRoomsId = function (id) {
<<<<<<< HEAD
  return fakedata.access.filter(acc => acc.id_user==id)?.map(elt => elt.id_room)
=======
  return fakedata.access.filter(acc => acc.id_user == id)?.map(elt => elt.id_room)
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
}
/**
 * Trouve l'utilisateur en bdd
 * Boucle sur les chans de l'utilisateur
 * @param {string} name Nom de l'utilisateur
 * @returns array des chans de l'utilisateurs
 */
var getUserRooms = function (name) {
<<<<<<< HEAD
  return getUserRoomsId(fakedata.users.find(v => v.name == name)?.id)?.map(r=> fakedata.servers.find(s=>s.id==r))
=======
  return getUserRoomsId(fakedata.users.find(v => v.name == name)?.id)?.map(r => fakedata.servers.find(s => s.id == r))
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
}
/**
 * Boucle sur tous les chans de l'utilisateur
 * Push la nouvelle liste des utilisateurs à chaque chan.
 * @param {object} user objet de l'utilisateur
 * @param {object} sockets objet des sockets
 */
var updateUsernames = function (user, sockets) {
  getUserRoomsId(user.id).forEach(chan => {
<<<<<<< HEAD
    var theChan = fakedata.servers.find(s => s.id == chan.id);
    if (theChan.users.indexOf(user.name) == -1)
      theChan.users.push(user.name)
=======
    var theChan = fakedata.servers.find(s => s.id == chan);
    if (theChan.users?.indexOf(user.name) == -1)
      theChan.users.push(user)
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
    sockets.to(`chan-${chan.id}`).emit(`usernames${theChan.id}`, theChan.users);
  })
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
<<<<<<< HEAD
    if (theChan.users.indexOf(user.name) != -1)
=======
    if (theChan.users.indexOf(user) != -1)
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
      theChan.users.splice(theChan.users.indexOf(user.name), 1);
    sockets.to(`chan-${chan.id}`).emit(`usernames${theChan.id}`, theChan.users);
  })
}
module.exports = {
<<<<<<< HEAD
  joinRooms:joinRooms,
=======
  joinRooms: joinRooms,
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
  getUserRooms: getUserRooms,
  updateUsernames: updateUsernames,
  disconnect: disconnect
}
