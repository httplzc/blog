// Qiniu CDN support
// Copyright: GhostChina.com

var _ = require('lodash'),
    express = require('express'),
    fs = require('fs-extra'),
    path = require('path'),
    util = require('util'),
    utils = require('../utils'),
    Promise = require('bluebird'),
    config = require('../config'),
    errors = require('../errors'),
    baseStore = require('./base'),
    crypto = require('crypto'),

    qiniu = require('qiniu'),
    qiniuConfig = config.storage,
    options = {scope: qiniuConfig.bucketname},
    mac = new qiniu.auth.digest.Mac(qiniuConfig.ACCESS_KEY, qiniuConfig.SECRET_KEY),
    configQi = new qiniu.conf.Config(),
    putPolicy = new qiniu.rs.PutPolicy(options),
    extra = new qiniu.form_up.PutExtra();

function QiniuStore() {
}

util.inherits(QiniuStore, baseStore);
configQi.zone = qiniu.zone.Zone_z2;

QiniuStore.prototype.createToken =function () {
    return putPolicy.uploadToken(mac);
};

QiniuStore.prototype.save = function (image) {
    var uptoken = putPolicy.uploadToken(mac);
    var md5sum = crypto.createHash('md5'),
        ext = path.extname(image.name),
        targetDirRoot = qiniuConfig.root,
        targetFilename,
        key,
        extra = new qiniu.form_up.PutExtra();

    var savedpath = path.join(config.paths.imagesPath, image.name);

    return Promise.promisify(fs.copy)(image.path, savedpath).then(function () {
        return Promise.promisify(fs.readFile)(savedpath);
    }).then(function (data) {
        md5 = md5sum.update(data).digest('hex');
        targetFilename = path.join(targetDirRoot, md5.replace(/^(\w{1})(\w{2})(\w+)$/, '$1/$2/$3')) + ext;
        targetFilename = targetFilename.replace(/\\/g, '/');
        key = targetFilename.replace(/^\//, '');
        var formUploader = new qiniu.form_up.FormUploader(configQi);
        return new Promise(function (resolve, reject) {
            formUploader.put(uptoken, key, data, extra, function (respErr,
                                                                  respBody, respInfo) {
                if (respErr) {
                    reject(respErr)
                }
                if (respInfo.statusCode == 200) {
                    console.log(respBody);
                    resolve()
                } else {
                    console.log(respInfo.statusCode);
                    console.log(respBody);
                    reject()
                }
            });
        });
    }).then(function () {
        // Remove temp file
        return Promise.promisify(fs.unlink)(savedpath);
    }).then(function () {
        // prefix + targetFilename
        var fullUrl = qiniuConfig.prefix + targetFilename;
        return fullUrl;
    }).catch(function (e) {
        errors.logError(e);
        return Promise.reject(e);
    });
};

QiniuStore.prototype.exists = function (filename) {
    return new Promise(function (resolve) {
        fs.exists(filename, function (exists) {
            resolve(exists);
        });
    });
};

QiniuStore.prototype.serve = function () {
    // For some reason send divides the max age number by 1000
    return express['static'](config.paths.imagesPath, {maxAge: utils.ONE_YEAR_MS});
};

module.exports = QiniuStore;