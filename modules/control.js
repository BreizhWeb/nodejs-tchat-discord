const { con } = require('./accessBDD');
const permission = require('./permissions');

function deleteMessageCtrl(user, room, message){
    if(getActionRight(user, room, permission.control.deleteMessage)){
        // todo requete delete message avec id

    }
}
function inviteUserCtrl(user, room, user_to_invite){
    if(getActionRight(user, room, permission.control.inviteUser)){
        // todo  création du triplés

    }
}
function deleteUserCtrl(user, room, user_delete){
    if(getActionRight(user, room, permission.control.deleteUser)){
        // todo delete bdd triplé

    }
}
function deleteRoomCtrl(user,room){
    if(getActionRight(user, room, permission.control.deleteRoom)){
        //todo delete room from db

    }
}
function changeRoleCtrl(user,room,user_tochange){
    if(getActionRight(user,room,permission.control.changeRole)){
        //todo change role from db
        
    }
}

module.exports = { 
    deleteMessageCtrl,
    inviteUserCtrl,
    deleteUserCtrl,
    deleteRoomCtrl,
    changeRoleCtrl
}