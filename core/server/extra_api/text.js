/**
 * Created by Administrator on 2017/6/29 0029.
 */
module.exports = function (res, req) {
    console.log(req.cookies.count);
    if (req.cookies.count) {
        res.cookie("count",parseInt(req.cookies.count)+1);
    }
    else {
        res.cookie("count",1);
        req.cookies.count=1;
    }

    res.send("ip" + req.ip + "------------" + "请求者session" + JSON.stringify(req.session) +"    "+req.session.id+ "-------" + "请求者" + req.cookies.count);
};