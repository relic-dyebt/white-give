//创建比赛
function Tw() {

    this.createMatch = function(db, query, res) {
        
        console.log('Tw Create Match\n');

        var ret = { err: null, msg: null };
        var sql = 
            'INSERT INTO `Match`(name, start_date, end_date, introduction, cover_url, student_list) ' +
            'VALUES(?, ?, ?, ? ,?, ?)';
        var sqlParams = [
            query.name,
            query.startDate,
            query.endDate,
            query.introduction,
            query.coverUrl,
            null
        ];

        console.log(sql);
        
        db.query(sql, sqlParams, err => {
            if (err) {
                console.log(err);
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