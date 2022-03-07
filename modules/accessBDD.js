const mysql = require("mysql");

//création d'une connection a la bdd
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
  });

  module.exports = {
    con
  }