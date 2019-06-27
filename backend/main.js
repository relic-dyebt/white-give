var express = require('express');
var http = require('http');
var url = require('url');
var Database = require('./database');

var app = express();

http.createServer(app).listen(30000);

app.get('/', (req, res) => {
    var pathname = url.parse(req.url, true).pathname;
    var query = url.parse(req.url, true).query;
    //var db = new Database();

    var data = { msg: 'ok' }
    res.send(data);

    //db.init();
    //db.queryStudent();
});