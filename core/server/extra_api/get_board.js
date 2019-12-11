/**
 * Created by Administrator on 2017/6/25 0025.
 */
var connectDb = require("./../extra_untils/connectDB");
var until = require("./../extra_untils/Until");

module.exports = function (res, req) {
    var senderKey = req.query.key;
    if (senderKey == null) {
        until.error("缺少参数key", res);
        return;
    }
    var connection = connectDb();
    var params = [senderKey];
    var sql ="SELECT\n" +
        "id,\n" +
        "board_value,\n" +
        "board_key,\n" +
        "DATE_FORMAT( board_time, '%Y-%m-%d %H:%i' ) AS time \n" +
        "FROM\n" +
        "board_values \n" +
        "WHERE\n" +
        "board_key = ? \n" +
        "ORDER BY\n" +
        "id DESC";
    connection.query(sql, params, function (err, results, fields) {
        if (err) {
            until.error("存储错误！", res);
            connection.end();
            return;
        }
        var dataList = [];
        for (var i = 0; i < results.length; i++) {
            dataList[i]={
                key:results[i].board_key,
                value:results[i].board_value,
                time:results[i].time,
            }
        }
        res.render("board_message", {messages:dataList});
        connection.end();
    });
};