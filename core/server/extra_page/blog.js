var frontend=require("./../controllers/frontend");
module.exports = function (res, req) {
    frontend.index(req,res,function () {

    })
};