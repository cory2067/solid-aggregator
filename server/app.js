require('dotenv').config();

const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const express = require('express');
const db = require('./db');
const fs = require('fs');

const options = {
    cert: fs.readFileSync('./fullchain.pem'),
    key: fs.readFileSync('./privkey.pem')
};

const views = require('./routes/views');
const api = require('./routes/api');

const app = express();
db.init();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use('/', views);
app.use('/api', api);
app.use('/static', express.static('public'));

app.use(express.static('../client/build'))
app.get('*', function (req, res) {
    res.sendFile('/home/cjl2625/solid-aggregator/client/build/index.html');
});


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

const httpsServer = https.createServer(options, app);

httpsServer.listen(443, function() {
  console.log('Server running on port: ' + 443);
});

// set up plain http server
const redir = express();
redir.get('*', function(req, res) {
    res.redirect('https://' + req.headers.host + req.url);
});

const httpServer = http.createServer(redir);
httpServer.listen(80);
