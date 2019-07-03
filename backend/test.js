var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports.test = function() {

    //SMTP客户端对象
    var send = nodemailer.createTransport(smtpTransport({
        service: '163',
        auth: {
            user: 'goodapple8946@163.com',
            pass: 'whitegive123'
        }
    }));

    var email = 'goodapple8946@163.com';
    var expertId = 2;
    var applicationId = 40;
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