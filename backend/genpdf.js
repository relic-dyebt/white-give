const fs = require('fs')
const JSZip = require('jszip')
const Docxtemplater = require('docxtemplater')
const path = require('path');
//读取模板文件
var content = fs.readFileSync(path.join(__dirname, '../data/template/doc.docx'), 'binary');
var zip = new JSZip(content);
var doc = new Docxtemplater();
var util = require('./util');


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
                "work_id": application.id,


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

        }
    });
}