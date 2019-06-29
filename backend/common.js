function Common() {
    
    //根据时间获取比赛
    this.getMatchByDate = function(db, info, res) {
        console.log('Get Match By Date');

        //搜索比赛
        var ret = { err: null, msg: null };
        var sql = 'SELECT * FROM Match WHERE start_date > ? AND end_date < ?';
        var sqlParams = [ info.earliestDate, info.latestDate ];
        console.log(sql + '\n' + sqlParams.toString() + '\n');

        db.query(sql, sqlParams, (err, data) => {
            if (err) {
                ret.err = true;
                ret.msg = 'Database error(SELECT).'
                res.send(JSON.stringify(ret));
            }
            else {
                ret.err = false;
                ret.msg = 'Get match by date successfully.';
                ret.data = data;
                res.send(JSON.stringify(ret));
            }
        });
    }
}

module.exports = Common;