const mysql = require('mysql2')

const DB_CONNECTION = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
})

DB_CONNECTION.connect((err) => {
  if(err){
    console.error('Error al conectar a la base de datos: ', err)
    return
  }
  console.log('Conectado a la base de datos')
})

module.exports = 
DB_CONNECTION.promise()
