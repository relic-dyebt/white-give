

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

    this.queryStudent = function() {
        db.query('SELECT * FROM Student', (err, res) => {
            if (err) throw err;
            for (var i in res) {
                console.log(i + ': ' + res[i] + '\n');
            }
        })
    }
}

module.exports = Database;