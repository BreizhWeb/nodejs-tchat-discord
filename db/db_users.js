const mysql = require('mysql');

//création d'une connection a la bdd
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL!");
});

//--------------------------------------------------CREATE---------------------------------------------//

/**
 * Create New User
 *
 * @return response()
 */

createUser = function (pseudo, password) {

  return new Promise(function (resolve, reject) {
    let data = {
      pseudo: pseudo,
      password: password,
    };

    let sqlQuery = "INSERT INTO users SET ?";

    con.query(sqlQuery, data, async (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(await getUserById(result.insertId));
    });
  });
}

//--------------------------------------------------READ---------------------------------------------//

/**
 * Get All Users
 *
 * @return response()
 */

getUsers = function () {
  return new Promise(function (resolve, reject) {
    let sqlQuery = "SELECT * FROM users";

    con.query(sqlQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results.map(row => Object.assign({}, row)));
    });
  });
}


/**
* Get specific ID by PSEUDO
*
* @return response()
*/

getIdByPseudo = function (pseudo) {

  return new Promise(function (resolve, reject) {
    let sqlQuery = "SELECT user_id FROM users WHERE pseudo ='" + pseudo + "'";

    con.query(sqlQuery, pseudo, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(Object.assign({}, results[0]).user_id);
    });
  });
}

/**
 * Get specific user by ID
 *
 * @return response()
 */
getUserById = function (id) {

  return new Promise(function (resolve, reject) {
    let sqlQuery = "SELECT * FROM users WHERE user_id =" + id;
    console.log(sqlQuery);
    con.query(sqlQuery, id, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(Object.assign({}, results[0]));
    });
  });
}

/**
 * Get all user data by ID 
 *
 * @return response()
 */
getUserData = function (id) {

  return new Promise(function (resolve, reject) {
    let sqlQuery = `SELECT * FROM users 
    LEFT JOIN rooms_users ON rooms_users.user_id = users.user_id 
    LEFT JOIN rooms ON rooms.room_id = rooms_users.room_id
    WHERE users.user_id =` + id;
    con.query(sqlQuery, id, (err, results) => {
      if (err) {
        return reject(err);
      }
      let user = {}
      if (results.length > 1) {
        user.chans = results.map(res => {
          let item = Object.assign({}, res)
          if (!user.user_id) user.user_id = item.user_id
          if (!user.pseudo) user.pseudo = item.pseudo
          if (item.room_id) {
            return {
              room_id: item.room_id,
              name: item.name,
              image: item.image,
              private: item.private
            }
          }
        })
      } else {
        user.chans = results.map(res => {
          let item = Object.assign({}, res)
          user.user_id = item.user_id
          user.pseudo = item.pseudo
          if (item.room_id) {
            return {
              room_id: item.room_id,
              name: item.name,
              image: item.image,
              private: item.private
            }
          }
        })
      }

      return resolve(user);
    });
  });
}

//--------------------------------------------------UPDATE---------------------------------------------//

/**
 * Update User
 *
 * @return response()
 */

updateUser = function (pseudo, password, id) {

  return new Promise(function (resolve, reject) {
    let sqlQuery = "UPDATE users SET pseudo='" + pseudo + "', password='" + password + "' WHERE id=" + id;

    con.query(sqlQuery, pseudo, password, id, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results.map(row => Object.assign({}, row)));
    });
  });
}

//--------------------------------------------------DELETE---------------------------------------------//

/**
 * Delete User
 *
 * @return response()
 */

deleteUser = function (id) {

  return new Promise(function (resolve, reject) {
    let sqlQuery = "DELETE FROM users WHERE id=" + id + "";

    con.query(sqlQuery, id, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results.map(row => Object.assign({}, row)));
    });
  });

}
module.exports = {
  create: createUser,
  getUsers: getUsers,
  getIdByPseudo: getIdByPseudo,
  getUserById: getUserById,
  getUserData: getUserData,
  update: updateUser,
  delete: deleteUser
}