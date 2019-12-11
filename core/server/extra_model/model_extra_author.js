/**
 * Created by Administrator on 2017/6/27 0027.
 */
var connectDb = require("./../extra_untils/connectDB");
function getData(author_id, callback) {
    var connection = connectDb();
    var sql = "SELECT SUM(temp.likeCount) AS likeSum ,COUNT(postId) AS postSum FROM"
    +" (SELECT COUNT(tour_like.id) AS likeCount ,posts.id AS postId,tour_like.id AS likeId FROM posts"
    +" LEFT JOIN tour_like ON posts.id=tour_like.postId"
    +" WHERE posts.author_id=? "
    +" GROUP BY posts.id)temp";
    connection.query(sql, author_id, function (err, results, fields) {
        try {
            console.log(err);
            var data = {postCount: 0, likeCount: 0};
            if (results&&results.length>0) {
                data.postCount = results[0].postSum;
                data.likeCount = results[0].likeSum;
                callback(data);
            }
            else
                callback(null, err);

        } catch (e) {
            callback(null, e);
        }
        finally {
            connection.end();
        }
    });
}
exports.getData = getData;