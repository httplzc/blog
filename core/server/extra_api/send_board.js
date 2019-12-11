/**
 * Created by Administrator on 2017/6/25 0025.
 */
var connectDb = require("./../extra_untils/connectDB");
var until = require("./../extra_untils/Until");

module.exports = function (res, req) {
    var senderKey = req.body.key;
    var senderValue = req.body.value;
    if (senderKey == null||senderValue==null) {
        until.error("缺少参数", res);
        return;
    }
    var connection = connectDb();
    var params = [senderKey, senderValue, until.formateTime()];
    var sql =
        "INSERT INTO board_values (board_key,board_value,board_time) "
        + "VALUES (?,?,?)";

    connection.query(sql, params, function (err, results, fields) {
        if (err) {
            until.error("存储错误！", res);
            connection.end();
            return;
        }
        res.json(until.dealAfter(""));
        connection.end();
    });
};