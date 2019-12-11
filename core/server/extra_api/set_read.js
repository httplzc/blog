/**
 * Created by Administrator on 2017/6/25 0025.
 */
var connectDb = require("./../extra_untils/connectDB");
var until = require("./../extra_untils/Until");

module.exports = function (res, req) {
    var post_id = req.body.post_id;
    if (post_id == null) {
        until.error("缺少参数", res);
        return;
    }
    var connection = connectDb();
	var readCountReal = Math.floor((Math.random()*5)+1)
    var params=[readCountReal,post_id];
    connection.query("UPDATE posts SET read_count=read_count+? WHERE id=?",params, function (err, results, fields) {
        if (err) {
            until.error(err, res);
            connection.end();
            return;
        }
        res.json(until.dealAfter(""));
        connection.end();
    });
};