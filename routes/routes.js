
module.exports = function (app) {
  var express = require('express');
  var router = express.Router();
  var path = require("path");
  var con = require('../app/dbCon');
  var mysql = require('mysql');
  const bcrypt = require('bcrypt');

  var select = "SELECT username FROM logins";
  app.get('/login', function (req, res, next) {
    res.render('login.ejs');
    return next;
  });

  /*
  ** This is the post for unsecure login. 
  ** No encryption, no prepared statement. 
  */
  app.post('/login2', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var sql = "SELECT count(*) as Count FROM logins WHERE username = '" + username + "' AND password = '" + password + "';"

    con.query(sql, function (err, result) {
      if (err) throw err

      if (result[0].Count > 0) {
        res.render("loggedIn.ejs", {
          username: username
        });
      } else {
        res.render("login.ejs")
      }
    });
  });

  /*
  ** This is the post for secure login.
  ** No encryption, using prepared statement. 
  */
  app.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var sql = "SELECT count(*) as Count FROM logins WHERE username = ? AND password = ?";

    con.query(sql, [username, password], function (err, result) {
      if (err) throw err

      if (result[0].Count > 0) {
        res.render("loggedIn.ejs", {
          username: username
        });
      } else {
        res.render("login.ejs")
      }
    });
  });

  app.post("/create", function (req, res) {
    console.log("In create!");

    var username = req.body.username;
    var password = req.body.password;


    var sql = "INSERT INTO logins (username, password) VALUES ('" + username + "','" + password + "');"

    con.query(sql, function (err, result) {
      if (err) throw err
      console.log("Created");
      //res.send('User name: ' + username + ' - Password: ' + hash + ' - has been created...')
      res.redirect("/login");

    });
  });

  app.post('/login1', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var select = "SELECT password FROM logins WHERE username = ?";

    con.query(select, [username], function (err, result) {
      if (err) {
        res.send(err);
      }
      if (result[0] == undefined) {
        res.render("login.ejs")
      }
      else {
        var hash = result[0].password;
        bcrypt.compare(password, hash, function (err, result) {
          if (err) res.send(err);
          if (result) {
            res.render("loggedIn.ejs", {
              username: username
            });
          } else { res.render("login.ejs"); }
        });
      }
    });
  });


  app.post("/create1", function (req, res) {
    console.log("In create!");

    var username = req.body.username;
    var password = req.body.password;


    bcrypt.hash(password, 10, function (err, hash) {
      var sql = "INSERT INTO logins (username, password) VALUES ?;"
      var user = [
        [username, hash]
      ];
      con.query(sql, [user], function (err, result) {
        if (err) throw err
        console.log("Created");
        //res.send('User name: ' + username + ' - Password: ' + hash + ' - has been created...')
        res.redirect("/login");
      });
    });
  });


  app.post("/submit", function (req, res) {
    if (checkUser(req.body.username)) {
      res.redirect('/loggedIn');
    } else { res.render('login.ejs'); }
    console.log(req.body.username);
  })

  app.get('/loggedIn', function (req, res) {
    res.render('loggedIn.ejs', { user: req.username });
  })




  function checkUser(username) {
    var dbUser = "SELECT * FROM logins WHERE username =" + mysql.escape(username);
    //var dbUser1 = "SELECT * FROM logins WHERE username = 'uname'";
    //var dbPassword = "SELECT password FROM logins WHERE password = 'password'";
    //var dbAll = "Select * FROM logins";
    console.log("Username: " + uname);
    var select = "SELECT * FROM logins";
    con.query(dbUser, function (err, result) {
      if (err) throw err;
      console.log(result);
    });
    /*if(uName == username) {
      return true;
    } return false;*/
  }
}




  /*
  router.post('/submit', function(req, res){
    var username = req.body.username;
    var checkUser = "SELECT username FROM logins WHERE username = 'username'";
    if(req.body.username == "Louise")
    {
    res.sendFile(path.join(__dirname+'/loggedIn.html'));
    }else{res.sendFile(path.join(__dirname+'/login.html'));}
    console.log(req.body.username);
  })
  
  var select = "SELECT * FROM logins";
  router.get('/loggedIn',function(req,res){
    res.sendFile(path.join(__dirname+'/loggedIn.html'));
    //__dirname : It will resolve to your project folder.
    
  });
  
  
  });
  */

//module.exports = router;