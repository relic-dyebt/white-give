function Student() {
    
    this.register = function(db, query, res) {
        console.log('Student Register\n');

        var ret = { err: null, msg: null };
        var sql =
            'SELECT COUNT(*) ' +
            'FROM Student ' + 
            'WHERE student_number = ' + query.studentNumber + ' or username = ' + query.username;

        console.log(sql);

        //检查学号或用户名是否已存在
        db.query(sql, (err, data) => {
                if (err) {
                    ret.err = true;
                    ret.msg = 'Database error(select).'
                    res.send(JSON.stringify(ret));
                }
                else if (data[0] > 0) {
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

                    //插入用户
                    db.query(sql, sqlParams, err => {
                            if (err) {
                                ret.err = true;
                                ret.msg = 'Database error(insert).'
                                res.send(JSON.stringify(ret));
                            }
                            else {
                                ret.err = false;
                                ret.msg = 'Success.'
                                res.send(JSON.stringify(ret));
                            }
                        }
                    );
                }
            }
        );
    }
}

module.exports = Student;