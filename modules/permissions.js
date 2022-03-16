const cacheData = require('./cacheData.js')

const user = 0b100000
const admin = 0b111111
const role = [admin, user];

const control = {
  seeChan: 0b100000,
  deleteMessage: 0b010000,
  inviteUser: 0b001000,
  deleteUser: 0b000100,
  deleteRoom: 0b000010,
  changeRole: 0b000001
}

// USER

// récupére les droit
function getRightFromUser(user_id, room_id) {
  role_id = cacheData.rooms_usersCache.filter(acc => acc.user_id == user_id && acc.room_id == room_id)[0].role_id
  return (role[role_id])
}

// récupère les id des rooms d'un user via son id
var getUserRoomsId = function (user_id) {
  return cacheData.rooms_usersCache.filter(acc => acc.user_id==user_id)?.map(elt => elt.room_id)
}

// get action
function getActionRight(user, room, action) {
    userRole =  getRightFromUser(user,room)
    return ((userRole & action ) == action)
  }

module.exports = {
    getActionRight,
    getUserRoomsId,
    control
}
