var express = require('express');
var http = require('http');
var url = require('url');
var Database = require('./database');

var app = express();
var db = new Database();

db.init();

http.createServer((req, res) => {

    var pathname = url.parse(req.url, true).pathname;
    var query = url.parse(req.url, true).query;

    db.queryStudent(res);

}).listen(30000);