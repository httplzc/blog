/**
 * Created by Administrator on 2017/6/25 0025.
 */
var until = require("./../extra_untils/Until");
var model_extra_post = require("./../extra_model/model_extra_post");
module.exports = function (res, req) {
    var post_id = req.query.post_id;
    if (post_id == null) {
        until.error("缺少参数", res);
        return;
    }

    model_extra_post.getData(post_id,req.session.id,function (data, error) {
        if (data)
            res.json(until.dealAfter(data, res));
        else
            until.error(error, res);
    });


};