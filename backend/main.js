var express = require('express');
var http = require('http');
var url = require('url');
var mysql = require('mysql');
var mutipart= require('connect-multiparty');

var CronJob = require('cron').CronJob;

var genpdf = require('./genpdf');
var util = require('./util');
var common = require('./common');
var student = require('./student');
var tw = require('./tw');
var expert = require('./expert');
var system = require('./system');
var test = require('./test');

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

app.get('/getExpertByCategory', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    common.getExpertByCategory(db, info, res);
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

app.get('/expertGetApplicationByAssessmentState', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.expertGetApplicationByAssessmentState(db, info, res);
});

app.get('/expertSetApplicationScore', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    expert.expertSetApplicationScore(db, info, res);
});

app.get('/expertAcceptAssessment', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
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

app.get('/download', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    system.download(info, res);
});

app.get('/delete', mutipartMiddeware, (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    system.delete(info, res);
});

//生成PDF
app.get('/generatePdf', (req, res) => {
    var info = JSON.parse(url.parse(req.url, true).query.info);
    genpdf.generatePdf(db, info, res);
});

//定时检测
new CronJob('0 */5 * * * *', system.joinEnd(db));
new CronJob('0 */5 * * * *', system.auditEnd(db));
new CronJob('0 */5 * * * *', system.scoreEnd(db));

//测试
//test.test();