const NodeCache = require( "node-cache" );
const { selectAllWithJoin } = require("../db/db_roles");
const data = new NodeCache();


async function set(){
  let dataDB = await selectAllWithJoin();
  dataDB.forEach(function(element) {
    add(element.user_id,element.pseudo,element.room_id,element.name,element.private,element.role_id);
  });
}

async function add(user_id,pseudo,room_id,name,private,role_id){
  let key = await user_id.toString() + '/' + room_id.toString() + '/' + role_id.toString() ;
  let value = {user_id:user_id,pseudo:pseudo,room_id:room_id,name:name,private:private,role_id};
  await data.set( key, value );
}


async function deleteUserFromRoom(user_id,room_id){
  let filter = await user_id.toString() + '/' + room_id.toString() + '/';
  let targetKey= await data.keys().filter(key => key.startsWith(filter));
  await data.del(targetKey);

}

async function deleteRoom(room_id){
  let filter = await '/' + room_id.toString() + '/';
  let targetKeys = await data.keys().filter(key => key.includes(filter));
  await data.del(targetKeys);

}

async function getRoomsFromUser(user_id){
  let filter = await user_id.toString() + '/';
  let targetKeys = await data.keys().filter(key => key.startsWith(filter));
  return Object.values(data.mget(targetKeys));
}

async function getUsersFromRoom(room_id){
  let filter = await '/' + room_id.toString() + '/';
  let targetKeys = await data.keys().filter(key => key.includes(filter));
  return Object.values(data.mget(targetKeys));
}


async function getUserRoleFromRoom(user_id,room_id){
  let filter = await user_id.toString() + '/' + room_id.toString() + '/';
  let targetKey= await data.keys().filter(key => key.startsWith(filter));
  return await data.get(targetKey[0]).role_id;

}


module.exports = {
  data:data,
  set:set,
  add:add,
  deleteUserFromRoom:deleteUserFromRoom,
  deleteRoom:deleteRoom,
  getRoomsFromUser:getRoomsFromUser,
  getUsersFromRoom:getUsersFromRoom,
  getUserRoleFromRoom:getUserRoleFromRoom
}
