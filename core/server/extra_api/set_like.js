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
    var sessionId= req.session.id;
	if(sessionId==null)
		sessionId=req.session.token;
    if(!sessionId)
    {
        until.error("身份错误！", res);
        return;
    }
    var connection = connectDb();
    var params = [sessionId, post_id, until.formateTime(), req.ip, post_id, sessionId];
    var sql =
        "INSERT INTO tour_like (sessionId,postId,time,ip) "
        + " SELECT ?,?,?,? FROM DUAL"
        + " WHERE NOT EXISTS"
        + " (SELECT id FROM tour_like WHERE postId=? AND tour_like.sessionId=?) LIMIT 1";
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