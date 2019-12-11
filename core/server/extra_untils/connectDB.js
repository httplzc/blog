/**
 * Created by Administrator on 2017/6/24 0024.
 */
var mysql = require('mysql');
var fun = function connectDb() {
    var connection = mysql.createConnection({
        host: 'www.lizechao.com',
        user: 'sqluser',
        password: 'lzc62825179',
        database: 'ghost_blog'
    });
    connection.connect();
    return connection;
};

module.exports = fun;