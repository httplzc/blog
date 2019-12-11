/**
 * Created by Administrator on 2017/6/25 0025.
 */
var connectDb = require("./../extra_untils/connectDB");
var until = require("./../extra_untils/Until");

module.exports = function (res, req) {
    var page_location = req.body.page_location;
    var page_title = req.body.page_title;
	var agent=req.body.agent;
    if (page_title == null || page_location == null) {
        until.error("缺少参数", res);
        return;
    }
    var ip = req.ip;
    until.getIpMsg(ip, function (province, city) {
        var connection = connectDb();
        var params = [ip, province, city, page_location, page_title,until.formateTime(),agent];
        var sql = "INSERT INTO tour_visited_history (ip,ipProvice,ipCity,page_location,page_title,time,agent) VALUES(?,?,?,?,?,?,?)";
        connection.query(sql, params, function (err, results, fields) {
            if (err) {
                until.error(err, res);
                connection.end();
                return;
            }
            res.json(until.dealAfter(""));
            connection.end();
        });
    });


};