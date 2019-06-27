function Database() {

    var mysql = require('mysql');

    var db = mysql.createConnection({
        host: 'cdb-cp9aouco.bj.tencentcdb.com',
        port: '10122',
        user: 'root',
        password: '123456+1s',
        database: 'white-give'
    });
    
    this.init = function () {
        db.connect();
    }

    this.queryStudent = function(res) {
        db.query('SELECT * FROM Student', (err, data) => {
            if (err) throw err;
            res.writeHead(200,{"Content-Type":'text/plain;charset=utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});
            res.write(data[0].name + '\n');
            res.write(data[0].introduction + '\n');
            res.write(data[0].phone + '\n');
            res.write(data[0].email + '\n');
            res.end();
        });
    }
}

module.exports = Database;