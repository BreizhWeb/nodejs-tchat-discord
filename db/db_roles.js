module.exports = {
    //--------------------------------------------------CREATE---------------------------------------------//

    /**
     * Create new Rooms_Users
     * 
     * @return response()
     */
    create: function(id_room, id_user, id_role){
        let data = {
            id_room: id_room,
            id_user: id_user,
            id_role: id_role,
        };
      
        let sqlQuery = "INSERT INTO rooms_users SET ?";
      
            con.query(sqlQuery, data, (err, results) => {
            if (err) throw err;
            console.log(results);
        });
    },

    //--------------------------------------------------READ---------------------------------------------//
  
    /**
     * Get All Rooms_Users by id_room
     *
     * @return response()
     */
  
     selectAllByRoom: function (id_room){
      let sqlQuery = "SELECT * FROM rooms_users WHERE id_room="+id_room;
  
       con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        console.log(results);
      });
    },
  
    //--------------------------------------------------UPDATE---------------------------------------------//
  
    /**
     * Update Rooms_Users
     *
     * @return response()
     */
     update: function (id_room, id_user, id_role){
      let sqlQuery =
        "UPDATE rooms_users SET id_role=" +
        id_role +
        " WHERE id_room=" +
        id_room+
        " AND id_user="+
        id_user;
  
        con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        console.log(results);
      });
    },
  
    //--------------------------------------------------DELETE---------------------------------------------//
  
    /**
     * Delete Rooms_Users
     *
     * @return response()
     */
    delete: function (id){
      let sqlQuery = "DELETE FROM rooms_users WHERE room_users_id=" + id + "";
  
        con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        console.log(results);
      });
    },

    /**
     * Delete Rooms_Users by id_room
     *
     * @return response()
     */
     deleteByRoom: function (id){
        let sqlQuery = "DELETE FROM rooms_users WHERE id_room=" + id + "";
    
          con.query(sqlQuery, (err, results) => {
          if (err) throw err;
          console.log(results);
        });
      }
}