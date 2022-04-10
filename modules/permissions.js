const nodeCache= require('./nodeCache');

const user = 0b100000
const admin = 0b111111
const mp = 0b101000
const role = [admin,user,null,null,null,mp];

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
  let role_id = await nodeCache.getUserRoleFromRoom(user_id,room_id);
  return (role_id ? role[role_id] : false);
}


// get action
function getActionRight(user_id, room_id, action) {
    if(user_id == 0 ){
      return(true);
    }else{
      userRole = getRightFromUser(user_id, room_id)
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
