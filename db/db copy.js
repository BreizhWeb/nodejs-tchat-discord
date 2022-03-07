const mysql = require('mysql');


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
});

pool.queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
      pool.query(sql, values, (error, results, fields) => {
          if (error) {
              return reject(error);
          }
          return resolve(results);
      })
  });
};

getUsers = async function () {
  return pool.queryAsync(`
    SELECT * FROM users
  `);
}
//--------------------------------------------------CREATE---------------------------------------------//

/**
 * Create New User
 *
 * @return response()
 */

createUser = function (pseudo, password) {
  let data = {
    pseudo: pseudo,
    password: password,
  };

  let sqlQuery = "INSERT INTO users SET ?";

  con.query(sqlQuery, data, (err, results) => {
    if (err) throw err;
    return results;
  });
}

//--------------------------------------------------READ---------------------------------------------//

/**
 * Get All Users
 *
 * @return response()
 */


/**
* Get specific ID by PSEUDO
*
* @return response()
*/

getIdByPseudo = function (pseudo) {
  
  let sqlQuery = "SELECT user_id FROM users WHERE pseudo = '" + pseudo + "'";
  let id;

  con.query(sqlQuery, (err, results) => {
    if (err) throw err;
    id = results;
  });
  return id;
}
/**
 * Get specific user by ID
 *
 * @return response()
 */
getUserById = function (id) {
  let user;
  let sqlQuery = "SELECT * FROM users WHERE user_id =" + id;

  con.query(sqlQuery, id, (err, results) => {
    if (err) throw err;
    user = results;
  });
  return user;
}

//--------------------------------------------------UPDATE---------------------------------------------//

/**
 * Update User
 *
 * @return response()
 */

updateUser = function (pseudo, password, id) {
  let sqlQuery = "UPDATE users SET pseudo='" + pseudo + "', password='" + password + "' WHERE id=" + id;

  con.query(sqlQuery, pseudo, (err, results) => {
    if (err) throw err;
    return results;
  });
}

//--------------------------------------------------DELETE---------------------------------------------//

/**
 * Delete User
 *
 * @return response()
 */

deleteUser = function (id) {
  let sqlQuery = "DELETE FROM users WHERE id=" + id + "";

  con.query(sqlQuery, id, (err, results) => {
    if (err) throw err;
    return results;
  });
}
module.exports = {
  users: {
    create: createUser,
    getUsers: getUsers,
    getIdByPseudo: getIdByPseudo,
    getUserById: getUserById,
    update: updateUser,
    delete: deleteUser
  },
  rooms: {
    //--------------------------------------------------CREATE---------------------------------------------//

    /**
     * Create New Room
     *
     * @return response()
     */
    create: function (name, image, private) {
      let data = {
        name: name,
        image: image,
        private: private,
      };

      let sqlQuery = "INSERT INTO rooms SET ?";

      con.query(sqlQuery, data, (err, results) => {
        if (err) throw err;
        return results;
      });

    },

    //--------------------------------------------------READ---------------------------------------------//

    /**
     * Get All Room
     *
     * @return response()
     */

    selectAll: function () {
      let sqlQuery = "SELECT * FROM rooms";

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        return results;
      });
    },

    /**
     * Get specific room by ID
     *
     * @return response()
     */

    select: function (room_id) {
      let sqlQuery = "SELECT * FROM room WHERE room_id =" + room_id;

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        return results;
      });
    },

    /**
     * Get All public Room
     *
     * @return response()
     */

    selectPublic: function () {
      let sqlQuery = "SELECT * FROM rooms WHERE private = 0";

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        return results;
      });
    },

    //--------------------------------------------------UPDATE---------------------------------------------//

    /**
     * Update Room
     *
     * @return response()
     */
    update: function (id, name, image, private) {
      let sqlQuery =
        "UPDATE rooms SET name='" +
        name +
        "', image='" +
        image +
        "', private='" +
        private +
        "' WHERE room_id=" +
        id;

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        return results;
      });
    },

    //--------------------------------------------------DELETE---------------------------------------------//

    /**
     * Delete Room
     *
     * @return response()
     */
    delete: function (id) {
      let sqlQuery = "DELETE FROM rooms WHERE room_id=" + id + "";

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        return results;
      });

      roles.deleteByRoom(id);
    }
  },
  messages: {
    //--------------------------------------------------CREATE---------------------------------------------//

    /**
     * Create New Messages
     *
     * @return response()
     */
    create: function (aut, contenu) {
      var ladate = new Date();
      var strDate = ladate.getFullYear() + "-" + (ladate.getMonth() + 1) + "-" + ladate.getDate();
      var i = getIdByPseudo(aut);
      con.query("INSERT INTO messages(date, content, id_user, id_room) VALUES ('" + strDate + "','" + contenu + "', " + i + ", 1)", function (err, result) {
        if (err) throw err;
        console.log(result);
      });
    },



    //--------------------------------------------------READ---------------------------------------------//

    /**
     * Get All Messages
     *
     * @return response()
     */

    select: function () {
      con.query("SELECT content, users.pseudo FROM messages INNER JOIN users ON messages.id_user=users.user_id ORDER BY message_id DESC LIMIT 10; ", function (err, rows, fields) {
        const reversed = rows.reverse();
        reversed.forEach(function (row) {
          //console.log("<strong>" + row.pseudo + "</strong>: " + row.content + "<br/>");
          io.sockets.emit('new message', { msg: row.content, user: row.pseudo });
        });
      });
    },

    /**
     *  Get specific Messages by ID room
     *
     * @return response()
     */

    selectByIdRoom: function (id) {
      con.query("SELECT users.pseudo, content, id_room  FROM messages INNER JOIN users ON messages.id_user=users.user_id WHERE id_room =" + id + " ORDER BY message_id DESC LIMIT 10;", function (err, rows, fields) {
        const reversed = rows.reverse();
        reversed.forEach(function (row) {
          //console.log("<strong>" + row.pseudo + "</strong>: " + row.content + "<br/>");
          io.sockets.emit('new message', { msg: row.content, user: row.pseudo });
        });
      });
    },



    //--------------------------------------------------UPDATE---------------------------------------------//

    /**
     * Update Messages
     *
     * @return response()
     */
    updateMessageById: function (id, nouveauMessage) {
      var ladate = new Date();
      var strDate = ladate.getFullYear() + "-" + (ladate.getMonth() + 1) + "-" + ladate.getDate();

      let sqlQuery = "UPDATE messages SET date='" + strDate + "', content='" + nouveauMessage + "', id_user=1, id_room=1 WHERE message_id=" + id;

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
      });
    },



    //--------------------------------------------------DELETE---------------------------------------------//

    /**
     * Delete Messages
     *
     * @return response()
     */

    delete: function (id) {

      let sqlQuery = "DELETE FROM messages WHERE message_id=" + req.params.id + "";

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
      });

    }

  },
  roles: {
    //--------------------------------------------------CREATE---------------------------------------------//

    /**
     * Create new Rooms_Users
     * 
     * @return response()
     */
    create: function (id_room, id_user, id_role) {
      let data = {
        id_room: id_room,
        id_user: id_user,
        id_role: id_role,
      };

      let sqlQuery = "INSERT INTO rooms_users SET ?";

      con.query(sqlQuery, data, (err, results) => {
        if (err) throw err;
        return results;
      });
    },

    //--------------------------------------------------READ---------------------------------------------//

    /**
     * Get All Rooms_Users by id_room
     *
     * @return response()
     */

    selectAllByRoom: function (id_room) {
      let sqlQuery = "SELECT * FROM rooms_users WHERE id_room=" + id_room;

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        return results;
      });
    },

    //--------------------------------------------------UPDATE---------------------------------------------//

    /**
     * Update Rooms_Users
     *
     * @return response()
     */
    update: function (id_room, id_user, id_role) {
      let sqlQuery =
        "UPDATE rooms_users SET id_role=" +
        id_role +
        " WHERE id_room=" +
        id_room +
        " AND id_user=" +
        id_user;

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        return results;
      });
    },

    //--------------------------------------------------DELETE---------------------------------------------//

    /**
     * Delete Rooms_Users
     *
     * @return response()
     */
    delete: function (id) {
      let sqlQuery = "DELETE FROM rooms_users WHERE room_users_id=" + id + "";

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        return results;
      });
    },

    /**
     * Delete Rooms_Users by id_room
     *
     * @return response()
     */
    deleteByRoom: function (id) {
      let sqlQuery = "DELETE FROM rooms_users WHERE id_room=" + id + "";

      con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        return results;
      });
    }
  }
};

/*
{
  users: {
    create: [Function: create], --> Créer un utilisateur
    getUsers: [Function: getUsers], --> Récupérer un utilisateur
    getUserById: [Function: getUserById], --> Récupérer un utilisateur par son ID
    getIdByPseudo: [Function: getIdByPseudo], --> Récupérer l'ID d'un utilisateur par son pseudo
    update: [Function: update], --> modifier un utilisateur
    delete: [Function: delete] --> supprimer un utilisateur
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
    selectAllByRoom: [Function: selectAllByRoom], --> récupérer tous les rôles d'une conversation
    update: [Function: update], --> modifier le rôle d'un utilisateur
    delete: [Function: delete], --> supprimmer le rôle d'un utilisateur en BDD quand il est supprimer d'une conversation
    deleteByRoom: [Function: deleteByRoom]  --> supprimer les rôles de tous les utilisateurs d'une conversation quand elle est supprimée
  }
}
*/


