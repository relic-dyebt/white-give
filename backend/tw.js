//创建比赛
function Tw() {

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

        console.log(sql);
        
        db.query(sql, sqlParams, err => {
            if (err) {
                ret.err = true;
                ret.msg = 'Database error(insert).'
                res.send(JSON.stringify(ret));
            }
            else {
                ret.err = false;
                ret.msg = 'Create match success.'
                res.send(JSON.stringify(ret));
            }
        });
    }
}

module.exports = Tw;