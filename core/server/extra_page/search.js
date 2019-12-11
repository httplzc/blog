var until = require("./../extra_untils/Until");
var search = require("./../extra_api/search");
module.exports = function (res, req) {

    var page = req.query.page;
    var pageCount = 8;
    var keyWord = req.query.keyWord;
    //0 综合 1 热门 2 最新  3 最多评论
    var orderType = req.query.orderType;
    if (orderType == null)
        orderType = 0;
    if (page == null)
        page = 0;
    search.getData(page, pageCount, keyWord, orderType,function (data, error) {
        if (error) {
            until.error(error, res);
        }
        else {
            res.render("search", data);
        }
    });

};
