var util = require('./util');

//根据时间获取比赛
module.exports.getMatchByDate = function(db, info, res) {
    console.log('Common Get Match By Date');

    //搜索比赛
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Match WHERE start_date > ? AND end_date < ?';
    var sqlParams = [ info.earliestDate, info.latestDate ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Get match successfully.';
            ret.data = data;
            res.send(JSON.stringify(ret));
        }
    });
}

//获取作品
module.exports.getWork = function(db, info, res) {
    console.log('Common Get Work');

    //搜索作品
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Work WHERE id = ?';
    var sqlParams = [ info.id ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Get work successfully.';
            ret.data = data[0];
            res.send(JSON.stringify(ret));
        }
    });
}

//获取申请
module.exports.getApplication = function(db, info, res) {
    console.log('Common Get Application');

    //搜索申请
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Application WHERE id = ?';
    var sqlParams = [ info.id ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        }
        else {
            ret.err = false;
            ret.msg = 'Get application successfully.';
            ret.data = data[0];
            res.send(JSON.stringify(ret));
        }
    });
}