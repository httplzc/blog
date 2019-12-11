/**
 * Created by asus-pc on 2017/7/4.
 */


var connectDb = require("./../extra_untils/connectDB");
var until = require("./../extra_untils/Until");
module.exports = function (res, req) {
    getHotPostDatas(req.query.length == null ? 4 : req.query.length, function (data, err) {
        if (err) {
            return until.error(err, res);
        }
        return until.dealAfter(data);
    });
};


function getHotPostDatas(length, callback) {
    var connection = connectDb();
    var sql = "SELECT posts.image,posts.read_count,posts.title,DATE_FORMAT(posts.published_at,'%Y-%m-%d') AS time,DATE_FORMAT(posts.created_at,'/%Y/%m/%d') AS publicDate,posts.slug FROM posts ORDER BY read_count DESC LIMIT 0,?";
    connection.query(sql, [length], function (err, results, fields) {
        if (err || results.length == 0) {
            callback(null, err);
            return;
        }
        var backData = [];
        for (var i = 0; i < results.length; i++) {
            backData[i] = {
                postTitle: results[i].title,
                postImg: results[i].image,
                postTime: results[i].time,
                postUrl: results[i].publicDate + '/' + results[i].slug
            };
            if (backData[i].postImg == null)
                backData[i].postImg = "/default_img.jpg"
        }
        callback({hot_posts: backData});
        connection.end();
    });
}


module.exports.getHotPostDatas=getHotPostDatas;