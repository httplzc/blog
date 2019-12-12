var permission = require("./checkPermission");
module.exports = function (res, req) {
    permission(res, req, function () {
        res.render("uploadfile", {});
    });
};