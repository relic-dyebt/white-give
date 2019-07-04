var util = require('./util');

//校团委登录
module.exports.login = function(db, info, res) {
    console.log('Tw - Login\n' + util.getTime());

    //搜索用户名
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Tw WHERE username = ? AND password = ?';
    var sqlParams = [ info.username, info.password ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else if (data.length == 0) {
            ret.err = true;
            ret.msg = 'Wrong username.';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Login successfully.';
            ret.data = data[0];
            res.send(JSON.stringify(ret));
        }
    });
}

//校团委注销
module.exports.logout = function(db, info, res) {
    console.log('Tw - Logout\n' + util.getTime());

    //搜索用户名
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Tw WHERE username = ?';
    var sqlParams = [ info.username ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else if (data.length == 0) {
            ret.err = true;
            ret.msg = 'Wrong username.';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Logout successfully.';
            ret.data = data[0];
            res.send(JSON.stringify(ret));
        }
    });
}

//创建比赛
module.exports.createMatch = function(db, info, res) {
    console.log('Tw - Create match\n' + util.getTime());

    //插入比赛
    var ret = { err: null, msg: null };
    var sql = 'INSERT INTO `Match` ' + util.values(8);
    var sqlParams = [
        0,
        info.name,
        info.introduction,
        info.coverUrl,
        info.joinTime,
        info.auditTime,
        info.scoreTime,
        info.endTime
    ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(INSERT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Create match successfully.';
            ret.matchId = data.insertId;
            res.send(JSON.stringify(ret));
        }
    });
}

//根据审核状态获取申请
module.exports.getApplicationByState = function(db, info, res) {
    console.log('Tw - Get application by state\n' + util.getTime());

    //搜索申请
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Application' + (info.state ? ' WHERE state = ?' : '');
    var sqlParams = [ info.state ];
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

//设置申请审核状态
module.exports.setApplicationState = function(db, info, res) {
    console.log('Tw - Set application state\n' + util.getTime());

    //更新申请
    var ret = { err: null, msg: null };
    var sql = 'UPDATE Application SET state = ? WHERE id = ?';
    var sqlParams = [ info.state, info.applicationId ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(UPDATE).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Set application state successfully.';
            res.send(JSON.stringify(ret));
        }
    });
}

//设置申请的已分配专家
module.exports.setApplicationExpert = function(db, info, res) {
    console.log('Tw - Set application expert\n' + util.getTime());

    //删除旧的审核
    var ret = { err: null, msg: null };
    var sql = 'DELETE FROM Assessment WHERE applicationId = ?';
    var sqlParams = [ info.applicationId ];
    db.query(sql, sqlParams, err => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(DELETE).';
            res.send(JSON.stringify(ret));
        } else {

            //更新申请
            var sql = 'UPDATE Application SET state = "assigned" WHERE id = ?';
            var sqlParams = [ info.applicationId ];
            db.query(sql, sqlParams, err => {
                if (err) {
                    console.log(err);
                    ret.err = true;
                    ret.msg = 'Database error(UPDATE).';
                    res.send(JSON.stringify(ret));
                } else {

                    //插入新的审核
                    for(var i in info.experdIds) {
                        var sql = 'INSERT INTO Assessment ' + util.values(5);
                        var sqlParams = [ 0, info.experdIds[i], info.applicationId, 'auditing', 0.0 ];
                        db.query(sql, sqlParams, err => {
                            if (err) {
                                console.log(err);
                                ret.err = true;
                                ret.msg = 'Database error(INSERT).';
                                res.send(JSON.stringify(ret));
                            } else {
                                ret.err = false;
                                ret.msg = 'Set assessment successfully.';
                                res.send(JSON.stringify(ret));
                            }
                        });
                    }
                }
            });
        }
    });
}

//根据申请ID获取已分配专家
module.exports.getExpertByApplication = function(db, info, res) {
    console.log('Tw - Get expert by application\n' + util.getTime());

    //搜索专家
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Expert WHERE id IN (SELECT expertId FROM Assessment WHERE applicationId = ?)';
    var sqlParams = [ info.applicationId ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(UPDATE).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Set application state successfully.';
            res.send(JSON.stringify(ret));
        }
    });
}