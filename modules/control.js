const permission = require('./permissions');
const db = require('../db/db');
const cache = require('./cacheData');
const multirooms = require('./multirooms.js')

function async createRoom(socket,data){
        let room = await db.rooms.create(data.name, data.image, data.private);
        db.roles.create(room.room_id, socket.user.user_id, 0);
        await cache.addToCache(socket.user.user_id,room.room_id,0);
        socket.user.rooms.push(room);
        joinRooms(socket);
        return room;
}
function async sendMessage(){
  if(getActionRight(user, room,permission.control.sendMessage)){

  }
}
function async deleteMessage(){
  if(getActionRight(user, room,permission.control.deleteMessage)){

  }
}
function async inviteUser(){
  if(getActionRight(user, room,permission.control.inviteUser)){

  }
}
function async deleteUser(){
  if(getActionRight(user, room,permission.control.deleteUser)){

  }
}
function async deleteRoom(){
  if(getActionRight(user, room,permission.control.deleteRoom)){

  }
}
function async changeRole(){
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
