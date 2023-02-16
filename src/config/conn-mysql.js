const mysql = require('mysql2/promise')
require('dotenv').config()

exports.connMysql = async () => {
  const conn = await mysql.createConnection({
    connectTimeout: 10000,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  })

  return conn
}
