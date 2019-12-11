var get_hot_posts = require("./get_hot_posts");
var until = require("./../extra_untils/Until");
module.exports = function (res, req) {
    get_hot_posts.getHotPostDatas(4, function (data, error) {
        if (error) {
            until.error(error, res);
            return;
        }
        res.render("hot_post_item", data);
    });
};
