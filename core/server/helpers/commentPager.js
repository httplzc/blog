var hbs = require('express-hbs');
module.exports = function (currentPage, pagerCount, option) {
	if(pagerCount<currentPage)
		return "";
     var out = "";
    for (var i = 0; i < pagerCount; i++) {
        if (i == currentPage - 1) {
            out += "<li><a class='active'>" + (i + 1) + "</a></li>";
        }
        else {
            out += "<li><a class='inactive'>" + (i + 1) + "</li>";
        }
    }
    if (currentPage != pagerCount) 
        out += "<li><a class='inactive' id='comment_next_page'>下一页</a></li>";
    return new hbs.handlebars.SafeString(out);
};