var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var toPdf = require("office-to-pdf");

var util = require('./util');

//学生报名开始
module.exports.joinStart = function(db) {

    console.log(util.getTime());

    //修改比赛
    sql = 'UPDATE `Match` SET state = "joining" WHERE state = "created" AND joinTime < ?';
    sqlParams = [ util.getTime() ];
    db.query(sql, sqlParams, err => { if (err) console.log(err); });
}

//学生报名结束、校团委初审开始
module.exports.joinEnd = function(db) {

    //修改比赛
    sql = 'UPDATE `Match` SET state = "auditing" WHERE state = "joining" AND auditTime < ?';
    sqlParams = [ util.getTime() ];
    db.query(sql, sqlParams, err => { if (err) console.log(err); });

    //修改申请
    sql = 'UPDATE Application SET state = "auditing" WHERE state = "submitted" AND matchId IN (SELECT `Match`.id FROM `Match` WHERE auditTime < ?)';
    sqlParams = [ util.getTime() ];
    db.query(sql, sqlParams, err => { if (err) console.log(err); });
}

//校团委初审结束、专家审核开始
module.exports.auditEnd = function(db) {
    
    //修改比赛
    sql = 'UPDATE `Match` SET state = "scoring" WHERE state = "auditing" AND scoreTime < ?';
    sqlParams = [ util.getTime() ];
    db.query(sql, sqlParams, err => { if (err) console.log(err); });

    //修改申请
    sql = 'UPDATE Application SET state = "refused" WHERE state = "auditing" AND matchId IN (SELECT `Match`.id FROM `Match` WHERE scoreTime < ?)'
    sqlParams = [ util.getTime() ];
    db.query(sql, sqlParams, err => { if (err) console.log(err); });
}

//专家审核结束
module.exports.scoreEnd = function(db) {

    //修改比赛
    sql = 'UPDATE `Match` SET state = "scored" WHERE state = "scoring" AND endTime < ?';
    sqlParams = [ util.getTime() ];
    db.query(sql, sqlParams, err => err && console.log(err));

    //专家自动拒绝评审
    sql = 'UPDATE Assessment SET state = "refused" WHERE state = "auditing" AND applicationId IN (SELECT Application.id FROM Application WHERE matchId IN (SELECT `Match`.id FROM `Match` WHERE endTime < ?))'
    sqlParams = [ util.getTime() ];
    db.query(sql, sqlParams, err => err && console.log(err));

    //申请评审完成
    sql = 'UPDATE Application SET state = "scored" WHERE state = "scoring" AND matchId IN (SELECT `Match`.id FROM `Match` WHERE endTime < ?)'
    sqlParams = [ util.getTime() ];
    db.query(sql, sqlParams, err => err && console.log(err));
}

//邀请专家参与评审
module.exports.inviteExpert = function(db, info, num) {
    console.log('System - Invite expert\n' + util.getTime());

    //搜索申请
    var sql = 'SELECT * FROM Application WHERE id = ?';
    var sqlParams = [ info.applicationId ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var matchId = data[0].matchId;
            var category = data[0].category;
            var applicationId = data[0].applicationId;

            //搜索比赛
            var sql = 'SELECT * FROM `Match` WHERE id = ?';
            var sqlParams = [ matchId ];
            db.query(sql, sqlParams, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    var name = data[0].name;

                    //搜索专家（随机顺序）
                    var sql = 'SELECT * FROM Expert WHERE category = ? ORDER BY RAND()';
                    var sqlParams = [ category ];
                    db.query(sql, sqlParams, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //SMTP客户端对象
                            var send = nodemailer.createTransport(smtpTransport({
                                service: '163',
                                auth: {
                                    user: 'goodapple8946@163.com',
                                    pass: 'whitegive123'
                                }
                            }));
                            for (var i = 0; i < num && i < data.length; i++) {
                                var email = data[i].email;
                                var expertId = data[i].id;

                                //插入评审
                                var sql = 'INSERT INTO Assessment ' + util.values(6);
                                var sqlParams = [ 0, expertId, info.applicationId, 'accepted', 0, '' ];
                                db.query(sql, sqlParams, err => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var acceptUrl = 'http://58.87.72.138:30000/expertAcceptAssessment?info={"expertId":"' + expertId + '","applicationId":"' + applicationId + '","accept":"' + true + '"}';
                                        var refuseUrl = 'http://58.87.72.138:30000/expertAcceptAssessment?info={"expertId":"' + expertId + '","applicationId":"' + applicationId + '","accept":"' + false + '"}';
                                        
                                        //邮件对象
                                        var mail = {
                                            from: 'goodapple8946@163.com',
                                            to: email,
                                            subject: '比赛评审工作邀请',
                                            html:
                                            '<p>北航校团委邀请您参与评审工作！</p>' +
                                            '<p>接受：</p>' + 
                                            '<p>' + acceptUrl + '</p>' +
                                            '<p>拒绝：</p>' + 
                                            '<p>' + refuseUrl + '</p>'
                                        };

                                        //发送邮件
                                        send.sendMail(mail, err => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log('Invite expert successfully.')
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}

//上传文件
module.exports.upload = function(files, res) {
    console.log('System - Upload\n' + util.getTime());

    var ret = { err: null, msg: null, documentUrl: [], pictureUrl: [], videoUrl: [] };

    //移动并重命名文件
    for (var i in files) {
        if (files[i].path) {
            var file = files[i];
            var oldPath = file.path;
            var newPath = file.path.replace('temp', 'work');
            fs.rename(oldPath, newPath, err => { if (err) console.log(err); });
            if (file.fieldName == 'document' && file.originalFilename != '')
                ret.documentUrl.push(newPath);
            else if (file.fieldName == 'image' && file.originalFilename != '')
                ret.pictureUrl.push(newPath);
            else if (file.fieldName == 'video' && file.originalFilename != '')
                ret.videoUrl.push(newPath);
        }
        else
            for (var j in files[i]) {
                var file = files[i][j];
                var oldPath = file.path;
                var newPath = file.path.replace('temp', 'work');
                fs.rename(oldPath, newPath, err => { if (err) console.log(err); });
                ret.pictureUrl.push(newPath);
            }
    }
    ret.err = false;
    ret.msg = 'File upload accomplished.';
    res.send(JSON.stringify(ret));
}

//下载文件
module.exports.download = function(info, res) {
    console.log('System - Download\n' + util.getTime());

    //添加到压缩文件
    var urls = info.url.split(';');
    var zip = new JSZip();
    for (var i in urls) {
        zip.file(urls[i].replace('/var/ftp/pub/data/work',''), fs.readFileSync(urls[i]));
    }
    var data = zip.generate({
        type: 'nodebuffer',
        compression:'DEFLATE',
        streamFiles: true
    });
    res.send(data);
}

//根据URL删除文件
module.exports.deleteByUrl = function(info, res) {
    console.log('System - Delete\n' + util.getTime());

    //删除文件
    fs.unlink(info.url, err => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Remove failed.';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Upload Successfully.';
            res.send(JSON.stringify(ret));
        }
    });
}

//生成PDF
module.exports.generatePdf = function (db, applicationId) {
    console.log('System - Generate PDF\n' + util.getTime());
    
    var content = fs.readFileSync(path.join(__dirname, '../data/template/doc.docx'), 'binary');
    var zip = new JSZip(content);
    var doc = new Docxtemplater();
    
    //搜索申请
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Application WHERE id = ?';
    var sqlParams = [ applicationId ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var application = data[0];
            doc.loadZip(zip);
            doc.setData({
                "id": application.id,
                "department": application.department,
                "appCategory": application.appCategory,
                "name": application.name,
                "studentNumber": application.studentNumber,
                "birthday": application.birthday,
                "eduBackground": application.eduBackground,
                "major": application.major,
                "enrollmentYear": application.enrollmentYear,
                "workName": application.workName,
                "address": application.address,
                "phone": application.phone,
                "email": application.email,
                "c1Name": application.c1Name,
                "c1StudentNumber": application.c1StudentNumber,
                "c1EduBackground": application.c1EduBackground,
                "c1Email": application.c1Email,
                "c1Phone": application.c1Phone,
                "c2Name": application.c2Name,
                "c2StudentNumber": application.c2StudentNumber,
                "c2EduBackground": application.c2EduBackground,
                "c2Email": application.c2Email,
                "c2Phone": application.c2Phone,
                "c3Name": application.c3Name,
                "c3StudentNumber": application.c3StudentNumber,
                "c3EduBackground": application.c3EduBackground,
                "c3Email": application.c3Email,
                "c3Phone": application.c3Phone,
                "c4Name": application.c4Name,
                "c4StudentNumber": application.c4StudentNumber,
                "c4EduBackground": application.c4EduBackground,
                "c4Email": application.c4Email,
                "c4Phone": application.c4Phone,
                "category": application.category,
                "introduction": application.introduction,
                "innovation": application.innovation,
                "keyword": application.keyword,
                "displayForm": application.displayForm,
                "surveyMethod": application.surveyMethod
            });
            doc.render();
            var buf = doc.getZip().generate({ type: 'nodebuffer' });
            var url = '/var/ftp/pub/data/application/' + application.studentNumber + '_' + application.name + '_' + application.id + '.pdf';
            
            toPdf(buf).then(pdfBuffer => {
                fs.writeFileSync(url, pdfBuffer);
                //更新申请
                var sql = 'UPDATE Application SET pdfUrl = ? WHERE id = ?';
                var sqlParams = [ url, applicationId ];
                db.query(sql, sqlParams, err => console.log(err || 'PDF generated.'));
            });
        }
    });
}
