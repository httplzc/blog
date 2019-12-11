var until = require("./../extra_untils/Until");
var connectDb = require("./../extra_untils/connectDB");
var fs = require('fs');
var path = require('path');

module.exports = function (res, req) {
    if (req.session.isLoginFile) {
        var id = req.body.fileId;
        if (!id || id.trim() === "") {
            until.error("缺少参数", res);
            return;
        }

        getFilePath(id).then(function (data) {
            return deleteFile(data);
        }).then(function (data) {
            return deleteData(id);
        }).then(function (data) {
            res.json(until.dealAfter(""))
        }).catch(function (data) {
            until.error(data, res)
        });
    }
    else
        until.error("你没有登录！", res);
};

function deleteData(id) {
    var connection = connectDb();
    var params = [id];
    var sql =
        "DELETE FROM uploadFile"
        + " WHERE id=?";
   return new Promise(function (success, fail) {
       connection.query(sql, params, function (err, results, fields) {
           if (err) {
               fail(err);
               connection.end();
               return;
           }
           success();
           connection.end();
       });
   })
}

function deleteFile(filePath) {
    return new Promise(function (success, fail) {
        var realPath = path.join(__dirname, "../..") + filePath;
        fs.unlink(realPath, function (error) {
            if (error) {
               fail(error);
            }
            else
                success();
        });
    });
}

function getFilePath(id) {
    var sql = "SELECT id,filePath"
        + " FROM uploadFile WHERE id = ?";
    var params = [id];
    var connection = connectDb();
    return new Promise(function (resolve, reject) {
        connection.query(sql, params, function (error, results) {
            if (error || !results) {
                reject(error);
                connection.end();
            }
            else if (results.length === 0) {
                reject("不存在");
                connection.end();
            }
            else {
                resolve(results[0].filePath);
            }
        });
    });
}