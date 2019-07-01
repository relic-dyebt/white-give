module.exports.values = function(num) {
    var ret = 'VALUES(';
    for (var i = 0; i < num; i++)
        ret += '?' + (i < num - 1 ? ', ' : '');
    return ret + ')';
}

module.exports.getTime = function() {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var date = time.getDate();
    if (date < 10) date = '0' + date;
    var hour = time.getMinutes();
    if (hour < 10) hour = '0' + hour;
    var minute = time.getMinutes();
    if(minute < 10) minute = '0' + minute;
    var second = time.getSeconds();
    if(second < 10) second = '0' + second;
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}