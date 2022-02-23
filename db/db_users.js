module.exports = {
  //--------------------------------------------------CREATE---------------------------------------------//

  /**
   * Create New User
   *
   * @return response()
   */

  create: function (pseudo, password) {
    let data = {
      pseudo: pseudo,
      password: password,
    };

    let sqlQuery = "INSERT INTO users SET ?";

    con.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  },

  //--------------------------------------------------READ---------------------------------------------//

  /**
   * Get All Users
   *
   * @return response()
   */

  getUsers: function () {
    let sqlQuery = "SELECT * FROM users";

    con.query(sqlQuery, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  },

  /**
   * Get specific user by ID
   *
   * @return response()
   */

  getUserById: function (id) {
    let sqlQuery = "SELECT * FROM users WHERE user_id =" + id;

    con.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  },

  /**
 * Get specific ID by PSEUDO
 *
 * @return response()
 */

  getIdByPseudo: function (pseudo) {

    let sqlQuery = "SELECT user_id FROM users WHERE pseudo =" + pseudo;

    con.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      console.log(results);

    });
  },

  //--------------------------------------------------UPDATE---------------------------------------------//

  /**
   * Update User
   *
   * @return response()
   */

  update: function (pseudo, password, id) {
    let sqlQuery = "UPDATE users SET pseudo='" + pseudo + "', password='" + password + "' WHERE id=" + id;

    con.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  },

  //--------------------------------------------------DELETE---------------------------------------------//

  /**
   * Delete User
   *
   * @return response()
   */

  delete: function (id) {
    let sqlQuery = "DELETE FROM users WHERE id=" + id + "";

    con.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      console.log(results);
    });
  }

};
