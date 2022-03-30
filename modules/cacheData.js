const {selectAll} = require("../db/db_roles");

var rooms_users;

async function set(){
  rooms_users = selectAll();
  console.log(await rooms_users);
}

function addTo (user_id, room_id, role_id){
  let added = rooms_users.push({user_id:user_id,room_id:room_id,role_id:role_id})
  rooms_users = added ;
}

function update (user_id, room_id, role_id){
  let updated =rooms_users.find(element => element.user_id == user_id && element.room_id == room_id)
  if (typeof search === 'undefined') {
    updated.role_id = role_id;
  }
  rooms_users = updated;
}


function deleteUserFrom (user_id, room_id, role_id){
  let deleted = rooms_users.filter(element => element.user_id != user_id || element.room_id != room_id || element.role_id != role_id);
  rooms_users =  deleted;
}

function deleteRoomFrom (room_id){
  let deleted = rooms_users.filter(element => element.room_id != room_id);
  rooms_users =  deleted;
}

function listRoomUserFrom(room_id){
  return rooms_users.filter(element => element.room_id === room_id);
}

module.exports = {
    rooms_users: rooms_users,
    set:set,
    addTo: addTo,
    update: update,
    deleteUserFrom: deleteUserFrom,
    deleteRoomFrom: deleteRoomFrom,
    listRoomUserFrom: listRoomUserFrom
}
