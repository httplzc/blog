/**
 * Created by Administrator on 2017/6/27 0027.
 */
var connectDb = require("./../extra_untils/connectDB");

function Comment() {
    var commentName;
    var commentTime;
    var commentContent;
}

function PostExtra() {
    var wordCount;
    var readCount;
    var likeCount;
    var commentCount;
    var isLike;
}

function coreQuery(post_id, sessionId, callback, connection) {

    var data = new PostExtra();
    data.wordCount = 0;
    data.readCount = 0;
    data.likeCount = 0;
    data.commentCount = 0;
    data.isLike = false;
    connection.query(
        " SELECT COUNT(tour_like.id)  AS likeCount ,COUNT(IF(tour_like.sessionId=?,true,NULL)) AS isLike,temp.* FROM"
        + " (SELECT  posts.id,posts.markdown,posts.read_count,COUNT(tour_comment.id) AS commentCount"
        + " FROM posts"
        + " LEFT JOIN tour_comment  ON posts.id=tour_comment.postId"
		+ " WHERE posts.status='published'"
        + " GROUP BY posts.id)temp"
        + " LEFT JOIN tour_like ON temp.id=tour_like.postId"
        + " WHERE temp.id=?"
        + " GROUP BY temp.id"


        , [sessionId, post_id], function (err, results, fields) {
            try {
                if (results && results.length > 0) {
                    data.likeCount = results[0].likeCount;
                    data.readCount = results[0].read_count;
                    data.wordCount = results[0].markdown.replace(/!\[.*\]\(.+\)/g,"").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").length;
                    data.commentCount = results[0].commentCount;
                    data.isLike = results[0].isLike!=0;
                    callback(data); 
                }
                else {
                    callback(null, err);
                }
            } catch (e) {
                callback(null, e);

            }
        });
}


function coreQueryDatas(start, lenght, callback) {
    var connection = connectDb();
    var datas = [];
    connection.query(
        "SELECT COUNT(tour_like.id)  AS likeCount ,temp.* FROM"
        + " (SELECT posts.published_at,posts.id,posts.markdown,posts.read_count,COUNT(tour_comment.id) AS commentCount"
        + " FROM posts"
        + " LEFT JOIN tour_comment  ON posts.id=tour_comment.postId"
        + " WHERE posts.page=0 AND posts.status='published'"
        + " GROUP BY posts.id)temp" 
        + " LEFT JOIN tour_like ON temp.id=tour_like.postId"
        + " GROUP BY temp.id  ORDER BY temp.published_at DESC LIMIT 0,7"
        , [start, lenght], function (err, results, fields) {
            try {
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        var extra = new PostExtra();
                        extra.readCount = results[i].read_count;
                        extra.likeCount = results[i].likeCount;
                        extra.wordCount = results[i].markdown.replace(/\W/g, "").length;
                        extra.commentCount = results[i].commentCount;
                        datas[i] = extra;
                    }
                }
                callback(datas);
            } catch (e) {
                callback(null, e);
            }
            finally {
                connection.end();
            }
        }
    )
    ;
}


function getData(post_id,sessionId, callback) {
    var connection = connectDb();
    coreQuery(post_id,sessionId, function (data, error) {
        callback(data, error);
        connection.end();
    }, connection);
}


function getDatas(start, lenght, callback) {
    coreQueryDatas(start, lenght, callback);
}


exports.getData = getData;
exports.getDatas = getDatas;