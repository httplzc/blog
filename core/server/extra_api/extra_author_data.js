/**
 * Created by Administrator on 2017/6/25 0025.
 */
var until = require("./../extra_untils/Until");
var model_extra_author = require("./../extra_model/model_extra_author");
module.exports = function (res, req) {
    var author_id = req.query.author_id;
    if (author_id == null) {
        until.error("缺少参数", res);
        return;
    }
    model_extra_author.getData(author_id, function (data, error) {
        if (data) {
            res.json(until.dealAfter(data, res));
        }
        else {
            until.error("获取失败", error);
        }
    });
};