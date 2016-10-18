const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use('/', require('./import'));
app.use('/cache', require('./cache'));

const PORT = process.env.PORT || 5678;
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
