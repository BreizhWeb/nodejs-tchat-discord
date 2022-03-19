const cacheData = require('./cacheData.js')
const {rooms_users} = require('./cacheData.js')
const user = 0b100000
const admin = 0b111111
const role = [user,admin];

const actions = {
  sendMessage: 0b100000,
  deleteMessage: 0b010000,
  inviteUser: 0b001000,
  deleteUser: 0b000100,
  deleteRoom: 0b000010,
  changeRole: 0b000001
}


// USER

// récupére les droit
async function getRightFromUser(user_id, room_id) {
  room_user = rooms_users.filter(acc => acc.user_id == user_id && acc.room_id == room_id)
  return (room_user.length ? role[0].role_id : false);
}

// récupère les id des rooms d'un user via son id
function getUserRoomsId(user_id) {
  return cacheData.rooms_users.filter(acc => acc.user_id==user_id)
}

// get action
function getActionRight(user_id, room_id, action) {
    userRole =  getRightFromUser(user_id,room_id)
    return ((userRole & action ) == action)
  }

module.exports = {
  user,
  admin,
  role,
  actions,
  getRightFromUser,
  getUserRoomsId,
  getActionRight
}
