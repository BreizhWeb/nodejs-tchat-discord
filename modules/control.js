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

module.exports = {
    createRoom,
}
