
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
 * Create New Messages
 *
 * @return response()
 */
create = function (aut, contenu) {
  return new Promise(function(resolve, reject){
    var ladate= new Date();
    var strDate = ladate.getFullYear()+"-"+(ladate.getMonth()+1)+"-"+ladate.getDate();
    var idUser = getIdByPseudo(aut);

    let sqlQuery = "INSERT INTO messages(date, content, user_id, room_id) VALUES ('" + strDate + "','" + contenu + "', " + idUser + ", 1)";
    con.query(sqlQuery, (err, result) => {
      if (err){
        return reject(err);
      }
      return resolve(result.insertId); 
    });
  })
};

//--------------------------------------------------READ---------------------------------------------//

/**
 * Get All Messages
 *
 * @return response()
 */
select = function () {
  return new Promise(function(resolve, reject){
    let sqlQuery = "SELECT content, users.pseudo FROM messages INNER JOIN users ON messages.user_id=users.user_id ORDER BY message_id DESC LIMIT 10; ";
    con.query(sqlQuery, (err, results) => {
      if (err){
        return reject(err);
      }

      return resolve(results.map(row => Object.assign({}, row)));
    });
  })
};

/**
 *  Get specific Messages by ID room
 *
 * @return response()
 */
selectByIdRoom = function (id) {
  return new Promise(function(resolve, reject){
    let mess = [];
    let sqlQuery = "SELECT users.pseudo, content, room_id  FROM messages INNER JOIN users ON messages.user_id=users.user_id WHERE room_id =" + id + " ORDER BY message_id DESC LIMIT 10;";
    con.query(sqlQuery, (err, results) => {
      if (err){
        return reject(err);
      }
 
      return resolve(results.map(row => Object.assign({}, row)));
    });
  })
},

  
//--------------------------------------------------UPDATE---------------------------------------------//

/**
 * Update Messages
 *
 * @return response()
 */
updateMessageById = function (id, nouveauMessage)  {
    return new Promise(function(resolve, reject){
      var ladate= new Date();
      var strDate = ladate.getFullYear()+"-"+(ladate.getMonth()+1)+"-"+ladate.getDate();
      let sqlQuery = "UPDATE messages SET date='"+ strDate +"', content='"+nouveauMessage+"', user_id=1, room_id=1 WHERE message_id="+id+";";
      con.query(sqlQuery, (err, results) => {
        if (err){
          return reject(err);
        }
        return resolve(results.map(row => Object.assign({}, row)));
      });
    })
  };

  //--------------------------------------------------DELETE---------------------------------------------//
  
  /**
   * Delete Messages
   *
   * @return response()
   */
  deleteMsg = function (id) {
    return new Promise(async function(resolve, reject){
      let sqlQuery = "DELETE FROM messages WHERE message_id="+req.params.id+"";
      con.query(sqlQuery, (err, results) => {
        if (err){
          return reject(err);
        }
        return resolve(results.map(row => Object.assign({}, row)));
      });
    })
    

  }

module.exports = {
  create: create,
  select: select,
  selectByIdRoom: selectByIdRoom,
  updateMessageById: updateMessageById,
  deleteMsg: deleteMsg,
}