var permission = require("./checkPermission");
var storage = require('../storage');

module.exports = function (res, req) {
    permission(res, req, function () {
        res.render("uploadCdn", {uploadToken: storage.getStorage().createToken()});
    });
};