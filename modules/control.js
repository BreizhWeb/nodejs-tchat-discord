    const permission = require('./permissions');
    const db = require('../db/db');
    const cache = require('./cacheData');

    
    function inviteUserCtrl(user, room, user_to_invite){
        if(getActionRight(user, room, permission.control.inviteUser)){
            // todo  création du triplés
            db.users.create(room, user_to_invite, 1);

            //ajout en cache
            cache.addToCache(user, user_to_invite, 0);
        }
    }
    function deleteUserCtrl(user, room, user_delete){
        if(getActionRight(user, room, permission.control.deleteUser)){
            // todo delete bdd triplé
            db.users.delete(user_delete);

            //supression en cache
            cache.deleteFromCache(user_delete, room, 0);
        }
    }
    function createRoomCtrl(user,room,user_to_create_room){
        if(getActionRight(user, room, permission.control.createRoomCtrl)){
           // def
            db.rooms.create('roomTest', 'urlImage', 1);

            user_to_create_room
            //cache
            cache.addToCache(user_to_create_room,)
        }
    }
    function deleteRoomCtrl(user,room){
        if(getActionRight(user, room, permission.control.deleteRoom)){
            //todo delete room from db
            db.rooms.deleteRoom(room);

            //supression en cache
            cache.deleteFromCache(user, room, 0);
        }
    }
    function sendMessageCtrl(user, room, message){
        if(getActionRight(user, room, permission.control.sendMessage)){
            // def
            db.messages.create(user, message);
        }
    }
    function deleteMessageCtrl(user, room, message){
        if(getActionRight(user, room, permission.control.deleteMessage)){
            // todo requete delete message avec id
            db.messages.deleteMsg(message);

            //supression en cache
            cache.deleteFromCache(user, room, 0);
        }
    }
    function changeRoleCtrl(user,room,user_tochange){
        if(getActionRight(user,room,permission.control.changeRole)){
            //todo change role from db
            db.roles.update(room, user_tochange, 0);

            //ajout en cache
            cache.addToCache(user, user_tochange, 0);
        }
    }

    module.exports = { 
        deleteMessageCtrl,
        inviteUserCtrl,
        deleteUserCtrl,
        deleteRoomCtrl,
        changeRoleCtrl,
        createRoomCtrl,
        sendMessageCtrl
    }