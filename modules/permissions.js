const fakedata = require('./fakedata.js')

const user             = 1000
const admin            = 1111
const role = [admin,user];

const seeChan          = 1000
const deleteMessage    = 0100
const inviteUser       = 0010
const deleteUser       = 0001

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
    return (userRole&action == action)
  }

module.exports = { 
    getActionRight,
    getUserRoomsId
}