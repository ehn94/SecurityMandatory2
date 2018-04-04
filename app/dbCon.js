var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "securityloginsys"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var insert = "INSERT INTO logins (username, password) VALUES ('Louise', '1234')";
    var select = "SELECT * FROM logins";
    /*con.query(insert, function (err, result) {
      if (err) throw err;
      console.log(result);
    });*/

  });
  
  module.exports = con; 