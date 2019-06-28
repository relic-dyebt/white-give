function Student() {
    //用户注册
    this.register = function(db, query, res) {
        console.log('Student Register\n');

        var ret = { err: null, msg: null };
        var sql =
            'SELECT COUNT(*) AS cnt ' +
            'FROM Student ' + 
            'WHERE student_number = "' + query.studentNumber + '" OR username = "' + query.username + '"';

        console.log(sql);

        //检查学号或用户名是否已存在
        db.query(sql, (err, data) => {
                if (err) {
                    ret.err = true;
                    ret.msg = 'Database error(select).'
                    res.send(JSON.stringify(ret));
                }
                else if (data[0].cnt > 0) {
                    ret.err = true;
                    ret.msg = 'Duplicate student number or username.'
                    res.send(JSON.stringify(ret));
                }
                else {
                    var sql = 
                        'INSERT INTO Student(username, password, name, introduction, profile_url, work_list, phone, email, department, major, enrollment_year, student_number) ' +
                        'VALUES(?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?)';
                    var sqlParams = [
                        query.username,
                        query.password,
                        query.name,
                        query.introduction,
                        query.profileUrl,
                        query.workList,
                        query.phone,
                        query.email,
                        query.department,
                        query.major,
                        query.enrollmentYear,
                        query.studentNumber
                    ];

                    console.log(sql);

                    //插入用户
                    db.query(sql, sqlParams, err => {
                            if (err) {
                                ret.err = true;
                                ret.msg = 'Database error(insert).'
                                res.send(JSON.stringify(ret));
                            }
                            else {
                                ret.err = false;
                                ret.msg = 'Register success.';
                                res.send(JSON.stringify(ret));
                            }
                        }
                    );
                }
            }
        );
    }
    
    //用户登录
    this.login = function(db, query, res) {
        console.log('Student Login');

        var ret = { err: null, msg: null };
        var sql =
            'SELECT * ' +
            'FROM Student ' + 
            'WHERE student_number = "' + query.studentNumber + '" AND password = "' + query.password + '"';

        console.log(sql);
        
        //检查学号和密码是否匹配
        db.query(sql, (err, data) => {
                if (err) {
                    ret.err = true;
                    ret.msg = 'Database error(select).'
                    res.send(JSON.stringify(ret));
                }
                else if (data.length == 0) {
                    ret.err = true;
                    ret.msg = 'Wrong student number or password.'
                    res.send(JSON.stringify(ret));
                }
                else {
                    ret.err = false;
                    ret.msg = 'Login success.';
                    ret.data = data[0];
                    
                    console.log(data[0]);

                    res.send(JSON.stringify(ret));
                }
            }
        );
    }

}

module.exports = Student;