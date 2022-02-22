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
    let sqlQuery = "SELECT content, users.pseudo FROM messages INNER JOIN users ON messages.id_user=users.user_id ORDER BY message_id DESC LIMIT 10; ";
  
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
    let sqlQuery = "SELECT * FROM messages WHERE id_room =" + req.params.id;
  
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
      
      let query = conn.query(sqlQuery, (err, results) => {
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
        
      let query = conn.query(sqlQuery, (err, results) => {
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


//CREATE

//
//inserer auteur et message dans une bdd
function insertMsg(auteur, contenu) {
    var ladate= new Date();
    var strDate = ladate.getFullYear()+"-"+(ladate.getMonth()+1)+"-"+ladate.getDate();
    con.query("INSERT INTO messages(date, content, id_user, id_room) VALUES ('" + strDate + "','" + contenu + "', 1, 1)", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}

//READ

//
//recupere les 3 derniers messages
function select() {
    con.query("SELECT * FROM message ORDER BY ID DESC LIMIT 10", function (err, rows, fields) {
        rows.forEach(function (row) {
            console.log("<strong>" + row.auteur + "</strong>: " + row.contenu + "<br/>");
        });
    });
};

//UPDATE

//
//recupere les 3 derniers messages
function select() {
    con.query("SELECT * FROM message ORDER BY ID DESC LIMIT 10", function (err, rows, fields) {
        rows.forEach(function (row) {
            console.log("<strong>" + row.auteur + "</strong>: " + row.contenu + "<br/>");
        });
    });
}; 
}