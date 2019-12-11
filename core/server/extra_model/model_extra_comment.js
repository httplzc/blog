/**
 * Created by Administrator on 2017/6/30 0030.
 */



/**
 * Created by Administrator on 2017/6/30 0030.
 */
var connectDb = require("./../extra_untils/connectDB");
function getDatas(post_id, page, pagerCount, callback) {
    var sql = "SELECT id,commentContent,commentIpProvince,commentIpCity,DATE_FORMAT(commentTime,'%Y-%m-%d %H:%i') AS commentTime,commentName,"
        +" (SELECT COUNT(id) FROM tour_comment WHERE postId=? && isDelete=0) AS count"
        +" FROM tour_comment WHERE postId=? && isDelete=0 ORDER BY tour_comment.commentTime DESC LIMIT ?,?";
    var params = [post_id,post_id, page * pagerCount, pagerCount];
    var connection = connectDb();
    connection.query(sql, params, function (error, results) {
        if (error || !results) {
            callback(null, JSON.stringify(error));
            connection.end();
        }
        else if(results.length==0)
        {
            callback(null, "数据为空");
            connection.end();
        }
        else {
            var commentList = [];
            var count;
            for (var i = 0; i < results.length; i++) {
                count=results[i].count;
                commentList[i] = {
                    commentId: results[i].id,
                    commentName: results[i].commentName,
                    position: count-page * pagerCount-i,
                    commentTime: results[i].commentTime,
                    commentContent: results[i].commentContent,
                    commentIpProvince: results[i].commentIpProvince,
                    commentIpCity: results[i].commentIpCity

                };

            }
            callback({comments: commentList, commentCount: count});


        }
    });
}

exports.getDatas = getDatas;