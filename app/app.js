var express = require('express');
const bodyParser = require('body-parser');
var helmet = require('helmet');
var validator = require('express-validator');

var app = express();

var dbCon = require('./dbCon');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(validator());
app.use(function (req, res, next) {
  for (var item in req.body) {
    req.sanitize(item).escape();
  }
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"]
  }
}));

require('../routes/routes')(app);

app.listen(3000, function () {
  console.log("Server started, listening on: " + 3000);
});

module.exports = app;