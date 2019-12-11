/**
 * Created by Administrator on 2017/7/6 0006.
 */

/**
 * Created by asus-pc on 2017/7/2.
 */
var connectDb = require("./../extra_untils/connectDB");
var until = require("./../extra_untils/Until");
module.exports = function (res, req) {

    var page = req.query.page;
    var pageCount = 8;
    var keyWord = req.query.keyWord;
    //0 综合 1 热门 2 最新  3 最多评论
    var orderType = req.query.orderType;
    if (orderType == null)
        orderType = 0;
    if (page == null)
        page = 0;
    getData(page, pageCount, keyWord, orderType,function (data, error) {
        if (error) {
            until.error(error, res);
        }
        else {
            res.json(until.dealAfter(data));
        }
    });

};


function getData(page, pageCount, keyWord, orderType,callback) {
    var keys = null;
	var originKeys="";
    if (keyWord == null)
        keys = "%";
    else {
        keys = keyWord.split(" ");
		originKeys=keyWord.split(" "); 
    }
    var data = "";
    for (var i = 0; i < keys.length; i++) {
        data += (i===0?"":"OR")+" posts.title LIKE ? ";
        keys[i] = "%" + keys[i] + "%";
    }

    var sql = "SELECT users.name,posts.read_count,users.image,posts.id ,posts.title,"
        + " CONCAT(DATE_FORMAT(posts.created_at,'/%Y/%m/%d/'),posts.slug) AS url,posts.html AS content,"
        + " DATE_FORMAT(posts.published_at,'%Y-%m-%d') AS time,"
        + " (SELECT COUNT(id) FROM tour_like WHERE postId=posts.id) AS  likeCount,"
        + " (SELECT COUNT(id) FROM tour_comment WHERE postId=posts.id) AS  commentCount,"
        + " (SELECT COUNT(id) FROM posts WHERE posts.status='published'  AND (" +data+")) AS  count"
        + " FROM posts"
        + " LEFT JOIN  users ON users.id=posts.author_id"
        + " WHERE posts.status='published'  AND (" + data+")"
        + " GROUP BY posts.id";

    var order = "";
    if (orderType == 1) {
        order = " ORDER BY posts.read_count DESC ";
    }
    else if (orderType == 2) {
        order = " ORDER BY posts.published_at DESC";
    }
    else if (orderType == 3) {
        order = " ORDER BY commentCount DESC";
    }
    sql += order;
    sql+=" LIMIT ?,?";
	
     var params=[];
    for(var x=0;x<2;x++)
    {
        for(var y=0;y<keys.length;y++)
        {
            params[params.length]=keys[y];
        }
    }
    params[params.length]=page * pageCount;
    params[params.length]=pageCount; 
    console.log(data + "  --   " + params + "  -- " + keys);
    var connection = connectDb();
    connection.query(sql, params, function (err, results, fields) {
        if (err) {
            callback(null, err);
            connection.end();
            return;
        }
        var count = 0;
        var postList = [];
        for (var i = 0; i < results.length; i++) {
            postList[i] = {
                id: results[i].id,
                author: {name: results[i].name, image: results[i].image},
                likeCount: results[i].likeCount,
                read_count: results[i].read_count,
                title: formatSearchTitle(results[i].title,originKeys),
                postUrl: results[i].url,
                postContent: results[i].content.replace(/<[^>]*>/g, "").replace(/\s/g, "").substr(0, 300),
                time: results[i].time,
                commentCount: results[i].commentCount
            };
            count = results[i].count;
        }
        var pagerCount = count % pageCount != 0 ? Math.floor(count / pageCount + 1)
            : Math.floor(count / pageCount);
        callback({posts: postList, currentPage: parseInt(page)+ 1, pagerCount: pagerCount, keyWord: keyWord, totalCount: count,orderType:orderType});
        connection.end();
    });
}

 function formatSearchTitle(title, keyWords) {
		if(keyWords.length==0||(keyWords.length==1&&keyWords[0]==""))
			return title;
        var params = "";
        for (var i = 0; i < keyWords.length; i++) {
            if (i !== 0)
                params += "|";
            params += keyWords[i];
        }
        var regExp=new RegExp(params,"g");
       return title.replace(regExp, "<span class='search_result_keyword'>" + "$&"+"</span>");
    }


module.exports.getData = getData;


