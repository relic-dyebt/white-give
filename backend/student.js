function Student() {
    //学生注册
    this.register = function(db, info, res) {
        console.log('Student Register');

        //检查学号和用户名是否存在
        var ret = { err: null, msg: null };
        var sql = 'SELECT COUNT(*) AS cnt FROM Student WHERE student_number = ? OR username = ?';
        var sqlParams = [ info.studentNumber, info.username ];
        console.log(sql);

        db.query(sql, sqlParams, (err, data) => {
            if (err) {
                ret.err = true;
                ret.msg = 'Database error(SELECT).'
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
                    info.username,
                    info.password,
                    info.name,
                    info.introduction,
                    info.profileUrl,
                    info.workList,
                    info.phone,
                    info.email,
                    info.department,
                    info.major,
                    info.enrollmentYear,
                    info.studentNumber
                ];
                console.log(sql);

                //插入用户
                db.query(sql, sqlParams, (err, data) => {
                    if (err) {
                        ret.err = true;
                        ret.msg = 'Database error(INSERT).'
                        res.send(JSON.stringify(ret));
                    }
                    else {
                        ret.err = false;
                        ret.msg = 'Register success.';
                        res.send(JSON.stringify(ret));
                    }
                });
            }
        });
    }
    
    //学生登录
    this.login = function(db, info, res) {
        console.log('Student Login');

        //检查学号和密码是否合法
        var ret = { err: null, msg: null };
        var sql = 'SELECT * FROM Student WHERE student_number = ? AND password = ?';
        var sqlParams = [ info.studentNumber, info.password ];
        console.log(sql);
        
        db.query(sql, (err, data) => {
            if (err) {
                ret.err = true;
                ret.msg = 'Database error(SELECT).'
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
                res.send(JSON.stringify(ret));
            }
        });
    }

    //学生提交申请
    this.submitApplication = function(db, info, res) {
        console.log('Student Submit Application');
        
        //插入申请
        var ret = { err: null, msg: null };
        var sql = 
            'INSERT INTO Application(name, student_number, birthday, educational_background, major, enrollment_year, work_name, address, phone, email, ' + 
            'c1_name, c1_student_number, c1_educational_background, c1_phone, c1_email, ' +
            'c2_name, c2_student_number, c2_educational_background, c2_phone, c2_email, ' +
            'c3_name, c3_student_number, c3_educational_background, c3_phone, c3_email, ' +
            'c4_name, c4_student_number, c4_educational_background, c4_phone, c4_email, ' +
            'category, introduction, innovation_list, keyword_list, state, match_id, work_id) ' +
            'VALUES(?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        var sqlParams = [
            info.name,
            info.student_number,
            info.birthday,
            info.educationalBackground,
            info.major,
            info.enrollmentYear,
            info.workName,
            info.address,
            info.phone,
            info.email,
            info.c1Name, info.c1StudentNumber, info.c1EducationalBackground, info.c1Phone, info.c1Email,
            info.c2Name, info.c2StudentNumber, info.c2EducationalBackground, info.c2Phone, info.c2Email,
            info.c3Name, info.c3StudentNumber, info.c3EducationalBackground, info.c3Phone, info.c3Email,
            info.c4Name, info.c4StudentNumber, info.c4EducationalBackground, info.c4Phone, info.c4Email,
            info.category,
            info.introduction,
            info.innovationList,
            info.keywordList,
            info.state,
            info.matchId,
            info.workId
        ];
        console.log(sql);

        db.query(sql, sqlParams, (err, data) => {
            if (err) {
                ret.err = true;
                ret.msg = 'Database error(INSERT).'
                res.send(JSON.stringify(ret));
            }
            else {
                //更新相关学生
                var sql = 'UPDATE Student SET application_list = concat(application_list, ?, ";") WHERE student_number = ?'
                var sqlParams = [ data.insertId, info.studentNumber ];
                console.log(sql);

                db.query(sql, sqlParams, (err, data) => {
                    if (err) {
                        ret.err = true;
                        ret.msg = 'Database error(UPDATE).'
                        res.send(JSON.stringify(ret));
                    }
                    else {
                        ret.err = false;
                        ret.msg = 'Submit application success.';
                        ret.applicationId = data.insertId;
                        res.send(JSON.stringify(ret));
                    }
                });
            }
        });
    }

    //学生提交作品
    this.submitWork = function(db, info, res) {
        console.log('Student Submit Work');
        
        //插入作品
        var ret = { err: null, msg: null };
        var sql = 
            'INSERT INTO `Work`(student_number, application_id, document_url_list, picture_url_list, video_url_list, expert_list, state, score) ' +
            'VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        var sqlParams = [
            info.studentNumber,
            info.applicationId,
            info.documentUrlList,
            info.pictureUrlList,
            info.videoUrlList,
            null,
            null,
            null
        ];
        console.log(sql);

        db.query(sql, sqlParams, (err, data) => {
            if (err) {
                ret.err = true;
                ret.msg = 'Database error(INSERT).'
                res.send(JSON.stringify(ret));
            }
            else {
                //更新相关申请
                var sql = 'UPDATE Application SET work_id = ? WHERE id = ?';
                var sqlParams = [ data.insertId, info.applicationId ];
                console.log(sql);

                db.query(sql, sqlParams, (err, data) => {
                    if (err) {
                        ret.err = true;
                        ret.msg = 'Database error(UPDATE).'
                        res.send(JSON.stringify(ret));
                    }
                    else {
                        //更新相关学生
                        var sql = 'UPDATE Student SET work_list = concat(work_list, ?, ";") WHERE student_number = ?'
                        var sqlParams = [ data.insertId, info.studentNumber ];
                        console.log(sql);

                        db.query(sql, sqlParams, (err, data) => {
                            if (err) {
                                ret.err = true;
                                ret.msg = 'Database error(UPDATE).'
                                res.send(JSON.stringify(ret));
                            }
                            else {
                                ret.err = false;
                                ret.msg = 'Submit work success.';
                                ret.workId = data.insertId;
                                res.send(JSON.stringify(ret));
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = Student;