var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');

var util = require('./util');

//邀请专家参与评审
module.exports.inviteExpert = function(db, info, res) {
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

            //搜索比赛
            var sql = 'SELECT * FROM `Match` WHERE id = ?';
            var sqlParams = [ matchId ];
            db.query(sql, sqlParams, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    var name = data[0].name;

                    //搜索专家
                    var sql = 'SELECT * FROM Expert WHERE category = ? ORDER BY RAND()';
                    var sqlParams = [ category ];
                    db.query(sql, sqlParams, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            var msg = '北航校团委邀请您参与比赛《' + name + '》的评审工作！';
                            var send = nodemailer.createTransport(smtpTransport({
                                service: '163',
                                auth: {
                                    user: 'goodapple8946@163.com',
                                    pass: 'whitegive123'
                                }
                            }));
                            for (var i = 0; i < 3 && i < data.length; i++) {
                                var email = data[i].email;
                                var expertId = data[i].id;

                                //插入评审
                                var sql = 'INSERT INTO Assessment ' + util.values(5);
                                var sqlParams = [ 0, expertId, info.applicationId, "auditing", 0 ];
                                db.query(sql, sqlParams, (err, data) => {
                                    if (err) {
                                        console.log(err);
                                    } else {

                                        //发送邮件
                                        send.sendMail({
                                            from: 'goodapple8946@163.com',
                                            to: email,
                                            subject: '比赛评审工作邀请',
                                            html: msg
                                        }, (err, res) => {
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

    //移动并重命名文件
    var ret = { err: null, msg: null };
    var oldPath = files.fileUpload.path;
    var newPath = oldPath.replace('/temp/', '/work/');

    fs.rename(oldPath, newPath, err => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Rename failed.';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Upload Successfully.';
            ret.url = newPath;
            res.send(JSON.stringify(ret));
        }
    });
}