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

    return new Promise(function(resolve, reject){
      let data = {
        pseudo: pseudo,
        password: password,
      };
    
      let sqlQuery = "INSERT INTO users SET ?";
  
      con.query(sqlQuery, data, (err, results) => {
        if (err){
          return reject(err);
        }
        return resolve(results.map(row => Object.assign({}, row))); 
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
  return new Promise(function(resolve, reject){
    let sqlQuery = "SELECT * FROM users";

    con.query(sqlQuery, (err, results) => {
      if (err){
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

  return new Promise(function(resolve, reject){
    let sqlQuery = "SELECT user_id FROM users WHERE pseudo ='" + pseudo+ "'";

    con.query(sqlQuery, pseudo, (err, results) => {
      if (err){
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

  return new Promise(function(resolve, reject){
    let sqlQuery = "SELECT * FROM users WHERE user_id =" + id;

    con.query(sqlQuery, id, (err, results) => {
      if (err){
        return reject(err);
      }
      return resolve(Object.assign({}, results[0])); 
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

  return new Promise(function(resolve, reject){
    let sqlQuery = "UPDATE users SET pseudo='" + pseudo + "', password='" + password + "' WHERE id=" + id;

    con.query(sqlQuery, pseudo, password, id, (err, results) => {
      if (err){
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

  return new Promise(function(resolve, reject){
    let sqlQuery = "DELETE FROM users WHERE id=" + id + "";

    con.query(sqlQuery, id, (err, results) => {
      if (err){
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
    update: updateUser,
    delete: deleteUser
}