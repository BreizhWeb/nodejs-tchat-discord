const {selectAll} = require("../db/db_roles");

async function set(){
   rooms_users.value = await selectAll();
}

async function add (user_id, room_id, role_id){
  await rooms_users.value.push({room_id:room_id,user_id:user_id,role_id:role_id});
}

async function update (user_id, room_id, role_id){
  rooms_users.value.find(element => element.user_id == user_id && element.room_id == room_id).role_id = await role_id;

}


async function deleteUser (user_id, room_id){
  rooms_users.value = await  rooms_users.value.filter(element => element.user_id != user_id || element.room_id != room_id );
}

async function deleteRoom(room_id){
   rooms_users.value = await rooms_users.value.filter(element => element.room_id != room_id);
}

function listRoomUser(room_id){
  return rooms_users.value.filter(element => element.room_id === room_id);
  // pas corrigé
}

var rooms_users = module.exports = {
    value: [],
    set: set,
    add:add,
    update:update,
    deleteUser:deleteUser,
    deleteRoom:deleteRoom,
    listRoomUser:listRoomUser
}

// TODO RAJOUTER LES COMMENTAIRES + VERIFICATION DES VARIABLES ( exemple tableau nul etc)
