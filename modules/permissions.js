const fakedata = require('./fakedata.js')

const user = 0b100000
const admin = 0b111111
<<<<<<< HEAD
const role = [admin,user];

const control = {
 seeChan = 0b100000,
 deleteMessage = 0b010000,
 inviteUser = 0b001000,
 deleteUser = 0b000100,
 deleteRoom = 0b000010,
 changeRole = 0b000001
}

// USER
 
// récupére les droit
function getRightFromUser(user_id,room_id){
    role_id = fakedata.access.filter(acc => acc.id_user==user_id && acc.id_room == room_id)[0].id_role
    return(role[role_id])
=======
const role = [admin, user];

const control = {
  seeChan = 0b100000,
  deleteMessage = 0b010000,
  inviteUser = 0b001000,
  deleteUser = 0b000100,
  deleteRoom = 0b000010,
  changeRole = 0b000001
}

// USER

// récupére les droit
function getRightFromUser(user_id, room_id) {
  role_id = fakedata.access.filter(acc => acc.id_user == user_id && acc.id_room == room_id)[0].id_role
  return (role[role_id])
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
}

// récupère les id des rooms d'un user via son id 
var getUserRoomsId = function (user_id) {
<<<<<<< HEAD
  return fakedata.access.filter(acc => acc.id_user==user_id)?.map(elt => elt.id_room)
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
=======
  return fakedata.access.filter(acc => acc.id_user == user_id)?.map(elt => elt.id_room)
}

// get action
function getActionRight(user, room, action) {
  userRole = getRightFromUser(user, room)
  return ((userRole & action) == action)
}

module.exports = {
  getActionRight,
  getUserRoomsId,
  control
>>>>>>> 3f0340128d5efa0f008caaed0534a1680c69cbbe
}