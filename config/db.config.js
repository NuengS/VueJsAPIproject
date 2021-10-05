'use strict'
const mysql = require('mysql')
const dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hairsalonsss',
})
dbConn.connect((err) => {
  if (err) throw err
  console.log('Database Connected!')
})
module.exports = dbConn
