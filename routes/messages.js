module.exports = function ({ app, con }) {
  //--------------------------------------------------CREATE---------------------------------------------//
  
  /**
   * Create New Messages
   *
   * @return response()
   */
   app.post("/messages", (req, res) => {
      let data = { date: req.body.date, content: req.body.content, id_user: 1, id_room: 1 };
    
      let sqlQuery = "INSERT INTO messages SET ?";
    
      let query = conn.query(sqlQuery, data, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
      });
    });
    
    
    
    //--------------------------------------------------READ---------------------------------------------//
    
    /**
     * Get All Messages
     *
     * @return response()
     */
    
    app.get("/messages", (req, res) => {
      let sqlQuery = "SELECT users.pseudo, content, id_room  FROM messages INNER JOIN users ON messages.id_user=users.user_id ORDER BY message_id DESC LIMIT 10; ";
    
      let query = con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
      });
    });
  
    /**
     * Get lasts messages
     *
     * @return response()
     */
    
     app.get("/conv/:id", (req, res) => {
      let sqlQuery = "SELECT users.pseudo, content, id_room  FROM messages INNER JOIN users ON messages.id_user=users.user_id WHERE id_room =" + req.params.id + " ORDER BY message_id DESC LIMIT 10;";
    
      let query = con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
      });
    });
     
    
    /**
     * Get specific Messages by ID room
     *
     * @return response()
     */
    
    app.get("/messages/:id", (req, res) => {
      let sqlQuery = "SELECT message_id, users.pseudo, content, id_room  FROM messages INNER JOIN users ON messages.id_user=users.user_id WHERE id_room =" + req.params.id;
    
      let query = con.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
      });
    });
    
    
    
    //--------------------------------------------------UPDATE---------------------------------------------//
    
    /**
     * Update Messages
     *
     * @return response()
     */
     app.put('/messages/:id',(req, res) => {
      var ladate= new Date();
      var strDate = ladate.getFullYear()+"-"+(ladate.getMonth()+1)+"-"+ladate.getDate();
  
        let sqlQuery = "UPDATE messages SET date='"+ strDate +"', content='"+req.body.content+"', id_user=1, id_room=1 WHERE id="+req.params.id;
        
        let query = con.query(sqlQuery, (err, results) => {
          if(err) throw err;
          res.send(apiResponse(results));
        });
      });
    
    
    
    //--------------------------------------------------DELETE---------------------------------------------//
    
    /**
     * Delete Messages
     *
     * @return response()
     */
     app.delete('/messages/:id',(req, res) => {
        let sqlQuery = "DELETE FROM messages WHERE id="+req.params.id+"";
          
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
    
  
  //Router to GET specific learner detail from the MySQL database
  app.get('/messages/:id' , (req, res) => {
      mysqlConnection.query('SELECT * FROM messages WHERE id_room = ?',[req.params.id], (err, rows, fields) => {
      if (!err)
          res.send(rows);
      else
          console.log(err);
      })
  });
  }