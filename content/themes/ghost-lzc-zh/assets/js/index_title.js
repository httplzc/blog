/**
 * Created by Administrator on 2017/7/4 0004.
 */
if(!browserRedirect())
{
	$(window).scroll(function () {
	//$(".active .smoot_scroll").text($(window).scrollTop());
	onScrollDo();
});
}






function onScrollDo()
{
	var top = $(window).scrollTop();
	var refreHeight=$("header").outerHeight();
    if (top >= refreHeight && ($(".demo-header-bottom").attr("style") == null)) {
		console.log("aaaa");
        $(".demo-header-bottom").css({"width": "100%", "position": "fixed", "top": "0px"});
		$(".wrapper").css("top",$("#head_sticker").height());
		$(".siedebar-custom").css("top",$("#head_sticker").height());
	

    }
    else if (top < refreHeight && $(".demo-header-bottom").attr("style")) {
        $(".demo-header-bottom").removeAttr("style");
		$(".wrapper").css("top",0);
		$(".siedebar-custom").css("top",0);
		console.log("bbbbb");
    }
}

$(function(){
    $("form.search .search-input").focus(function () {
        console.log("focus");
        $("form.search .search-input").animate({width:'160px'},100,function () {
			
        });
    });
    $("form.search .search-input").blur(function () {
        console.log("unfocus");
        $("form.search .search-input").animate({width:'100px'},100,function () {
        });
    });
});




$(function () {
    $.get("/extra_api/?a=get_visited_msg",function (data, status) {
        if(data.code==0&&data.contentData)
        {
            $("#totalCount").text(data.contentData.totalCount*9);
            $("#todayCount").text(data.contentData.todayCount*9);
            $("#totalIpCount").text(data.contentData.totalIpCount*9);
        }
    });
});

$(function () {
        $.post("/extra_api",
            {
                a: "get_hot_posts_page",
            }, function (data, status) {
                if (data && !data.code) {
                    $(".glimmer_latest_post_widget").append(data);
                }
            });
    }
);

$(function(){
	$(".search-btn").click(function()
	{
		$(".search").submit();
	})
	$(".search-btn-phone").click(function()
	{
		$(".seach_phone").submit();
	})
	
	
	$("#bdcsMain").keydown(function(e){
    if(e.keyCode==13){
        $(".search").submit();
		}
	});
	
	$("#phone_search_btn").keydown(function(e){
    if(e.keyCode==13){
        $(".phone_search").submit();
		}
	});
	
	
	
	
	$("#phone_search").click(function()
	{
		$(".seach_phone").toggle();
	})
});


$(function () {
   $("#page3,#page4").click(function () {
        showDialog("提醒","功能正在研发中……");
   });
    $("#page2").click(function () {
		window.location.href="https://httplzc.tuchong.com"
   });
});　


