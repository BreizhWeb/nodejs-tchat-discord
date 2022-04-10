/*Groupe 2, module Role User

https://github.com/node-cache/node-cache
*/
const NodeCache = require( "node-cache" );
const { selectAllWithJoin } = require("../db/db_roles");
const data = new NodeCache();

/**
* Récupére tous les éléments de la table room_user depuis la base de données contenant une triplette room_id, user_id , role_id avec les informations de la room ( private et name) et du user (pseudo )
* Ces éléments sont ajoutés au cache
*/
async function set(){
  let dataDB = await selectAllWithJoin();
  dataDB.forEach(function(element) {
    add(element.user_id,element.pseudo,element.room_id,element.name,element.private,element.role_id);
  });
}

/**
* ajoute un element au cache
*
* @param user_id identifiant de l'utilisateur
* @param pseudo nom de l'utilisateur
* @param room_id identifant de la room
* @param name nom de la room
* @param private type de la room
* @param role_id identifiant du de l'utilisateur dans la room
*/
async function add(user_id,pseudo,room_id,name,private,role_id){
  let key = await user_id.toString() + '/' + room_id.toString() + '/' + role_id.toString() ;
  let value = {user_id:user_id,pseudo:pseudo,room_id:room_id,name:name,private:private,role_id};
  await data.set( key, value );
}

/**
* supprime un utilisateur d'une room dans le cache
*
* @param user_id identifiant de l'utilisateur
* @param room_id identifant de la room
*
*@return true si la cible à supprimer est valide
*@return false si la cible à supprimer est invalide
*/
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

/**
* supprime une room
*
* @param room_id identifant de la room
*
*@return true si la cible à supprimer est valide
*@return false si la cible à supprimer est invalide
*/
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

/**
* récupère la liste des rooms ou l'utilisateur est présent
*
* @param user_id identifiant de l'utilisateur
*
*@return un objet contenant les informations du cache concernant l'utilisateur présent dans une ou des rooms
*@return un objet vide si l'utilisateur n'est pas présent dans une room
*/
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

/**
* récupère la liste des utilisateurs d'un room
*
* @param room_id identifant de la room
*
*@return un objet contenant les informations du cache conernant les utilisateur d'une room
*@return un objet vide si la room est vide
*/
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

/**
* récupère le role d'un utilisateur dans une room
*
* @param room_id identifant de la room
* @param user_id identifiant de l'utilisateur
*
*@return un objet contenant les informations du cache conernant les utilisateur d'une room
*@return un objet vide si la room est vide
*/
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

/**
* récupère les informations d'une room
*
* @param room_id identifant de la room
*
*@return un objet contenant les informations du cache conernant une room (room_id, private , name)
*@return un objet vide si la room ne posssède pas d'information
*/
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

/**
* vérifie la présence d'un utilisateur dans une room
*
* @param room_id identifant de la room
* @param user_id identifiant de l'utilisateur
*
*@return un booléen indiquant si l'utilisateur est dans la room.
*/
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
