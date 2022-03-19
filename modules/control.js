const permission = require('./permissions');
const db = require('../db/db');
const cache = require('./cacheData');
const multirooms = require('./multirooms.js')

function async createRoom(socket,data){
        let room = await db.rooms.create(data.name, data.image, data.private);
        db.roles.create(room.room_id, socket.user.user_id, 1);
        await cache.addToCache(socket.user.user_id,room.room_id,1);
        socket.user.rooms.push(room);
        joinRooms(socket);
        return room;

        // il faut corriger la fonction

}
function async sendMessage(){

}
function async deleteMessage(){

}
function async inviteUser(user_id,room_id,invited_user_id){
  if(getActionRight(user_id, room_id, permission.control.inviteUser)){
    db.roles.create(room_id, invited_user_id, 0);
    cache.add(invited_user_id, room_id, 0);
  }
}
function async deleteUser(user_id,room_id,deleted_user_id){
  if(getActionRight(user_id, room_id ,permission.control.deleteUser)){
    db.roles.deleteUser(room_id, invited_user_id);
    cache.deleteUser(invited_user_id, room_id);
  }
}

function async deleteRoom(user_id,room_id){
  if(getActionRight(user_id, room_id, permission.control.deleteRoom)){
    db.roles.deleteRoom(room_id);
    cache.deleteRoom(room_id);
  }
}

function async changeRole(user_id,room_id){
  if(getActionRight(user, room,permission.control.changeRole)){

  }
}


module.exports = {
    createRoom,
    deleteMessage,
    inviteUser,
    deleteUser,
    deleteRoom,
    changeRole,
}
