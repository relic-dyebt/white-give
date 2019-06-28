var express = require('express');
var http = require('http');
var url = require('url');
var mysql = require('mysql');

var Student = require('./student');
var Tw = require('./tw');

var student = new Student();
var tw = new Tw();

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

//学生
app.get('/studentRegister', (req, res) => {
    var query = url.parse(req.url, true).query;
    student.register(db, query, res);
});

app.get('/studentLogin', (req, res) => {
    var query = url.parse(req.url, true).query;
    student.login(db, query, res);
});

//校团委
app.get('/createMatch', (req, res) => {
    var query = url.parse(req.url, true).query;
    tw.createMatch(db, query, res);
});