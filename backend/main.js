var express = require('express');
var http = require('http');
var url = require('url');
var mysql = require('mysql');

var Student = require('./student');

var student = new Student();

var app = express();

var db = mysql.createConnection({
    host: 'cdb-cp9aouco.bj.tencentcdb.com',
    port: '10122',
    user: 'root',
    password: '123456+1s',
    database: 'white-give'
});

db.connect();

http.createServer(app).listen(30000);

app.get('/studentRegister', (req, res) => {
    var query = url.parse(req.url, true).query;
    student.register(db, query, res);
});