module.exports.values = function(num) {
    var ret = 'VALUES(';
    for (var i = 0; i < num; i++)
        ret += '?' + (i < num - 1 ? ', ' : '');
    return ret + ')';
}

module.exports.getTime = function() {
    var time = new Date();
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
}