const NAME_WITHOUT_EXTENSION = 'nameWithoutExtension';

let resultsMap = {};

ready(handleReady);

function ready(fn) {
    document.addEventListener('DOMContentLoaded', fn);
}

function handleReady() {
    var uppy = Uppy.Core({
        autoProceed: false,
        meta: {
            // for qiniu: start
            token: window.CHUAN.qiniuUploadToken,
            accept: 'application/json',
            // for qiniu: end
            basePath: "tiny_cloud"
        },
        onBeforeUpload: handleBeforeUpload
    });

    uppy.use(Uppy.Dashboard, {
        inline: true,
        width: '100%',
        height: '100vh',
        target: '#root',
        metaFields: [
            {id: NAME_WITHOUT_EXTENSION, name: '文件名'},
            {id: 'basePath', name: '文件路径前缀'}
        ]
    });
    uppy.use(Uppy.XHRUpload, {
        /**
         * @see https://developer.qiniu.com/kodo/api/1312/upload
         *
         * 上传接口地址：https://developer.qiniu.com/kodo/manual/1272/form-upload
         */
        endpoint: 'https://upload-z2.qiniup.com',
        fieldName: 'file',
        metaFields: ['accept', 'name', 'type', 'key', 'token'],
        getResponseData(responseText) {
            const data = JSON.parse(responseText);
            return {
                url: `http://cdn.lizechao.com/${data.key}`
            };
        },
        getResponseError(responseText) {
            let errorMessage;
            try {
                errorMessage = JSON.parse(responseText).error;
            } catch (error) {
                errorMessage = '未知错误';
            }

            return new Error(errorMessage);
        }
    });

    uppy.on('file-added', file => {
        const toAddHash = false;

        const storeNameWithoutExtension = () => {
            uppy.setFileMeta(file.id, {
                [NAME_WITHOUT_EXTENSION]: file.name.replace(
                    new RegExp(`\\.${file.extension}$`),
                    ''
                )
            });
        };

        if (!toAddHash) {
            storeNameWithoutExtension();
            return;
        }

        getFileHash(file).then(hash => {
            if (!hash) return;

            uppy.setFileMeta(file.id, {hash});
            storeNameWithoutExtension();
        });
    });

    uppy.on('complete', result => {
        console.group('complete');
        console.log(result);

        const items = result.successful.reduce(function (acc, item) {
            acc.push({key: item.meta.key});
            console.log({acc});

            return acc;
        }, []);

        console.log({items});
        doOnFinish(items);
        $(".sync_btn").show();
        console.groupEnd();
    });

    uppy.run();


    function doOnFinish(datas) {
        window.uploadFinishFiles=datas
    }

    codeInit();

    function handleBeforeUpload({...files}) {
        console.group('handleBeforeUpload');
        console.log(files);
        console.groupEnd();

        const fileIDs = Object.keys(files);
        let preventUpload = false;

        fileIDs.forEach(fileId => {
            const file = files[fileId];
            const reg = /^(?!\/)(\S+\/?)+(?!\/)$/;
            processFileBeforeUpload(file);

            if (!reg.test(file.meta.basePath)) {
                uppy.info(
                    `文件 ${file.meta.key} 的路径前缀 ${file.meta.basePath} 必须符合 /${
                        reg.source
                    }/ 格式`,
                    'error',
                    8000
                );
                preventUpload = true;
            }
        });
        console.group('after process');
        console.log(files);
        console.groupEnd();

        return preventUpload ? false : files;
    }

    function processFileBeforeUpload(file) {
        const toAddHash = false
        const prefix = file.meta.basePath.replace(/^(\w+)\/$/, '$1');
        const fileName = `${file.meta[NAME_WITHOUT_EXTENSION]}${
            toAddHash ? `-${file.meta.hash}` : ''
        }.${file.extension}`;
        const key = `${prefix ? prefix + '/' : ''}${fileName}`;

        file.meta.key = key;
    }
}

function codeInit() {
    $('#root').on('click', '.uppy-DashboardItem', function () {
        const uppyId = $(this).attr('id');
        const id = uppyId.replace('uppy_', '');
        const imageUrl = resultsMap[id];
        if (!imageUrl) return;
        const img = new window.Image();
        img.onload = function () {
            $('#code-text').text(`
  <Image
    src="${imageUrl}"
    width={${img.width}}
    height={${img.height}}
  />
      `);
        };
        img.src = imageUrl;
    });
}

function getFileHash(file) {
    const BMF = window.browserMD5File;

    return new Promise((resolve, reject) => {
        const bmf = new BMF();
        bmf.md5(file.data, (err, md5) => {
            if (err) {
                return reject(err);
            }

            return resolve(md5);
        });
    });
}
