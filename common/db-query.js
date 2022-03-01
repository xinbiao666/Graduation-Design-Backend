const db_config = require('../config/db-config');
const mysql = require('mysql');

function querydb(sql) {
  return new Promise((resolve, reject) => {
    const pool = mysql.createPool(db_config);
    pool.getConnection(async (err, connect) => {
      if (err) {
        reject(`SQL error:${err}`);
      } else {
        connect.query(sql, function (err, result) {
          if (err) {
            reject(`SQL error:${err}`);
            connect.release(); // 释放连接池中的数据库连接
            pool.end();// 关闭连接池
          } else {
            resolve(result);
            connect.release(); // 释放连接池中的数据库连接
            pool.end();// 关闭连接池
          }
        });
      }
    });
  });
}

module.exports = { querydb }
