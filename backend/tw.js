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
    var sql = 'INSERT INTO `Match` ' + util.values(9);
    var sqlParams = [
        0,
        info.name,
        info.introduction,
        info.coverUrl,
        info.joinTime,
        info.auditTime,
        info.scoreTime,
        info.endTime,
        'created'
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

//根据ID删除比赛
module.exports.deleteMatchById = function(db, info, res) {
    console.log('Tw - Delete match by id\n' + util.getTime());

    //删除比赛
    var ret = { err: null, msg: null };
    var sql = 'DELETE FROM `Match` WHERE id = ?'
    var sqlParams = [ info.id ];
    db.query(sql, sqlParams, err => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(DELETE).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Delete match successfully.';
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
    db.query(sql, sqlParams, err => {
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

//设置申请分数
module.exports.setApplicationScore = function(db, info, res) {
    console.log('Tw - Set application score\n' + util.getTime());

    //更新申请
    var ret = { err: null, msg: null };
    var sql = 'UPDATE Application SET score = ? WHERE id = ?';
    var sqlParams = [ info.score, info.applicationId ];
    db.query(sql, sqlParams, err => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(UPDATE).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Set application score successfully.';
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

//根据申请ID、是否已邀请获取已分配专家
module.exports.getExpertByApplication = function(db, info, res) {
    console.log('Tw - Get expert by application\n' + util.getTime());

    //搜索专家
    var ret = { err: null, msg: null };
    var sql = info.invited == 'true' ?
        'SELECT * FROM Expert WHERE Expert.id IN (SELECT expertId FROM Assessment WHERE applicationId = ?)':
        'SELECT * FROM Expert WHERE Expert.id NOT IN (SELECT expertId FROM Assessment WHERE applicationId = ?) AND Expert.category IN (SELECT Application.category FROM Application WHERE Application.id = ?)'
    var sqlParams = [ info.applicationId, info.applicationId ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Get expert successfully.';
            ret.data = data;
            res.send(JSON.stringify(ret));
        }
    });
}

//根据种类获取专家
module.exports.getExpertByCategory = function(db, info, res) {
    console.log('Tw - Get expert by category\n' + util.getTime());

    //搜索专家
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Expert WHERE category = ?';
    var sqlParams = [ info.category ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Get expert successfully.';
            ret.data = data;
            res.send(JSON.stringify(ret));
        }
    });
}

//获取专家
module.exports.getExpert = function(db, res) {
    console.log('Tw - Get expert\n' + util.getTime());

    //搜索专家
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Expert';
    var sqlParams = [];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Get expert successfully.';
            ret.data = data;
            res.send(JSON.stringify(ret));
        }
    });
}