var RequestUrl = "/extra_api";
if (browserRedirect()) {
    $(".more-btn").hide();
}

window._bd_share_config = {
    "common": {
        "bdSnsKey": {},
        "bdText": "这是篇很有趣的博文！",
        "bdMini": "2",
        "bdMiniList": false,
        "bdPic": "",
        "bdStyle": "1",
        "bdSize": "24"
    }, "share": {}
};


$(document).ready(function () {
    if (!browserRedirect()) {
        setTimeout(function () {
            window._bd_share_main.init();
        }, 2000);
    }
	else
	{
		$(".blog-logo").css("position","relative");
	}
    $(document).ajaxError(function () {
        showDialog("错误","一个错误发生了！");
    });

});

//设置阅读
window.onload = function () {
    $.post(RequestUrl, {a: "set_read", post_id: $("article")[0].id}, function (data) {
    });
};

function comment_push() {
    var comment_name = $("#author").val();
    var comment_content = $("#comment").val();
    var comment_email = $("#email").val();
    var post_id = $(".post_id").attr("value");
    if (post_id == null || post_id.trim() == "") {
        showDialog("错误","网页数据不全，请刷新！");
        return;
    }
    if (comment_content == null || comment_content.trim() == "") {
        showDialog("错误","评论内容不能为空");
        return;
    }
    if (comment_name == null || comment_name.trim() == "") {
        showDialog("错误","评论名字不能为空");
        return;
    }
    if (comment_name.length > 10 || comment_name.replace(/\s/g, "").length < 1) {
        showDialog("错误","名字字数不能超10个！");
        return;
    }
    if (comment_content.length > 80 || comment_content.replace(/\s/g, "").length < 2) {
        showDialog("错误","评论字数不能超过80个！");
        return;
    }
	var pattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
	if(pattern.test(comment_content)||pattern.test(comment_name)||pattern.test(comment_email))
	{
		showDialog("错误","不能含有表情！");
        return;
	}
    $("#submit").attr('disabled', true);
    $.post("/extra_api", {
        comment_content: comment_content, comment_name: comment_name
        , comment_email: comment_email, post_id: post_id, a: "add_comment"
    }, function (data, status) {
        if (status !== "success") {
            showDialog("错误","评论失败请重试！" + error);
        }
        else if (data.code !== 0) {
            showDialog("错误","评论失败:" + JSON.stringify(data.error));
        }
        else {
            showDialog("感谢","感谢评论！~");
            $("#comment").val("");
            $("#author").val("");
            $("#email").val("");
            requestComment(0,true);
        }
        $("#submit").attr('disabled', false);
    });
    console.log("post_id" + post_id);
}


function loadStyleString(cssText) {
    var style = document.createElement("style");
    style.type = "text/css";
    try {
        // firefox、safari、chrome和Opera
        style.appendChild(document.createTextNode(cssText));
    } catch (ex) {
        // IE早期的浏览器 ,需要使用style元素的stylesheet属性的cssText属性
        style.styleSheet.cssText = cssText;
    }
    document.getElementsByTagName("head")[0].appendChild(style);
}

function loadPay() {
    if (!browserRedirect()) {
        $(document).ready(function () {
            $(".btn-pay").hover(function () {
                // $(".pay_group").fadeIn("400");

            }, function () {
                $(".pay_group").fadeOut("400");
            });
            $(".btn-pay").click(function () {
                $(".pay_group").fadeToggle("400");
            });
        });
    } else {
        $(document).ready(function () {
            $(".pay_group").show();
            $(".btn-pay").hide();
        });
        var css = ".money-group {position: relative;bottom:-18rem;margin-bottom:4rem;}";
        loadStyleString(css);
    }
}
loadPay();


function setLiked() {
	$(".like").attr("class", "like-inactive");
	 var count = $("#like-count");
    count.text(parseInt(count.text()) + 1);
    $.post(RequestUrl, {a: "set_like", post_id: $("article")[0].id}, function (data, status) {
        if (status == "success" && data.code == 0) {
           
        }
        else {
			  $(".like-inactive").attr("class", "like");
			 var count = $("#like-count"); 
			count.text(parseInt(count.text()) - 1);
            showDialog("错误","点赞失败！ " + JSON.stringify(data.error));
        }
    });

}


$(function () {
    $(".like-group").click(function () {
        if ($(".like-inactive").length == 0)
            setLiked();
    });
    if ($(".like-group").attr("value") == "true") {
        $(".like").attr("class", "like-inactive");
    }
});

var pageData = 0;
var page_oneData = 5;
var comment_count=0;

$(function () {
    comment_count = $(".comments-count").attr("value");
    if (comment_count == null || comment_count == "" || comment_count == 0) {
        $("#comment_group").hide();
        return
    }
    requestComment(pageData,false);

});


function requestComment(pageData,needScroll) {
    $.get(RequestUrl, {
        a: "get_comment",
        post_id: $("article")[0].id,
        page: pageData,
        page_one: page_oneData
    }, function (data, status) {
        if (!data.code) {
			$("#comment_group").show();
            $("#comment_group").html(data);
            window.pageData=pageData;
            setCommentPagerClick();
            if(needScroll)
                scrollToCommentFirst();
        }
    });
}


function setCommentPagerClick() {
    var lis = $(".pagination").children();
    for (var i = 0; i < lis.length; i++) {
        var li = lis[i];
        var childA = li.children[0];
        if ($(childA).attr("class") == "inactive") {
            console.log("aaatt"+$(childA).attr("id"));
            //下一页
            if ($(childA).attr("id") == "comment_next_page") {
                $(li).click(function () {
                    requestComment(pageData+1,true);
                })
            }
            else {
                (function(childA){
                    $(li).click(function () {
                        requestComment(parseInt($(childA).text())-1,true);
                    })})(childA);
            }
        }
    }
}

function scrollToCommentFirst() {
    var height = $("header").outerHeight() + $("article").outerHeight();
    $(document).scrollTop(height);
} 







