require('./db/connect');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var itemRoutes = require('./routes/item');
var app = express();
var server = http.Server(app);

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', itemRoutes);
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

server.listen(process.env.PORT || 8080);

exports.app = app;
