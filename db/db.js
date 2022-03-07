const mysql = require('mysql');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
});

queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results, fields) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    })
  });
};

getUsers = async function () {
  return queryAsync(`
    SELECT * FROM users
  `);
}
module.exports = {
  getUsers: getUsers
}