var util = require('./util');

//专家注册
module.exports.register = function(db, info, res) {
    console.log('Expert Register');

    //搜索邮箱
    var ret = { err: null, msg: null };
    var sql = 'SELECT COUNT(*) AS cnt FROM Expert WHERE email = ?';
    var sqlParams = [ info.email ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else if (data[0].cnt > 0) {
            ret.err = true;
            ret.msg = 'Duplicate email.';
            res.send(JSON.stringify(ret));
        } else {
            var sql = 
                'INSERT INTO Expert(username, password, name, introduction, profile_url, phone, email) ' +
                util.values(7);
            var sqlParams = [
                info.username,
                info.password,
                info.name,
                info.introduction,
                info.profileUrl,
                info.phone,
                info.email
            ];
            console.log(sql + '\n' + sqlParams.toString() + '\n');

            //插入专家
            db.query(sql, sqlParams, (err, data) => {
                if (err) {
                    ret.err = true;
                    ret.msg = 'Database error(INSERT).';
                    res.send(JSON.stringify(ret));
                } else {
                    ret.err = false;
                    ret.msg = 'Register successfully.';
                    res.send(JSON.stringify(ret));
                }
            });
        }
    });
}

//专家登录
module.exports.login = function(db, info, res) {
    console.log('Student Login');

    //搜索邮箱和密码
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Expert WHERE email = ? AND `password` = ?';
    var sqlParams = [ info.email, info.password ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            res.send(JSON.stringify(ret));
        } else if (data.length == 0) {
            ret.err = true;
            ret.msg = 'Wrong email or password.';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Login successfully.';
            ret.data = data[0];
            res.send(JSON.stringify(ret));
        }
    });
}

//专家修改密码
module.exports.expertSetPassword = function(db, info, res) {
    console.log('Expert Set Password');

    //更改密码
    var ret = { err: null, msg: null };
    var sql = 'UPDATE Expert SET `password` = ? WHERE email = ?';
    var sqlParams = [ info.password, info.email ];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(UPDATE).';
            res.send(JSON.stringify(ret));
        } else {
            ret.err = false;
            ret.msg = 'Set password successfully.';
            res.send(JSON.stringify(ret));
        }
    });
}