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
 * Create New Room
 *
 * @return response()
 */
create = function (name, image, private) {
  return new Promise(function(resolve, reject){
    let data = {
      name: name,
      image: image,
      private: private,
    };

    let sqlQuery = "INSERT INTO rooms SET ?";

    con.query(sqlQuery, data, (err, results) => {
      if (err){
        return reject(err);
      }
      return resolve(results);
    });
  })
};
//--------------------------------------------------READ---------------------------------------------//

/**
 * Get All Room
 *
 * @return results
 */

selectAll = function () {
  return new Promise(function(resolve, reject){
    let sqlQuery = "SELECT * FROM rooms";

    con.query(sqlQuery, (err, results) => {
      if (err){
        return reject(err);
      }
      return resolve(results); 
    });
  })
};
/**
 * Get specific room by ID
 *
 * @return response()s
 */

select = function (room_id) {
  return new Promise(function(resolve, reject){
    let sqlQuery = "SELECT * FROM rooms WHERE room_id =" + room_id;
    con.query(sqlQuery, (err, results) => {
      if (err){
        return reject(err);
      }
      return resolve(results);
    });
  })
  
};
/**
 * Get All public Room
 *
 * @return response()
 */

selectPublic = function () {
  return new Promise(function(resolve, reject){
    let sqlQuery = "SELECT * FROM rooms WHERE private = 0";

    con.query(sqlQuery, (err, results) => {
      if (err){
        return reject(err);
      }
      return resolve(results);
    });
  })
};
//--------------------------------------------------UPDATE---------------------------------------------//

/**
 * Update Room
 *
 * @return response()
 */
update = function (id, name, image, private) {
  return new Promise(function(resolve, reject){
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
      if (err){
        return reject(err);
      }
      return resolve(results);
    });
  })
};
//--------------------------------------------------DELETE---------------------------------------------//

/**
 * Delete Room
 *
 * @return response()
 */
deleteRoom = function (id) {
  return new Promise(function(resolve, reject){
    let sqlQuery = "DELETE FROM rooms WHERE room_id=" + id + "";

    con.query(sqlQuery, (err, results) => {
      if (err){
        return reject(err);
      }
      roles.deleteByRoom(id);
      return resolve(results);
    });
  })
};

module.exports = {
  create: create,
  selectAll: selectAll,
  select: select,
  selectPublic: selectPublic,
  update: update,
  deleteRoom: deleteRoom,
};