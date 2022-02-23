const mysql = require("mysql");

//création d'une connection a la bdd
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
});
const io = require("socket.io")(server);
module.exports = {
//--------------------------------------------------CREATE---------------------------------------------//

/**
 * Create New Messages
 *
 * @return response()
 */
 create: function (aut, contenu) {
  var ladate= new Date();
  var strDate = ladate.getFullYear()+"-"+(ladate.getMonth()+1)+"-"+ladate.getDate();
  var i = getIdByPseudo(aut);
  con.query("INSERT INTO messages(date, content, id_user, id_room) VALUES ('" + strDate + "','" + contenu + "', " + i + ", 1)", function (err, result) {
      if (err) throw err;
      console.log(result);
  });
},
  
  
  
  //--------------------------------------------------READ---------------------------------------------//
  
  /**
   * Get All Messages
   *
   * @return response()
   */
  
   select: function () {
    con.query("SELECT content, users.pseudo FROM messages INNER JOIN users ON messages.id_user=users.user_id ORDER BY message_id DESC LIMIT 10; ", function (err, rows, fields) {
        const reversed = rows.reverse();
        reversed.forEach(function (row) {
            //console.log("<strong>" + row.pseudo + "</strong>: " + row.content + "<br/>");
            io.sockets.emit('new message', { msg: row.content, user: row.pseudo });
        });
    });
  },

  /**
   *  Get specific Messages by ID room
   *
   * @return response()
   */
  
   selectByIdRoom: function (id) {
    con.query("SELECT users.pseudo, content, id_room  FROM messages INNER JOIN users ON messages.id_user=users.user_id WHERE id_room =" + id + " ORDER BY message_id DESC LIMIT 10;", function (err, rows, fields) {
        const reversed = rows.reverse();
        reversed.forEach(function (row) {
            //console.log("<strong>" + row.pseudo + "</strong>: " + row.content + "<br/>");
            io.sockets.emit('new message', { msg: row.content, user: row.pseudo });
        });
    });
  },
  
  
  
  //--------------------------------------------------UPDATE---------------------------------------------//
  
  /**
   * Update Messages
   *
   * @return response()
   */
   updateMessageById: function (id, nouveauMessage)  {
    var ladate= new Date();
    var strDate = ladate.getFullYear()+"-"+(ladate.getMonth()+1)+"-"+ladate.getDate();

      let sqlQuery = "UPDATE messages SET date='"+ strDate +"', content='"+nouveauMessage+"', id_user=1, id_room=1 WHERE message_id="+id;
      
      con.query(sqlQuery, (err, results) => {
        if(err) throw err;
        res.send(apiResponse(results));
      });
    },
  
  
  
  //--------------------------------------------------DELETE---------------------------------------------//
  
  /**
   * Delete Messages
   *
   * @return response()
   */

  delete: function (id) {

    let sqlQuery = "DELETE FROM messages WHERE message_id="+req.params.id+"";

    con.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });

  }
  
}

/* //inserer auteur et message dans une bdd
function insertMsg(auteur, contenu) {
  var ladate= new Date();
  var strDate = ladate.getFullYear()+"-"+(ladate.getMonth()+1)+"-"+ladate.getDate();
  con.query("SELECT user_id FROM ", function (err, rows, fields) {
      const reversed = rows.reverse();
      reversed.forEach(function (row) {
          //console.log("<strong>" + row.pseudo + "</strong>: " + row.content + "<br/>");
          io.sockets.emit('new message', { msg: row.content, user: row.pseudo });
      });
  });
  con.query("INSERT INTO messages(date, content, id_user, id_room) VALUES ('" + strDate + "','" + contenu + "', 1, 1)", function (err, result) {
      if (err) throw err;
      console.log(result);
  });
}

//
//recupere les 10 derniers messages
function select() {
  con.query("SELECT content, users.pseudo FROM messages INNER JOIN users ON messages.id_user=users.user_id ORDER BY message_id DESC LIMIT 10; ", function (err, rows, fields) {
      const reversed = rows.reverse();
      reversed.forEach(function (row) {
          //console.log("<strong>" + row.pseudo + "</strong>: " + row.content + "<br/>");
          io.sockets.emit('new message', { msg: row.content, user: row.pseudo });
      });
  });
}; */