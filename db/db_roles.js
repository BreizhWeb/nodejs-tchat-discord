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
     create = function (id_room, id_user, id_role) {

      return new Promise(function(resolve, reject){
        let data = {
          id_room: id_room,
          id_user: id_user,
          id_role: id_role,
        };
      
        let sqlQuery = "INSERT INTO rooms_users SET ?";
    
        con.query(sqlQuery, data, (err, results) => {
          if (err){
            return reject(err);
          }
          return resolve(results); 
        });
    });
  }
  
  

  //--------------------------------------------------READ---------------------------------------------//
  
    /**
     * Get All Rooms_Users by id_room
     *
     * @return response()
     */
  
     selectAllByRoom = function (id_room){
      return new Promise(function(resolve, reject){
        let sqlQuery = "SELECT id_room, id_role FROM rooms_users WHERE id_room="+id_room;
    
        con.query(sqlQuery, (err, results) => {
          if (err){
            return reject(err);
          }
          return resolve(results); 
        });
      })
    };
    

    /**
     * Get All Rooms_Users by id_user
     *
     * @return response()
     */
  
    selectAllByUser = function (id_user) {
      return new Promise(function(resolve, reject){
        let sqlQuery = "SELECT id_room, id_role FROM rooms_users WHERE id_user="+id_user;
    
        con.query(sqlQuery, (err, results) => {
          if (err){
            return reject(err);
          }
          return resolve(results); 
        });
      })
    };

    /**
     * Get All Rooms_Users
     *
     * @return response()
     */
    selectAll = function () {
      return new Promise(function(resolve, reject){
        let sqlQuery = "SELECT * FROM  rooms_users"
    
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
     * Update Rooms_Users
     *
     * @return response()
     */
     update = function (id_room, id_user, id_role){
      return new Promise(function(resolve, reject){
        let sqlQuery =
          "UPDATE rooms_users SET id_role=" +
          id_role +
          " WHERE id_room=" +
          id_room+
          " AND id_user="+
          id_user;
    
          con.query(sqlQuery, (err, results) => {
          if (err){
            return reject(err);
          }
          return resolve(results);
        });
      })
    },

    //--------------------------------------------------DELETE---------------------------------------------//
  
    /**
     * Delete Rooms_Users
     *
     * @return response()
     */
     deleteUser = function (id){
      return new Promise(function(resolve, reject){
        let sqlQuery = "DELETE FROM rooms_users WHERE room_users_id=" + id + "";
    
          con.query(sqlQuery, (err, results) => {
          if (err){
            return reject(err);
          }
          return resolve(results);
        });
      })
    },

    /**
     * Delete Rooms_Users by id_room
     *
     * @return response()
     */
     deleteByRoom = function (id){
      return new Promise(function(resolve, reject){
        let sqlQuery = "DELETE FROM rooms_users WHERE id_room=" + id + "";
    
          con.query(sqlQuery, (err, results) => {
          if (err){
            return reject(err);
          }
          return resolve(results);
        });
      })
    }

module.exports = {
    create: create,
    selectAllByRoom: selectAllByRoom,
    selectAllByUser: selectAllByUser,
    selectAll: selectAll,
    update: update,
    deleteUser: deleteUser,
    deleteByRoom: deleteByRoom
}