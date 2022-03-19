const {selectAll} = require("../db/db_roles");

var rooms_users;

async function set(){
  rooms_users = selectAll();
  console.log(await rooms_users);
}

function add (user_id, room_id, role_id){
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


function deleteUser (user_id, room_id){
  let deleted = rooms_users.filter(element => element.user_id != user_id || element.room_id != room_id );
  rooms_users =  deleted;
}

function deleteRoom(room_id){
  let deleted = rooms_users.filter(element => element.room_id != room_id);
  rooms_users =  deleted;
}

function listRoomUser(room_id){
  return rooms_users.filter(element => element.room_id === room_id);
}

module.exports = {
    rooms_users: rooms_users,
    set:set,
    add: add,
    update: update,
    deleteUser: deleteUser,
    deleteRoom: deleteRoom,
    listRoomUser: listRoomUser
}
