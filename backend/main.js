var express = require('express');
var http = require('http');
var url = require('url');
var mysql = require('mysql');
var mutipart = require('connect-multiparty');
var fs = require('fs');
var schedule = require('node-schedule');

var util = require('./util');
var common = require('./common');
var student = require('./student');
var tw = require('./tw');
var expert = require('./expert');
var system = require('./system');

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
app.use((req, res, next) => {
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
app.get('/getMatch', (req, res) => {
    common.getMatch(db, res);
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

app.get('/studentLogout', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.logout(db, info, res);
});

app.get('/studentModifyInfo', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.modifyInfo(db, info, res);
});

app.get('/studentSetPassword', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.studentSetPassword(db, info, res);
});

app.get('/submitApplication', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.submitApplication(db, info, res);
});

app.get('/studentGetApplication', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    student.studentGetApplication(db, info, res);
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

app.get('/expertLogout', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.logout(db, info, res);
});

app.get('/expertModifyInfo', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.modifyInfo(db, info, res);
});

app.get('/expertSetPassword', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.expertSetPassword(db, info, res);
});

app.get('/expertGetApplication', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.expertGetApplication(db, info, res);
});

app.get('/expertSetAssessment', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.expertSetAssessment(db, info, res);
});

app.get('/expertAcceptAssessment', (req, res) => {
    var info = url.parse(req.url, true).query;
    expert.expertAcceptAssessment(db, info, res);
});

//校团委
app.get('/twLogin', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.login(db, info, res);
});

app.get('/twLogout', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.logout(db, info, res);
});

app.get('/createMatch', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.createMatch(db, info, res);
});

app.get('/deleteMatchById', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.deleteMatchById(db, info, res);
});

app.get('/setMatchResultUrlById', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.setMatchResultUrlById(db, info, res);
});

app.get('/getApplicationByState', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.getApplicationByState(db, info, res);
});

app.get('/setApplicationState', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.setApplicationState(db, info, res);
});

app.get('/setApplicationScore', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.setApplicationScore(db, info, res);
});

app.get('/getExpertByApplication', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.getExpertByApplication(db, info, res);
});

app.get('/getExpertByCategory', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    tw.getExpertByCategory(db, info, res);
});

app.get('/getExpert', (req, res) => {
    tw.getExpert(db, res);
});

app.post('/uploadMatchResult', mutipartMiddeware, (req, res) => {
    tw.uploadMatchResult(req.files, res);
});

//系统
app.post('/upload', mutipartMiddeware, (req, res) => {
    system.upload(req.files, res);
});

app.get('/download', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    system.download(info, res);
});

app.get('/delete', mutipartMiddeware, (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    system.delete(info, res);
});

app.get('/inviteExpert', mutipartMiddeware, (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    system.inviteExpert(db, info, res);
});

app.get('/getFile', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    var stats = fs.statSync(info.url);
    var block = info.url.split('/');
    var suffix = block[block.length - 1];
    if(stats.isFile()){
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=download.' + suffix,
            'Content-Length': stats.size
        });
        fs.createReadStream(info.url).pipe(res);
    } else {
        res.end(404);
    }
});

//定时检测
function scheduleCronstyle() {
    schedule.scheduleJob('* * * * * *', () => system.joinTimeCheck(db)); 
    schedule.scheduleJob('* * * * * *', () => system.auditTimeCheck(db)); 
    schedule.scheduleJob('* * * * * *', () => system.scoreTimeCheck(db)); 
    schedule.scheduleJob('* * * * * *', () => system.endTimeCheck(db)); 
}
scheduleCronstyle();