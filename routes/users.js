module.exports = function ({ app, con }){

//--------------------------------------------------CREATE---------------------------------------------//

/**
 * Create New User
 *
 * @return response()
 */

app.post("/users", (req, res) => {
  let data = { pseudo: req.body.pseudo, password: req.body.password };

  let sqlQuery = "INSERT INTO users SET ?";

  con.query(sqlQuery, data, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});



//--------------------------------------------------READ---------------------------------------------//

/**
 * Get All Users
 *
 * @return response()
 */

app.get("/users/all", (req, res) => {
  let sqlQuery = "SELECT * FROM users";

  con.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

/**
 * Get specific user by ID
 *
 * @return response()
 */

app.get("/users/:id", (req, res) => {
  let sqlQuery = "SELECT * FROM users WHERE user_id =" + req.params.id;

  let query = con.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});



//--------------------------------------------------UPDATE---------------------------------------------//

/**
 * Update User
 *
 * @return response()
 */
 app.put('/api/users/:id',(req, res) => {
    let sqlQuery = "UPDATE users SET pseudo='"+req.body.pseudo+"', password='"+req.body.password+"' WHERE id="+req.params.id;
    
    let query = con.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
  });



//--------------------------------------------------DELETE---------------------------------------------//

/**
 * Delete User
 *
 * @return response()
 */
 app.delete('/api/users/:id',(req, res) => {
    let sqlQuery = "DELETE FROM users WHERE id="+req.params.id+"";
      
    let query = con.query(sqlQuery, (err, results) => {
      if(err) throw err;
        res.send(apiResponse(results));
    });
  });
    
  /**
   * API Response
   *
   * @return response()
   */
  function apiResponse(results){
      return JSON.stringify({"status": 200, "error": null, "response": results});
  }

}
