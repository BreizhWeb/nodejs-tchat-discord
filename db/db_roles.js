const mysql = require("mysql");

//création d'une connection a la bdd
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
});

//--------------------------------------------------CREATE---------------------------------------------//

/**
 * Create new Rooms_Users
 *
 * @return response()
 */
create = function (room_id, user_id, role_id) {

  return new Promise(function (resolve, reject) {
    let data = {
      room_id: room_id,
      user_id: user_id,
      role_id: role_id,
    };

    let sqlQuery = "INSERT INTO rooms_users SET ?";

    con.query(sqlQuery, data, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result.insertId);
    });
  });
}



//--------------------------------------------------READ---------------------------------------------//

/**
 * Get All Rooms_Users by room_id
 *
 * @return response()
 */

selectAllByRoom = function (room_id) {
  return new Promise(function (resolve, reject) {
    let sqlQuery = "SELECT room_id, role_id FROM rooms_users WHERE room_id=" + room_id;

    con.query(sqlQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results.map(row => Object.assign({}, row)));
    });
  })
};


/**
 * Get All Rooms_Users by user_id
 *
 * @return response()
 */

selectAllByUser = function (user_id) {
  return new Promise(function (resolve, reject) {
    let sqlQuery = "SELECT rooms_users.room_id, rooms_users.role_id, rooms.name, rooms.name FROM rooms_users LEFT JOIN rooms ON rooms.room_id = rooms_users.room_id WHERE user_id=" + user_id;
    con.query(sqlQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results.map(row => Object.assign({}, row)));
    });
  })
};

/**
 * Get All Rooms_Users
 *
 * @return response()
 */
selectAll = function () {
  return new Promise(function (resolve, reject) {
    let sqlQuery = "SELECT * FROM  rooms_users"

    con.query(sqlQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results.map(row => Object.assign({}, row)));
    });
  })
};

/**
 * Get All Rooms_Users with join
 *
 * @return response()
 */
selectAllWithJoin = function () {
  return new Promise(function(resolve, reject){
    let sqlQuery = "SELECT u.user_id, u.pseudo, r.room_id, r.name, r.private, ru.role_id FROM  rooms_users AS ru INNER JOIN rooms AS r ON r.room_id = ru.room_id INNER JOIN users AS u ON u.user_id = ru.user_id;"

    con.query(sqlQuery, (err, results) => {
      if (err){
        return reject(err);
      }
      return resolve(results.map(row => Object.assign({}, row)));
    });
  })
};

//--------------------------------------------------UPDATE---------------------------------------------//

/**
 * Update Rooms_Users
 *
 * @return response()
 */
update = function (room_id, user_id, role_id) {
  return new Promise(function (resolve, reject) {
    let sqlQuery =
      "UPDATE rooms_users SET role_id=" +
      role_id +
      " WHERE room_id=" +
      room_id +
      " AND user_id=" +
      user_id;

    con.query(sqlQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results.map(row => Object.assign({}, row)));
    });
  })
}

//--------------------------------------------------DELETE---------------------------------------------//

/**
 * Delete Rooms_Users
 *
 * @return response()
 */
deleteUser = function (id) {
  return new Promise(function (resolve, reject) {
    let sqlQuery = "DELETE FROM rooms_users WHERE room_users_id=" + id + "";

    con.query(sqlQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results.map(row => Object.assign({}, row)));
    });
  })
}

/**
 * Delete Rooms_Users by room_id
 *
 * @return response()
 */
deleteByRoom = function (id) {
  return new Promise(function (resolve, reject) {
    let sqlQuery = "DELETE FROM rooms_users WHERE room_id=" + id + "";

    con.query(sqlQuery, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result.affectedRows);
    });
  });
}

/**
 * Delete Rooms_Users by room_id
 *
 * @return response()
 */
deleteUserFromRoom = function (user_id, room_id) {
  return new Promise(function (resolve, reject) {
    let sqlQuery = "DELETE FROM rooms_users WHERE room_id=" + room_id + " AND user_id=" + user_id + ";";

    con.query(sqlQuery, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result.affectedRows);
    });
  });
}

module.exports = {
  create: create,
  selectAllByRoom: selectAllByRoom,
  selectAllByUser: selectAllByUser,
  selectAllWithJoin: selectAllWithJoin,
  selectAll: selectAll,
  update: update,
  deleteUser: deleteUser,
  deleteByRoom: deleteByRoom,
  deleteUserFromRoom: deleteUserFromRoom
}
