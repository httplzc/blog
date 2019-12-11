var until = require("./../extra_untils/Until");
var model_extra_comment = require("../extra_model/model_extra_comment");
module.exports = function (res, req) {
    var post_id = req.query.post_id;
    var page = parseInt(req.query.page);
    var page_one = parseInt(req.query.page_one);
    if (post_id == null || page == null || page_one == null || isNaN(page) || isNaN(page_one)) {
        until.error("参数错误", res);
        return;
    }
  
    model_extra_comment.getDatas(post_id, page, page_one, function (data, error) {
        if (data) {
            var pagerCount = data.commentCount % page_one != 0 ? Math.floor(data.commentCount / page_one + 1)
                :Math.floor( data.commentCount / page_one);
            if (page > pagerCount - 1) {
                until.error("页数错误", res);
                return;
            }
            res.render('commentList', Object.assign(data, {
                currentPage: (page + 1),
                pagerCount: (pagerCount)
            }));
        }
        else {
            until.error(error, res);
        }
    });
};
