const fakedata = require('./fakedata.js')

const user = 10000
const admin = 11111
const role = [admin,user];

const seeChan = 10000
const deleteMessage = 01000
const inviteUser = 00100
const deleteUser = 00010
const deleteRoom = 00001

// USER
 
// récupére les droit
function getRightFromUser(user_id,room_id){
    role_id = fakedata.access.filter(acc => acc.id_user==user_id && acc.id_room == room_id)[0].id_role
    return(role[role_id])
}

// récupère les id des rooms d'un user via son id 
var getUserRoomsId = function (user_id) {
  return fakedata.access.filter(acc => acc.id_user==user_id)?.map(elt => elt.id_room)
}

// get action
function getActionRight(user, room, action) {  
    userRole =  getRightFromUser(user,room)
    return (userRole && action == action)
  }

module.exports = { 
    getActionRight,
    getUserRoomsId
}