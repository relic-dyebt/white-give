
function Tw() {

    //创建比赛
    this.createMatch = function(db, info, res) {
        console.log('Tw Create Match');

        var ret = { err: null, msg: null };
        var sql = 
            'INSERT INTO `Match`(name, start_date, end_date, introduction, cover_url, application_list) ' +
            'VALUES(?, ?, ?, ? ,?, ?)';
        var sqlParams = [
            info.name,
            info.startDate,
            info.endDate,
            info.introduction,
            info.coverUrl,
            null
        ];
        console.log(sql + '\n' + sqlParams.toString() + '\n');
        
        db.query(sql, sqlParams, err => {
            if (err) {
                ret.err = true;
                ret.msg = 'Database error(INSERT).'
                res.send(JSON.stringify(ret));
            }
            else {
                ret.err = false;
                ret.msg = 'Create match successfully.'
                res.send(JSON.stringify(ret));
            }
        });
    }
}

module.exports = Tw;