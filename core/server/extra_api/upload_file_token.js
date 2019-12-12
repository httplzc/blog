var storage = require('../storage');
var until = require("./../extra_untils/Until");

module.exports = function (res, req) {
    if (!req.session.isLogin) {
        res.json(until.error("未登录", res));
        return
    }
    var store = storage.getStorage();
    res.send(store.createToken())
};