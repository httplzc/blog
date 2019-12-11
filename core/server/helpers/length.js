/**
 * Created by asus-pc on 2017/6/27.
 */
module.exports = function (data, options) {
    if (options == null || !(data instanceof Array))
        return 0;
    else {
        return data.length;
    }
};