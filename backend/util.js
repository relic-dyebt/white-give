module.exports.values = function(num) {
    var ret = 'VALUES(';
    for (var i = 0; i < num; i++)
        ret += '?' + (i < num - 1 ? ', ' : '');
    return ret + ')';
}