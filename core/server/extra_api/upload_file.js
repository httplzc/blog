var fs = require('fs');
var path = require('path');
var uuid = require('./../extra_untils/UUID');
var until = require("./../extra_untils/Until");
var connectDb = require("./../extra_untils/connectDB");
module.exports = function (res, req) {
    if (!req.session.isLogin) {
        until.error("未登录", res);
    }
    var filename = req.body.filename;
    if (req.files != null)
        var file = req.files.file;
    if (filename == null || filename.trim() === "" || file == null || file.path == null) {
        until.error("参数错误！", res);
        return;
    }
    if (fs.statSync(file.path).length > 100 * 1024 * 1024) {
        until.error("文件过大！", res);
        return;
    }
    var relativePath = "/file/" + uuid() + "_file_" + Date.now() + filename;
    var target_path = path.join(__dirname, "../.." + relativePath);
    fs.rename(file.path, target_path, function (err) {
        if (err) {
            until.error(err, res);
        } else {
            saveToSql(res, filename, relativePath, function (error) {
                if (error) {
                    until.error("", res);
                } else {
                    res.json(until.dealAfter(""));
                }
            });
        }

    });
};

function saveToSql(filename, target_path, callback) {
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
