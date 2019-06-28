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
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.register(db, info, res);
});

app.get('/studentLogin', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.login(db, info, res);
});

app.get('/submitApplication', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.submitApplication(db, info, res);
});

//校团委
app.get('/createMatch', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.createMatch(db, info, res);
});