var path = require('path');
var until = require("./../extra_untils/Until");
var connectDb = require("./../extra_untils/connectDB");
module.exports = function (res, req) {
    if (!req.session.isLogin) {
        until.error("未登录", res);
    }
    var filename = req.body.filename;
    var path = req.body.path;
    save(filename, path, function (error) {
        if (error) {
            until.error("", res);
        } else {
            res.json(until.dealAfter(""));
        }
    });
};

function save(filename, target_path, callback) {
    var connection = connectDb();
    var query = "INSERT INTO uploadFile " +
        "(filePath,fileName,uploadTime,uploadUserId) " +
        " VALUES (?,?,?,?)";
    var commentTime = until.formateTime();
    var params = [target_path, filename, commentTime, "1"];
    connection.query(query, params, function (err, results, fields) {
        if (err) {
            callback(err);
            connection.end();
            return;
        }
        callback();
        connection.end();
    });
}

console.log(path.join(__dirname, "./../"));
