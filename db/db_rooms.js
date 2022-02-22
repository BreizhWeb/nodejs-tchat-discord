module.exports = {
  //--------------------------------------------------CREATE---------------------------------------------//

  /**
   * Create New Room
   *
   * @return response()
   */
   create: function (name, image, private){
    let data = {
      name: name,
      image: image,
      private: private,
    };

    let sqlQuery = "INSERT INTO rooms SET ?";

     con.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  },

  //--------------------------------------------------READ---------------------------------------------//

  /**
   * Get All Room
   *
   * @return response()
   */

   selectAll: function (){
    let sqlQuery = "SELECT * FROM rooms";

     con.query(sqlQuery, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  },

  /**
   * Get specific room by ID
   *
   * @return response()
   */

   select: function (room_id){
    let sqlQuery = "SELECT * FROM room WHERE room_id =" + room_id;

     con.query(sqlQuery, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  },

  /**
   * Get All public Room
   *
   * @return response()
   */

   selectPublic: function (){
    let sqlQuery = "SELECT * FROM rooms WHERE private = 0";

     con.query(sqlQuery, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  },

  //--------------------------------------------------UPDATE---------------------------------------------//

  /**
   * Update Room
   *
   * @return response()
   */
   update: function (id, name, image, private){
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
      console.log(results);
    });
  },

  //--------------------------------------------------DELETE---------------------------------------------//

  /**
   * Delete Room
   *
   * @return response()
   */
   deleteRoom: function (id){
    let sqlQuery = "DELETE FROM rooms WHERE room_id=" + id + "";

      con.query(sqlQuery, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  }

}