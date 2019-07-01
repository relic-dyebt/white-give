var util = require('./util');

//创建比赛
module.exports.createMatch = function(db, info, res) {
    console.log('Tw - Create match\n' + util.getTime());

    //插入比赛
    var ret = { err: null, msg: null };
    var sql = 
        'INSERT INTO `Match` ' +
        util.values(5);
    var sqlParams = [
        0,
        info.name,
        info.startDate,
        info.endDate,
        info.introduction,
        info.coverUrl
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
            
            //邀请专家，并创建评审表
            if (info.state == 'accepted') {
                system.inviteExpert(db, info, res, 3);
            }
        }
    });
}