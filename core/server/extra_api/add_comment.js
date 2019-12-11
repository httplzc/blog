/**
 * Created by Administrator on 2017/6/25 0025.
 */
var connectDb = require("./../extra_untils/connectDB");
var until = require("./../extra_untils/Until");
var uuid = require("./../extra_untils/UUID");
var http = require('http');

module.exports = function (res, req) {
    var post_id = req.body.post_id;
    var comment_content = req.body.comment_content;
    var comment_name = req.body.comment_name;
    var commentEmail = req.body.comment_email;
    var commentUUID = uuid();
    var commentTime = until.formateTime();
    var commentIp = req.ip;
    if (post_id == null || post_id.trim() == "") {
        until.error("评论id不能为空", res);
        return;
    }
    if (comment_content == null || comment_content.trim() == "") {
        until.error("评论内容不能为空", res);
        return;
    }
    if (comment_name == null || comment_name.trim() == "") {
        until.error("评论名字不能为空", res);
        return;
    }
    if (comment_name.length > 10 || comment_name.replace(/\s/g, "").length < 1) {
        until.error("名字字数不能超10个！", res);
        return;
    }
    if (comment_content.length > 80 || comment_content.replace(/\s/g, "").length < 2) {
        until.error("评论字数不能超过80个！", res);
        return;
    }
    var connection = connectDb();
    limit(connection, res, post_id, commentIp, function () {
        console.log("limit_finish");
        until.getIpMsg(commentIp, function (province, city) {
            var query = "INSERT INTO tour_comment (postId,commentUUID,commentContent,commentTime,commentName,commentIp,commentEmail,commentIpProvince,commentIpCity) " +
                " VALUES (?,?,?,?,?,?,?,?,?)";
            var params = [post_id, commentUUID, comment_content, commentTime, comment_name, commentIp, commentEmail, province, city];
            connection.query(query, params, function (err, results, fields) {
                if (err) {
                    until.error(err, res);
                    connection.end();
                    return;
                }
                res.json(until.dealAfter(""));
                connection.end();
            });
        });
    })
};



function limit(connection, res, post_id, commentIp, callback) {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var sql = "SELECT COUNT(tour_comment.commentIp) AS commentIpCount ,"
        + " tour_comment.commentTime, posts.id,posts.markdown,posts.read_count"
        + " FROM posts LEFT JOIN tour_comment ON posts.id=tour_comment.postId WHERE posts.id=?"
        + " AND tour_comment.commentTime>? AND tour_comment.commentIp=?"
        + " GROUP BY tour_comment.commentIp ";
    connection.query(sql, [post_id, until.formateTime(date), commentIp],
        function (err, results, fields) {
            if (err || (results.length == 1 && results[0].commentIpCount >= 20)) {
                until.error(err == null ? "评论数过多，明天再来评论!" : err, res);
                connection.end();
                return;
            }
            callback();
        });

}


