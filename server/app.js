require('dotenv').config();

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const db = require('./db');

const views = require('./routes/views');
const api = require('./routes/api');

const app = express();
db.init();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', views);
app.use('/api', api);
app.use('/static', express.static('public'));

// 404 route
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// route error handler
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message,
  });
});

// port config
const port = 5000; 
const server = http.Server(app);

server.listen(port, function() {
  console.log('Server running on port: ' + port);
});
