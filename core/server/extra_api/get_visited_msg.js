/**
 * Created by asus-pc on 2017/7/2.
 */
var connectDb = require("./../extra_untils/connectDB");
var until = require("./../extra_untils/Until");
module.exports = function (res, req) {
    var connection = connectDb();
    var sql = "SELECT SUM(temp.totalAndroidCount) AS totalAndroidCount ," 
+"SUM(temp.totalIosCount) AS totalIosCount ,"
+"SUM(temp.totalCount) AS totalCount ,"
+"SUM(temp.todayCount) AS todayCount ,"
+"SUM(temp.todayAndroidCount) AS todayAndroidCount ,"
+"SUM(temp.todayIosCount) AS todayIosCount ,"
+"COUNT(temp.totalCount) AS totalIpCount "
+"FROM (SELECT  COUNT(if(agent REGEXP 'android',TRUE,NULL)) AS totalAndroidCount ,"
			+"COUNT(if(agent REGEXP 'ipad|iphone',TRUE,NULL)) AS totalIosCount ,"
     +"COUNT(id) AS totalCount,COUNT(if(time>?,TRUE,NULL)) AS todayCount,"
     +"COUNT(if(time>? AND agent REGEXP 'android' ,TRUE,NULL)) AS todayAndroidCount,"
     +"COUNT(if(time>? AND agent REGEXP 'ipad|iphone' ,TRUE,NULL)) AS todayIosCount "
			+"FROM tour_visited_history GROUP BY ip)temp";
    var date=new Date();
    date.setHours(0); 
    date.setMinutes(0);
    date.setSeconds(0);
    var time=until.formateTime(date);
    connection.query(sql, [time,time,time], function (err, results, fields) {
        if (err || results.length == 0) {
            until.error(err, res);
            connection.end();
            return;
        }
        res.json(until.dealAfter({
            totalAndroidCount: results[0].totalAndroidCount,
            totalIosCount: results[0].totalIosCount,
            totalCount: results[0].totalCount,
            todayCount: results[0].todayCount,
            todayAndroidCount: results[0].todayAndroidCount,
            todayIosCount: results[0].todayIosCount,
			totalIpCount: results[0].totalIpCount
        }));
        connection.end();
    });
};