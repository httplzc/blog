/**
 * Created by Administrator on 2017/6/24 0024.
 */
var extra_author_data = require("./extra_author_data");
var extra_post_data = require("./extra_post_data");
var set_read = require("./set_read");
var set_like = require("./set_like");
var add_comment = require("./add_comment");
var busboy = require('./../middleware/ghost-busboy');


function route(req, res, isPost) {
    var method;
    if (isPost)
        method = req.body.a;
    else
        method = req.query.a;

    if (method == null)
        throw '缺少方法名';
    var requestDeal = require("./" + method);
    if (requestDeal != null)
        requestDeal(res, req);
    else {
        throw '没有该方法';
    }
}


module.exports = function (app, middleware) {
    app.get('/extra_api', function (req, res) {
            try {
                route(req, res, false);
            } catch (e) {
                res.send("error:" + e);
            }
        }
    );
    app.post('/extra_api', function (req, res) {
            try {
                route(req, res, true);
            } catch (e) {
                res.send("error:" + e);
            }
        }
    );
    app.post('/upload', busboy, function (req, res) {
            try {
                route(req, res, true);
            } catch (e) {
                res.send("error:" + e);
            }
        }
    );

};
