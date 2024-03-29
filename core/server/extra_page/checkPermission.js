var Base64 = require('js-base64').Base64;
module.exports = function (res, req, callback) {
    if (req.headers.authorization && req.headers.authorization.indexOf("Basic") !== -1) {
        var data = Base64.decode(req.headers.authorization.substr("Basic ".length));
        var userAndPassword = data.split(":");
        if (userAndPassword && userAndPassword.length === 2 && userAndPassword[0].trim() === "httplzc" && userAndPassword[1].trim() === "lzc62825179") {
            req.session.isLogin = true;
            callback();
            return;
        }
    }
    res.setHeader("WWW-Authenticate", "Basic realm='www.lizechao.com'");
    res.status(401).send('账号密码不正确！');
};