const {selectAll} = require("../db/db_roles");

var rooms_usersCache;

async function setCache(){
  rooms_usersCache = selectAll();
  console.log(await rooms_usersCache);
}

function addToCache (user_id, room_id, role_id){
  let added = rooms_usersCache.push({user_id:user_id,room_id:room_id,role_id:role_id})
  rooms_usersCache = added ;
}

function updateCache (user_id, room_id, role_id){
  let updated =rooms_usersCache.find(element => element.user_id == user_id && element.room_id == room_id)
  if (typeof search === 'undefined') {
    updated.role_id = role_id;
  }
  rooms_usersCache = updated;
}


function deleteUserFromCache (user_id, room_id, role_id){
  let deleted = rooms_usersCache.filter(element => element.user_id != user_id || element.room_id != room_id || element.role_id != role_id);
  rooms_usersCache =  deleted;
}

function deleteRoomFromCache (room_id){
  let deleted = rooms_usersCache.filter(element => element.room_id != room_id);
  rooms_usersCache =  deleted;
}

function listRoomUserFromCache(room_id){
  return rooms_usersCache.filter(element => element.room_id === room_id);
}

module.exports = {
    rooms_usersCache: rooms_usersCache,
    setCache:setCache,
    addToCache: addToCache,
    updateCache: updateCache,
    deleteUserFromCache: deleteUserFromCache,
    deleteRoomFromCache: deleteRoomFromCache,
    listRoomUserFromCache: listRoomUserFromCache
}
