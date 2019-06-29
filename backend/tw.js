var util = require('./util');

//创建比赛
module.exports.createMatch = function(db, info, res) {
    console.log('Tw Create Match');

    var ret = { err: null, msg: null };
    var sql = 
        'INSERT INTO `Match`(name, start_date, end_date, introduction, cover_url) ' +
        util.values(5);
    var sqlParams = [
        info.name,
        info.startDate,
        info.endDate,
        info.introduction,
        info.coverUrl
    ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');
    
    db.query(sql, sqlParams, err => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(INSERT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Create match successfully.';
            res.send(JSON.stringify(ret));
        }
    });
}

//根据审核状态获取申请
module.exports.getApplicationByState = function(db, info, res) {
    console.log('Tw Get Application By State');

    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Application' + (info.state ? ' WHERE state = ?' : '');
    var sqlParams = [ info.state ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');
    
    db.query(sql, sqlParams, err => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Get application successfully.';
            res.send(JSON.stringify(ret));
        }
    });
}

//设置申请审核状态
module.exports.setApplicationState = function(db, info, res) {
    console.log('Tw Set Application State');

    var ret = { err: null, msg: null };
    var sql = 'UPDATE Application SET state = ? WHERE id = ?';
    var sqlParams = [ info.state, info.id ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');
    
    db.query(sql, sqlParams, err => {
        if (err) {
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