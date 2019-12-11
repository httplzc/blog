/**
 * Created by Administrator on 2017/7/7 0007.
 */
function setPagerClick() {
    var lis = $(".pagination").children();
    for (var i = 0; i < lis.length; i++) {
        var li = lis[i];
        var childA = li.children[0];
        if ($(childA).attr("class") == "inactive") {
            //��һҳ
            if ($(childA).attr("id") == "comment_next_page") {
                $(childA).attr("href", "/search?a=search&page=" + (currentPage) + "&keyWord=" + keyWord);
            }
            else {
                (function (childA) {
                    $(childA).attr("href", "/search?a=search&page=" + (parseInt($(childA).text()) - 1) + "&keyWord=" + keyWord);
                })(childA);
            }
        }
    }

    var childSort = $(".sort-type").children();
    for (i = 0; i < childSort.length; i++) {
        if ($(childSort[i]).attr("class") != 'active')
            $(childSort[i]).attr("href", "/search?a=search&page=" + 0 + "&keyWord=" + keyWord + "&orderType=" + i);
    }
}

var currentPage = 0;
var keyWord = "";
$(function () {
    currentPage = parseInt($(".page-title").attr("page"));
    if (currentPage == Number.NaN)
        currentPage = 0;
    keyWord = $(".page-title").attr("keyword");
    setPagerClick();
});

$(function () {
    var titles = $(".post-title");
    for (var i = 0; i < titles.length; i++) {
        var text = $(titles[i].children[0]).text();
        $(titles[i].children[0]).html(text);
    }
});
