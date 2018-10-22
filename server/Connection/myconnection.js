const mysql = require('mysql');
var conn = mysql.createConnection({
  host: "68.66.200.221",
  user: "openmind_user",
  password:"P@$$w0rd",
  port:"3306",
  database:"openmind_Namaa",
  multipleStatements: true
});

module.exports.myConnection=conn;