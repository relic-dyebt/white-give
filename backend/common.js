var util = require('./util');

//根据时间获取比赛
module.exports.getMatchByDate = function(db, info, res) {
    console.log('Common - Get match by date.\n' + util.getTime());

    //搜索比赛
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Match WHERE startDate > ? AND endDate < ?';
    var sqlParams = [ info.earliestDate, info.latestDate ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
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

//根据ID获取作品
module.exports.getWorkById = function(db, info, res) {
    console.log('Common - Get work\n' + util.getTime());

    //搜索作品
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Work WHERE id = ?';
    var sqlParams = [ info.id ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
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

//根据ID获取申请
module.exports.getApplicationById = function(db, info, res) {
    console.log('Common - Get application\n' + util.getTime());

    //搜索申请
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Application WHERE id = ?';
    var sqlParams = [ info.id ];
    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            console.log(err);
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