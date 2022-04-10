// Groupe 2, module Role User

const nodeCache= require('./nodeCache');

// Un user peut seulement envoyer un message
const user = 0b100000
// Un admin peut tout faire
const admin = 0b111111
// Role des gens qui sont dans une room de message
const mp = 0b101000
// tableaux des rôles
const role = [admin,user,mp];
// object des actions avec chaque action est encodée sur un bit différent
const actions = {
  sendMessage: 0b100000,
  deleteMessage: 0b010000,
  inviteUser: 0b001000,
  deleteUser: 0b000100,
  deleteRoom: 0b000010,
  changeRole: 0b000001
}

// USER

/**
 * récupére les droit de l'utilisateur sur la room
 * @param {int} user_id
 * @param {int} room_id
 * @returns {boolean}
 */
async function getRightFromUser(user_id, room_id) {
  let role_id = await nodeCache.getUserRoleFromRoom(user_id,room_id);
  return (role_id ? role[role_id] : false);
}



/**
 * Renvoie si l'utilisateur a le droit de faire cette action
 * @param {int} user_id
 * @param {int} room_id
 * @param {binary} action
 * @returns {boolean}
 */
function getActionRight(user_id, room_id, action) {
    // admin qui ont toujours le droit
    if(user_id == 0 ){
      return(true);
    }else{
      userRole = getRightFromUser(user_id, room_id)
      // compare deux binaire pour savoir s'il est autoriser
      return ((userRole & action ) == action)
    }
  }

module.exports = {
  user,
  admin,
  role,
  actions,
  getRightFromUser,
  getActionRight
}
