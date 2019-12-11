var model_extra_author = require("../extra_model/model_extra_author");
var model_extra_post = require("../extra_model/model_extra_post");
function addExtraData(sessionId,respense, callback, author_id, post_id) {
    model_extra_author.getData(author_id, function (data, error) {
		respense.post.author=Object.assign(respense.post.author, {extra_author: data});
        model_extra_post.getData(post_id,sessionId,function (data, error) {
			respense.post=Object.assign(respense.post, {extra_post: data})
			callback(respense);
        })
    });
}

function addExtraPostData(respense, callback) {
    var length = respense.posts.length;
    var start = (respense.pagination.page - 1) * respense.pagination.limit;
    model_extra_post.getDatas(start, length, function (data, error) {
        if (data) {
            for (var i = 0; i < data.length; i++) {
                respense.posts[i] = Object.assign(respense.posts[i], {extra_post: data[i]});
            }
        }
        callback(respense);
    });
}

exports.addExtraData = addExtraData;
exports.addExtraPostData = addExtraPostData;