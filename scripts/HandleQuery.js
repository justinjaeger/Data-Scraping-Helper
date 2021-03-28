require('dotenv').config()
const mysql = require('mysql');

module.exports = async function handler(sql) {

  return new Promise( async (resolve, reject) => {
    // const con = mysql.createConnection({
    //   host: process.env.MYSQL_HOST,
    //   database: process.env.MYSQL_DATABASE,
    //   user: process.env.MYSQL_USER,
    //   password: process.env.MYSQL_PASSWORD,
    // });
    const con = mysql.createConnection({
      host: process.env.DO_HOST,
      database: process.env.DO_DATABASE,
      user: process.env.DO_USER,
      password: process.env.DO_PASSWORD,
      port: process.env.DO_PORT,
    });

    con.connect(function(err) {
      if (err) throw err;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
          console.log('error', err)
        };
        resolve(result)
        con.end(); // end connection
      });
    });
  });
};
