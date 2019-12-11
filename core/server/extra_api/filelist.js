var uuid = require('./../extra_untils/UUID');
var until = require("./../extra_untils/Until");
var connectDb = require("./../extra_untils/connectDB");
var model_extra_comment = require("../extra_model/model_extra_comment");
module.exports = function (res, req,originCallback) {
    var page = parseInt(req.query.page);
    var page_one = parseInt(req.query.page_one);
    if(!page||page===0)
        page=0;
    if(!page_one||page_one===0)
        page_one=100;
    var fileName=req.query.filename;
    if(!originCallback)
        originCallback=function (data) {
          res.json(data);
        };
    if (page == null || page_one == null || isNaN(page) || isNaN(page_one)) {
        until.error("参数错误", res);
        return;
    }

    getDatas(fileName, page, page_one, function (data, error) {
        if (data) {
            var pagerCount = data.fileCount % page_one !== 0 ? Math.floor(data.fileCount / page_one + 1)
                : Math.floor(data.fileCount / page_one);
            if (page > pagerCount - 1) {
                until.error("页数错误", res);
                return;
            }
            originCallback(Object.assign(data,{
                currentPage: (page + 1),
                pagerCount: (pagerCount)
            }));
        }
        else {
            originCallback(Object.assign("",{
                currentPage: 0,
                pagerCount: 0
            }));
        }
    });
};

function getDatas(fileName,page, pagerCount, callback) {
    var sql = "SELECT id,filePath,fileName,DATE_FORMAT(uploadTime,'%Y-%m-%d %H:%i') AS uploadTime"
        +",(SELECT COUNT(id) FROM uploadFile WHERE fileName LIKE ?) AS count "
        + " FROM uploadFile WHERE fileName LIKE ? ORDER BY uploadFile.uploadTime DESC LIMIT ?,?";
    if(!fileName)
        fileName="";
    var params = ["%"+fileName+"%","%"+fileName+"%",page * pagerCount, pagerCount];
    var connection = connectDb();
    connection.query(sql, params, function (error, results) {
        if (error || !results) {
            callback(null, JSON.stringify(error));
            connection.end();
        }
        else if (results.length === 0) {
            callback(null, "数据为空");
            connection.end();
        }
        else {
            var fileList = [];
            var count;
            for (var i = 0; i < results.length; i++) {
                count = results[i].count;
                fileList[i] = {
                    fileId: results[i].id,
                    fileName: results[i].fileName,
                    position: count - page * pagerCount - i,
                    filePath: results[i].filePath,
                    uploadTime: results[i].uploadTime
                };

            }
            callback({files: fileList, fileCount: count});


        }
    });
}

