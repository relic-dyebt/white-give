var util = require('./util');

//专家注册
module.exports.register = function(db, info, res) {
    console.log('Expert - Register\n' + util.getTime());

    //搜索邮箱
    var ret = { err: null, msg: null };
    var sql = 'SELECT COUNT(*) AS cnt FROM Expert WHERE email = ?';
    var sqlParams = [ info.email ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else if (data[0].cnt > 0) {
            ret.err = true;
            ret.msg = 'Duplicate email.';
            res.send(JSON.stringify(ret));
        } else {
            //插入专家
            var sql = 
                'INSERT INTO Expert ' +
                util.values(8);
            var sqlParams = [
                0,
                info.username,
                info.password,
                info.name,
                info.introduction,
                info.profileUrl,
                info.phone,
                info.email,
                info.category
            ];
            db.query(sql, sqlParams, (err, data) => {
                if (err) {
                    console.log(err);
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

//专家登录
module.exports.login = function(db, info, res) {
    console.log('Student - Login\n' + util.getTime());

    //搜索邮箱和密码
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Expert WHERE email = ? AND `password` = ?';
    var sqlParams = [ info.email, info.password ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else if (data.length == 0) {
            ret.err = true;
            ret.msg = 'Wrong email or password.';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Login successfully.';
            ret.data = data[0];
            res.send(JSON.stringify(ret));
        }
    });
}

//专家修改密码
module.exports.expertSetPassword = function(db, info, res) {
    console.log('Expert - Set password\n' + util.getTime());

    //更新密码
    var ret = { err: null, msg: null };
    var sql = 'UPDATE Expert SET `password` = ? WHERE email = ?';
    var sqlParams = [ info.password, info.email ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
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

//专家根据审核状态获取申请
module.exports.expertGetApplicationByState = function(db, info, res) {
    console.log('Expert - Get application by state\n' + util.getTime());

    //搜索申请
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Application WHERE id IN(SELECT applicationId FROM Assessment WHERE expertId = ?)' + (info.state ? ' AND state = ?' : '');
    var sqlParams = [ info.expertId, info.state ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Get application successfully.';
            ret.data = data;
            res.send(JSON.stringify(ret));
        }
    });
}

//专家设置申请评分
module.exports.expertSetApplicationScore = function(db, info, res) {
    console.log('Expert - Set application score\n' + util.getTime());

    //更新评审
    var ret = { err: null, msg: null };
    var sql = 'UPDATE Assessment SET score = ?, state = "scored" WHERE expertId = ? AND applicationId = ?';
    var sqlParams = [ info.score, info.expertId, info.applicationId ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(UPDATE).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Set application score successfully.';
            ret.data = data;
            res.send(JSON.stringify(ret));
        }
    });
}