var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var util = require('./util');

//系统给参与评审的专家发送评审邀请
module.exports.inviteExpert = function(db, applicationId) {
    console.log('System - Invite expert\n' + util.getTime());

    //搜索申请
    var sql = 'SELECT * FROM Application WHERE id = ?';
    var sqlParams = [ applicationId ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            //搜索专家
            var sql = 'SELECT * FROM Expert WHERE category = ? ORDER BY RAND()';
            var sqlParams = [ data[0].category ];
            console.log(sql + '\n' + sqlParams.toString() + '\n');

            db.query(sql, sqlParams, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    //发送邮件
                    var msg = '邀请您来参加评审吧，为学校的科技工作出一份力！';
                    var send = nodemailer.createTransport(smtpTransport({
                        service: '163',
                        auth: {
                            user: 'goodapple8946@163.com',
                            pass: 'whitegive123'
                        }
                    }));
                    for (var i = 0; i < 3 && i < data.length; i++) {
                        console.log(i);
                        send.sendMail({
                            from: 'goodapple8946@163.com',
                            to: data[i].email,
                            subject: '科技作品评审',
                            html: msg
                        }, (err, res) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Send invatation to expert successfully.')
                            }
                        });
                    }
                }
            });
        }
    });
}

