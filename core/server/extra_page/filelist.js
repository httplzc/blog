var filelist = require('./../extra_api/filelist');
var permission = require("./checkPermission");
module.exports = function (res, req) {
    permission(res, req, function () {
        filelist(res, req, function (data) {
            res.render("filelist", data);
        });
    });
};