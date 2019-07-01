var express = require('express');
var http = require('http');
var url = require('url');
var mysql = require('mysql');
var mutipart= require('connect-multiparty');

var util = require('./util');
var common = require('./common');
var student = require('./student');
var tw = require('./tw');
var expert = require('./expert');
var system = require('./system');
var genpdf = require('./genpdf');
var path = require('path');
var fs = require('fs');
var app = express();
var mutipartMiddeware = mutipart();

var db = mysql.createConnection({
    host: 'cdb-cp9aouco.bj.tencentcdb.com',
    port: '10122',
    user: 'root',
    password: '123456+1s',
    database: 'white-give'
});

db.connect();

http.createServer(app).listen(30000);

console.log('Server is running.\n' + util.getTime() + '\n');

//跨域
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//上传文件路径
app.use(mutipart({
    uploadDir:'/var/ftp/pub/data/temp'
}));

//通用
app.get('/getMatchByDate', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    common.getMatchByDate(db, info, res);
});

app.get('/getWorkById', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    common.getWorkById(db, info, res);
});

app.get('/getApplicationById', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    common.getApplicationById(db, info, res);
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
    expert.expertSetPassword(db, info, res);
});

app.get('/expertGetApplicationByState', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.expertGetApplicationByState(db, info, res);
});

app.get('/expertSetApplicationScore', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.expertSetApplicationScore(db, info, res);
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

//系统
app.post('/upload', mutipartMiddeware, (req, res) => {
    system.upload(req.files, res);
});

app.get('/deleteByUrl', mutipartMiddeware, (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    system.deleteByUrl(info, res);
});

app.get('/downloadFile', (req, res)=> {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    var fileName = info.fileName;
    var filePath = path.join(__dirname, fileName);
    var stats = fs.statSync(filePath);
    if(stats.isFile()){
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename='+fileName,
            'Content-Length': stats.size
        });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.end(404);
    }
});

//生成PDF
app.get('/getPdfApplication', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    genpdf.getPdfApplication(db, info, res);