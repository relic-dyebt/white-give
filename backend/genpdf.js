const fs = require('fs')
const JSZip = require('jszip')
const Docxtemplater = require('docxtemplater')
const path = require('path');
//读取模板文件
var content = fs.readFileSync(path.join(__dirname, '../data/template/doc.docx'), 'binary');
var zip = new JSZip(content);
var doc = new Docxtemplater();
var util = require('./util');

var toPdf = require("office-to-pdf");

module.exports.getPdfApplication=function (db, info,res) {
    console.log('generate pdf file');
    var ret = { err: null, msg: null };
    var sql = 'SELECT * FROM Application WHERE id=?';
        var sqlParams = [ info.appId];
    console.log(sql + '\n' + sqlParams.toString() + '\n');

    db.query(sql, sqlParams, (err, data) => {
        if (err) {
            ret.err = true;
            ret.msg = 'Database error(SELECT).';
            console.log(res);
            res.send(JSON.stringify(ret));
        } else {
            ret.err=false;
            console.log(data[0]);
            res.send(JSON.stringify((ret)));
            var application =data[0];

            doc.loadZip(zip);
            doc.setData({
                "id": application.id,
                "department": application.department,
                "appCategory":application.appCategory,
                "name": application.name,
                "studentNumber": application.studentNumber,
                "birthday":application.birthday,
                "eduBackground":application.eduBackground,
                "major":application.major,
                "enrollmentYear":application.enrollmentYear,
                "workName":application.workName,
                "address":application.address,
                "phone":application.phone,
                "email":application.email,
                "c1Name":application.c1Name,
                "c1StudentNumber":application.c1StudentNumber,
                "c1EduBackground":application.c1EduBackground,
                "c1Email":application.c1Email,
                "c1Phone":application.c1Phone,
                "c2Name":application.c2Name,
                "c2StudentNumber":application.c2StudentNumber,
                "c2EduBackground":application.c2EduBackground,
                "c2Email":application.c2Email,
                "c2Phone":application.c2Phone,
                "c3Name":application.c3Name,
                "c3StudentNumber":application.c3StudentNumber,
                "c3EduBackground":application.c3EduBackground,
                "c3Email":application.c3Email,
                "c3Phone":application.c3Phone,
                "c4Name":application.c4Name,
                "c4StudentNumber":application.c4StudentNumber,
                "c4EduBackground":application.c4EduBackground,
                "c4Email":application.c4Email,
                "c4Phone":application.c4Phone,
                "category":application.category,
                "introduction":application.introduction,
                "innovation":application.innovation,
                "keyword":application.keyword
            });

            try {
                /*
                 render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                */
                doc.render();
            } catch (error) {
                var err = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                }
                console.log(JSON.stringify(err));
                /*
                The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                */
                throw error;
            }

            var buf = doc.getZip().generate({ type: 'nodebuffer' });
            /* buf is a nodejs buffer, you can either write it to a file or do anything else with it.*/
            fs.writeFileSync(path.join(__dirname, '../data/out/申请'+application.id.toString()+ '.docx'), buf);

            toPdf(buf).then(
                (pdfBuffer) => {
                    fs.writeFileSync("./test.pdf", pdfBuffer)
                }, (err) => {
                    console.log(err)
                }
            )

        }
    });
}
