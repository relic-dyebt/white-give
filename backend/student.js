var util = require('./util');
var system = require('./system');

//学生注册
module.exports.register = function(db, info, res) {
    console.log('Student - Register\n' + util.getTime());

    //搜索学号或用户名
    var ret = { err: null, msg: null };
    var sql = 'SELECT COUNT(*) AS cnt FROM Student WHERE student_number = ? OR username = ?';
    var sqlParams = [ info.studentNumber, info.username ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else if (data[0].cnt > 0) {
            ret.err = true;
            ret.msg = 'Duplicate student number or username.';
            res.send(JSON.stringify(ret));
        } else {
            var sql = 
                'INSERT INTO Student(username, password, name, introduction, profile_url, phone, email, department, major, enrollment_year, student_number) ' +
                util.values(11);
            var sqlParams = [
                info.username,
                info.password,
                info.name,
                info.introduction,
                info.profileUrl,
                info.phone,
                info.email,
                info.department,
                info.major,
                info.enrollmentYear,
                info.studentNumber
            ];
            console.log(sql + '\n' + sqlParams.toString() + '\n');

            //插入学生
            db.query(sql, sqlParams, (err, data) => {
                if (err) {
                    ret.err = true;
                    ret.msg = 'Database error(INSERT).';
                    res.send(JSON.stringify(ret));
                } else {
                    ret.err = false;
                    ret.msg = 'Register successfully.';
                    res.send(JSON.stringify(ret));
                }
            });
        }
    });
}

//学生登录
module.exports.login = function(db, info, res) {
    console.log('Student - Login\n' + util.getTime());

    //搜索学号和密码
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Student WHERE student_number = ? AND `password` = ?';
    var sqlParams = [ info.studentNumber, info.password ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else if (data.length == 0) {
            ret.err = true;
            ret.msg = 'Wrong student number or password.';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Login successfully.';
            ret.data = data[0];
            res.send(JSON.stringify(ret));
        }
    });
}

//学生提交申请
module.exports.submitApplication = function(db, info, res) {
    console.log('Student - Submit application\n' + util.getTime());
    
    //插入申请
    var ret = { err: null, msg: null };
    var sql = 
        'INSERT INTO Application(department, application_category, name, student_number, birthday, educational_background, major, enrollment_year, work_name, address, phone, email, ' + 
        'c1_name, c1_student_number, c1_educational_background, c1_phone, c1_email, ' +
        'c2_name, c2_student_number, c2_educational_background, c2_phone, c2_email, ' +
        'c3_name, c3_student_number, c3_educational_background, c3_phone, c3_email, ' +
        'c4_name, c4_student_number, c4_educational_background, c4_phone, c4_email, ' +
        'category, introduction, innovation, keyword, state, match_id, work_id) ' +
        util.values(39);
    var sqlParams = [
        info.department,
        info.appCategory,
        info.name,
        info.student_number,
        info.birthday,
        info.eduBackground,
        info.major,
        info.enrollmentYear,
        info.workName,
        info.address,
        info.phone,
        info.email,
        info.c1Name, info.c1StudentNumber, info.c1eduBackground, info.c1Phone, info.c1Email,
        info.c2Name, info.c2StudentNumber, info.c2eduBackground, info.c2Phone, info.c2Email,
        info.c3Name, info.c3StudentNumber, info.c3eduBackground, info.c3Phone, info.c3Email,
        info.c4Name, info.c4StudentNumber, info.c4eduBackground, info.c4Phone, info.c4Email,
        info.category,
        info.introduction,
        info.innovation,
        info.keyword,
        info.state,
        info.matchId,
        info.workId
    ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(INSERT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Submit application successfully.';
            ret.applicationId = data.insertId;
            res.send(JSON.stringify(ret));

            //邀请专家，并创建评审表
            system.inviteExpert(db, data.insertId);
        }
    });
}

//学生提交作品
module.exports.submitWork = function(db, info, res) {
    console.log('Student - Submit work\n' + util.getTime());
    
    //插入作品
    var ret = { err: null, msg: null };
    var sql = 
        'INSERT INTO `Work`(student_number, application_id, document_url_list, picture_url_list, video_url_list) ' +
        util.values(5);
    var sqlParams = [
        info.studentNumber,
        info.applicationId,
        info.documentUrlList,
        info.pictureUrlList,
        info.videoUrlList
    ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(INSERT).';
            res.send(JSON.stringify(ret));
        } else {
            //更新相关申请
            var sql = 'UPDATE Application SET work_id = ? WHERE id = ?';
            var sqlParams = [ data.insertId, info.applicationId ];
            console.log(sql + '\n' + sqlParams.toString() + '\n');

            db.query(sql, sqlParams, (err, data) => {
                if (err) {
                    ret.err = true;
                    ret.msg = 'Database error(UPDATE).'
                    res.send(JSON.stringify(ret));
                } else {
                    ret.err = false;
                    ret.msg = 'Submit work successfully.';
                    ret.workId = data.insertId;
                    res.send(JSON.stringify(ret));
                }
            });
        }
    });
}

//学生根据比赛获取申请
module.exports.studentGetApplicationByMatch = function(db, info, res) {
    console.log('Student - Get application by match\n' + util.getTime());

    //搜索申请
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Application WHERE student_number = ? AND match_id = ?';
    var sqlParams = [ info.studentNumber, info.matchId ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else if (data.length == 0) {
            ret.err = false;
            ret.msg = 'Application not found.';
            ret.data = null;
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Application found successfully.';
            ret.data = data[0];
            res.send(JSON.stringify(ret));
        }
    });
}

//学生修改密码
module.exports.studentSetPassword = function(db, info, res) {
    console.log('Student - Set password\n' + util.getTime());

    //更改密码
    var ret = { err: null, msg: null };
    var sql = 'UPDATE Student SET `password` = ? WHERE student_number = ?';
    var sqlParams = [ info.password, info.studentNumber ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(UPDATE).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Set password successfully.';
            res.send(JSON.stringify(ret));
        }
    });
}