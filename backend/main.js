var express = require('express');
var http = require('http');
var url = require('url');
var mysql = require('mysql');

var common = require('./common');
var student = require('./student');
var tw = require('./tw');
var expert = require('./expert');
var system = require('./system');
var genpdf = require('./genpdf');

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

console.log("Server is running.");

//跨域
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//通用
app.get('/getMatchByDate', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    common.getMatchByDate(db, info, res);
});

app.get('/getWork', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    common.getWork(db, info, res);
});

app.get('/getApplication', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    common.getApplication(db, info, res);
});

//学生
app.get('/studentRegister', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.register(db, info, res);
});

app.get('/studentLogin', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.login(db, info, res);
});

app.get('/studentSetPassword', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.studentSetPassword(db, info, res);
});

app.get('/submitApplication', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.submitApplication(db, info, res);
});

app.get('/submitWork', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.submitWork(db, info, res);
});

app.get('/studentGetApplicationByMatch', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.studentGetApplicationByMatch(db, info, res);
});

//专家
app.get('/expertRegister', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.register(db, info, res);
});

app.get('/expertLogin', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.login(db, info, res);
});

app.get('/expertSetPassword', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.expertSetPassword(db, info, res);
});

//校团委
app.get('/createMatch', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.createMatch(db, info, res);
});

app.get('/getApplicationByState', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.getApplicationByState(db, info, res);
});

app.get('/setApplicationState', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.setApplicationState(db, info, res);
});

app.get('/getPdfApplication',(req,res)=> {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    genpdf.getPdfApplication(db,info,res);
});