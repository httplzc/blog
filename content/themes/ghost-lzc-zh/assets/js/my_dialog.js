$(function () {
    var appendChild = "<div class='overlay' id='dialog_overlay'></div>" +
        "<div class='md-modal' id='dialog'> <div class='md-content'> <h3 id='dialog_title'>感谢</h3> <div>"
        + "<p id='dialog_content'>感谢你的评论！</p> <button id='dialog_close' class='dialog_close_btn'>关闭</button> </div> </div> </div>";
    $("body").prepend(appendChild);
});
$(function () {
    $("#text").click(function () {
        console.log("点击了");
        showDialog("提醒", "有错误发生了！");
    })
});
function showDialog(title, content) {
    console.log("title" + title + "--" + content);
    $("#dialog_close").click(function () {
        hideDialog();
    });
    $("#dialog_overlay").click(function () {
        hideDialog();
    });
    $("#dialog_overlay").css("visibility", "visible");
    $("#dialog").css("visibility", "visible");
    console.log("anim");

    $("#dialog_overlay,#dialog").animate({
        opacity: '1'
    }, 200, function () {

    });

    $("#dialog_title").text(title);
    $("#dialog_content").text(content);

}

function cancelDialog() {
    $('#dialog').stop();
    $('#dialog_overlay').stop();
    $("#dialog_overlay").css("visibility", "hidden");
    $("#dialog").css("visibility", "hidden");
    $("#dialog").css("opacity", "0");
    $("#dialog_overlay").css("opacity", "0");
    
}

function hideDialog() {

    $("#dialog_overlay,#dialog").animate({
        opacity: "0"
    }, 200, function () {
        $("#dialog_overlay").css("visibility", "hidden");
        $("#dialog").css("visibility", "hidden");
    });
    $('#dialog').unbind("click");
    $('#dialog_overlay').unbind("click");
}