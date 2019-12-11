var isUpload;
function floatDeal(data) {
   return Math.floor(data * 100) / 100;
}
$(function () {
    $(".btn").click(function () {
        if (isUpload) {
            alert("只能同时上传一个文件！");
            return false;
        }

        var filename = $(".filename").val();
        var file = $(".file").val();


        if (filename == null || filename.trim() === "") {
            alert("文件名不能为空！");
            return false;
        }
        if (!$(".file")[0].files[0]) {
            alert("文件不能为空！");
            return false;
        }
        var fileLength = $(".file")[0].files[0].size;
        if (file == null || fileLength > 100 * 1024 * 1024) {
            alert("文件不能超过100m！");
            return false;
        }
        isUpload = true;
        $('.btn').text("文件正在上传中……");
        $('#form').ajaxSubmit({
            xhr: xhrOnProgress(function (e) {
                var percent = e.loaded / e.total;//计算百分比
                console.log("progress    "+e.loaded);
                $('#progress').val(percent * 100);
                $('#progress_text').text(floatDeal(percent*100) + "%");
                $('#total').text(floatDeal(e.total/1024/1024));
                $('#currentSize').text(floatDeal(e.loaded/1024/1024));
            }),
            success: function (data) {
                resetForm();
                if (data.code !== 0) {
                    alert("错误:"+ "上传失败:" + JSON.stringify(data.error));
                }
                else
                    alert("上传文件成功");
            },
            error: function (error) {
                resetForm();
                alert("错误"+"上传失败请重试！" + JSON.stringify(error));
            }
        });
        return false; // 阻止表单自动提交事件
    });
});

function resetForm() {
    $('#form').resetForm();
    $('.btn').text("上传文件");
    isUpload = false;
    $('#progress').val(0);
    $('#progress_text').text(0 + "%");
    $('#total').text(0);
    $('#currentSize').text(0);
}


var xhrOnProgress = function (fun) {
    xhrOnProgress.onprogress = fun; //绑定监听
    //使用闭包实现监听绑
    return function () {
        //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
        var xhr = $.ajaxSettings.xhr();
        //判断监听函数是否为函数
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }
        return xhr;
    }
};

function onFileChange(doc) {
    if ($('.file')[0].files[0]) {
        $(".filename").val($('.file')[0].files[0].name);
        $('#total').text(floatDeal($('.file')[0].files[0].size/1024/1024));
    }
}
