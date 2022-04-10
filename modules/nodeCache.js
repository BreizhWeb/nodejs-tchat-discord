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
  if(targetKey.length){
    await data.del(targetKeys);
    return(true);
  }
  else{
    return(false)
  }

}

async function deleteRoom(room_id){
  let filter = await '/' + room_id.toString() + '/';
  let targetKeys = await data.keys().filter(key => key.includes(filter));
  if(targetKeys.length){
    await data.del(targetKeys);
    return(true);
  }
  else{
    return(false);
  }

}

async function getRoomsFromUser(user_id){
  let filter = await user_id.toString() + '/';
  let targetKeys = await data.keys().filter(key => key.startsWith(filter));
  if(targetKeys.length){
    return Object.values(data.mget(targetKeys));
  }
  else{
    return({});
  }
}

async function getUsersFromRoom(room_id){
  let filter = await '/' + room_id.toString() + '/';
  let targetKeys = await data.keys().filter(key => key.includes(filter));
  if(targetKeys.length){
    return Object.values(data.mget(targetKeys));
  }
  else{
    return({});
  }
}


async function getUserRoleFromRoom(user_id,room_id){
  let filter = await user_id.toString() + '/' + room_id.toString() + '/';
  let targetKey= await data.keys().filter(key => key.startsWith(filter));
  if(targetKey.length){
    return await data.get(targetKey[0]).role_id;
  }
  else{
    return({});
  }
}

async function getRoomInfo(room_id){
  let filter = await '/' + room_id.toString() + '/';
  let targetKeys = await data.keys().filter(key => key.includes(filter));
  if(targetKeys.length){
    let result = await data.get(targetKeys[0]);
    return ({room_id:result.room_id ,name:result.name,private:result.private});
  }
  else{
    return({});
  }
}

async function userAlreadyInRoom(user_id,room_id){
  let filter = await user_id.toString() + '/' + room_id.toString() + '/';
  let targetKey= await data.keys().filter(key => key.startsWith(filter));
  return(targetKey.length ? true : false);
}


module.exports = {
  data:data,
  set:set,
  add:add,
  deleteUserFromRoom:deleteUserFromRoom,
  deleteRoom:deleteRoom,
  getRoomsFromUser:getRoomsFromUser,
  getUsersFromRoom:getUsersFromRoom,
  getUserRoleFromRoom:getUserRoleFromRoom,
  getRoomInfo:getRoomInfo,
  userAlreadyInRoom:userAlreadyInRoom
}
