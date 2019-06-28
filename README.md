# white-give

HTTP请求格式：
    http://58.87.72.138:30000/pathname?info={...}

----------------------------------------------------------------------------------------------------
学生注册
```
pathname:
    studentRegister
info: 
    username,
    password,
    name,
    introduction,
    profileUrl,
    workList,
    phone,
    email,
    department,
    major,
    enrollmentYear,
    studentNumber
```
返回值:
    { err: bool, msg: string }
示例:
    http://58.87.72.138:30000/studentRegister?info={"username":"xiaoming123","password":"ABC","name":"mingming","introduction":"im good","profileUrl":"okok","workList":"work1;work2;work3","phone":"911","email":"xiaoming@163.com","department":"software","major":"soft","enrollmentYear":"2015","studentNumber":"15240000"}

----------------------------------------------------------------------------------------------------
学生登录
pathname:
    studentLogin
info: 
    studentNumber,
    password
返回值:
    { err: bool, msg: string, data: object }
示例:
    http://58.87.72.138:30000/studentLogin?info={"studentNumber":"15240000","password":"ABC"}

----------------------------------------------------------------------------------------------------
学生提交申请
pathname:
    submitApplication
info: 
    name,
    student_number,
    birthday,
    educationalBackground,
    major,
    enrollmentYear,
    workName,
    address,
    phone,
    email,
    c1Name,
    c1StudentNumber,
    c1EducationalBackground,
    c1Phone,
    c1Email,
    c2Name,
    c2StudentNumber,
    c2EducationalBackground,
    c2Phone,
    c2Email,
    c3Name,
    c3StudentNumber,
    c3EducationalBackground,
    c3Phone,
    c3Email,
    c4Name,
    c4StudentNumber,
    c4EducationalBackground,
    c4Phone,
    c4Email,
    category,
    introduction,
    innovationList,
    keywordList,
    state,
    matchId,
    workId
返回值:
    { err: bool, msg: string }

----------------------------------------------------------------------------------------------------
学生提交作品
pathname:
    submitWork
info: 
    documentUrlList,
    pictureUrlList,
    videoUrlList
返回值:
    { err: bool, msg: string, workId: string }

----------------------------------------------------------------------------------------------------
校团委创建比赛
pathname:
    createMatch
info:
    name,
    startDate,
    endDate,
    introduction,
    coverUrl
返回值:
    { err: bool, msg: string }
