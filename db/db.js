const users = require("./db_users");
const rooms = require("./db_rooms");
const messages = require("./db_messages");
const roles = require("./db_roles");

module.exports = { users: users , rooms: rooms, messages: messages, roles: roles };

/*
{
  users: {
    create: [Function: createUser], --> Créer un utilisateur
    getUsers: [Function: getUsers], --> Récupérer un utilisateur
    getUserById: [Function: getUserById], --> Récupérer un utilisateur par son ID
    getIdByPseudo: [Function: getIdByPseudo], --> Récupérer l'ID d'un utilisateur par son pseudo
    update: [Function: updateUser], --> modifier un utilisateur
    delete: [Function: deleteUser] --> supprimer un utilisateur
  },
  rooms: {
    create: [Function: create], --> Créer une conversation
    selectAll: [Function: selectAll], --> Récupérer toutes les conversations
    select: [Function: select], --> Récupérer une conversation par son id
    selectPublic: [Function: selectPublic], --> Récupérer toutes les conversations public
    update: [Function: update], --> modifier une conversation
    deleteRoom: [Function: deleteRoom] --> supprimer une conversation
  },
  messages: {
    create: [Function: create], --> Créer un message
    select: [Function: select], --> récupérer les 10 derniers messages
    selectByIdRoom: [Function: selectByIdRoom], --> récupérer les 10 derniers messages d'une conversation par son ID
    updateMessageById: [Function: updateMessageById], --> modifier un message
    delete: [Function: delete] --> supprimer un message
  },
  roles: {
    create: [Function: create], --> Créer un rôle
    selectAllByRoom: [Function: selectAllByRoom], --> récupérer tous les rôles d'une conversation filtré par une room
    selectAllByUser: [Function: selectAllByUser], --> récupérer tous les rôles d'une conversation filtré par un user
    selectAll: [Function: selectAll], --> récupérer tous les rôles d'une conversation
    update: [Function: update], --> modifier le rôle d'un utilisateur
    delete: [Function: deleteUser], --> supprimmer le rôle d'un utilisateur en BDD quand il est supprimer d'une conversation
    deleteByRoom: [Function: deleteByRoom]  --> supprimer les rôles de tous les utilisateurs d'une conversation quand elle est supprimée
  }
}
*/
    
 
