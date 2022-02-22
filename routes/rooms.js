module.exports = function ({ app, con }) {
  //--------------------------------------------------CREATE---------------------------------------------//

  /**
   * Create New Room
   *
   * @return response()
   */
  app.post("/rooms", (req, res) => {
    let data = {
      name: req.body.name,
      image: req.body.image,
      private: req.body.private,
    };

    let sqlQuery = "INSERT INTO rooms SET ?";

    let query = conn.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      res.send(apiResponse(results));
    });
  });

  //--------------------------------------------------READ---------------------------------------------//

  /**
   * Get All Room
   *
   * @return response()
   */

  app.get("/rooms", (req, res) => {
    let sqlQuery = "SELECT * FROM rooms";

    let query = con.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(apiResponse(results));
    });
  });

  /**
   * Get specific room by ID
   *
   * @return response()
   */

  app.get("/room/:id", (req, res) => {
    let sqlQuery = "SELECT * FROM room WHERE room_id =" + req.params.id;

    let query = con.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(apiResponse(results));
    });
  });

  /**
   * Get All public Room
   *
   * @return response()
   */

  app.get("/rooms/public", (req, res) => {
    let sqlQuery = "SELECT * FROM rooms WHERE private = 0";

    let query = con.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(apiResponse(results));
    });
  });

  //--------------------------------------------------UPDATE---------------------------------------------//

  /**
   * Update Room
   *
   * @return response()
   */
  app.put("/rooms/:id", (req, res) => {
    let sqlQuery =
      "UPDATE rooms SET name='" +
      req.body.name +
      "', image='" +
      req.body.image +
      "', private='" +
      req.body.private +
      "' WHERE room_id=" +
      req.params.id;

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(apiResponse(results));
    });
  });

  //--------------------------------------------------DELETE---------------------------------------------//

  /**
   * Delete Room
   *
   * @return response()
   */
  app.delete("/rooms/:id", (req, res) => {
    let sqlQuery = "DELETE FROM rooms WHERE room_id=" + req.params.id + "";

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(apiResponse(results));
    });
  });

  /**
   * API Response
   *
   * @return response()
   */
  function apiResponse(results) {
    return JSON.stringify({ status: 200, error: null, response: results });
  }
}