/**
 * Created by Administrator on 2017/6/26 0026.
 */
var http = require('http');

function BackData(data, code, error) {
    this.contentData = data;
    this.code = code;
    this.error = error;
}

exports.dealAfter = function dealAfter(data) {
    return new BackData(data, 0, "");
};

exports.error = function error(error, res) {
    res.json(new BackData("", -1, error));
};

exports.formateTime = function timeStamp2String(time) {
    var datetime = new Date();
    if (time != null)
        datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    var mseconds = datetime.getMilliseconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second + "." + mseconds;
};

exports.getIpMsg= function getIpMsg(commentIp, callback) {
        var req = http.get({
            host: "ip.taobao.com",
            port: 80,
            path: "/service/getIpInfo.php?ip=" + commentIp
        }, function (res) {
            var data = "";
            res.on("data", function (back_data) {
                if (back_data != null)
                    data += back_data;
            });
            res.on("end", function () {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    callback("", "");
                    return;
                }
                console.log(data + "----" + data.data);
                if (data.data != null && data.code == 0)
                    callback(data.data.region, data.data.city);
                else
                    callback("", "");
            })
        });
        req.on("error", function (err) {
            console.log("error");
            callback("", "");
        })
    };
