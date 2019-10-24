/**
 * @file canvas读取图片
 * @author mengke01(kekee000@gmail.com)
 */

import ImageProcessor from 'graphics/image/ImageProcessor';
import findContours from 'graphics/image/contour/findContours';

let curImage = null;
let ctx = null;
let canvas = null;
let canvasSrc = null;
let processor = new ImageProcessor();


function getOptions() {
    return {
        threshold: $('#threshold-fn').val() ? $('#threshold-fn').val() : +$('#threshold-gray').val(),
        reverse: !!$('#threshold-reverse').get(0).checked
    };
}

function onUpFileChange(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {

        let img = curImage = new Image();
        img.onload = function () {

            canvasSrc.width = img.width;
            canvasSrc.height = img.height;
            canvasSrc.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
            let imgData = canvasSrc.getContext('2d').getImageData(0, 0, img.width, img.height);


            processor.set(imgData);
            processor.save();
            processingImage();
        };

        img.src = e.target.result;
    };

    reader.onerror = function (e) {
        console.error(e);
    };

    reader.readAsDataURL(file);
}

function processingImage() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let width = processor.imageData.width;
    let height = processor.imageData.height;
    canvas.width = width;
    canvas.height = height;

    let imgData = ctx.getImageData(0, 0, width, height);
    let putData = imgData.data;

    if ($('#show-binarized').get(0).checked) {

        let result = processor.clone().binarize(+$('#threshold-gray').val()).get();

        let resultData = result.data;
        for (let y = 0; y < height; y ++) {
            let line = width * y;
            for (let x = 0; x < width; x++) {
                let offset = line + x;
                putData[offset * 4] = resultData[offset];
                putData[offset * 4 + 1] = resultData[offset];
                putData[offset * 4 + 2] = resultData[offset];
                putData[offset * 4 + 3] = 255;
            }
        }

        let contours = findContours(result);
        contours.forEach(function (contour) {
            let flag = contour.flag;
            for (let i = 0, l = contour.length; i < l; i++) {
                let p = contour[i];
                let offset = p.y * width + p.x;
                putData[offset * 4] = flag ? 100 : 255;
                putData[offset * 4 + 1] = 0;
                putData[offset * 4 + 2] = 0;
                putData[offset * 4 + 3] = 255;
            }
        });
    }
    else {
        let result = processor.get();
        let resultData = result.data;
        for (let y = 0; y < height; y ++) {
            let line = width * y;
            for (let x = 0; x < width; x++) {
                let offset = line + x;

                putData[offset * 4] = resultData[offset];
                putData[offset * 4 + 1] = resultData[offset];
                putData[offset * 4 + 2] = resultData[offset];
                putData[offset * 4 + 3] = 255;
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

function refresh() {
    processingImage();
}

let entry = {

    /**
     * 初始化
     */
    init() {

        document.getElementById('upload-file').addEventListener('change', onUpFileChange);
        canvasSrc = document.getElementById('canvas-src');
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        $('#threshold-gray').on('change', function () {
            $('#threshold-fn').val('');
            refresh();
        });

        $('[data-action]').on('change', function (e) {
            let action = $(this).data('action');
            if (action === 'threshold') {
                let threshold = parseInt(processor.getThreshold(e.target.value), 10);
                $('#threshold-gray').val(threshold);
            }
            else if (action === 'brightness') {
                processor.brightness(+$('#brightness-bright').val(), +$('#brightness-contrast').val());
            }
            else if (action === 'open' || action === 'close' || action === 'dilate' || action === 'erode') {
                if (!processor.imageData.binarize) {
                    processor.binarize(+$('#threshold-gray').val());
                }

                processor[action]('square', +$(this).val());
            }
            else if (action === 'sharp' || action === 'blur' || action === 'gaussBlur' || action === 'reverse') {
                processor[action](+$(this).val());
            }

            refresh();
        });

        $('#pic-reset').on('click', function () {
            processor.restore();
            refresh();
        });

        $('#show-binarized').on('click', function (e) {
            $('#pan-binarize')[e.target.checked ? 'show' : 'hide']();
            refresh();
        });

        let img = new Image();
        img.onload = function () {
            canvasSrc.width = img.width;
            canvasSrc.height = img.height;
            canvasSrc.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
            let imgData = canvasSrc.getContext('2d').getImageData(0, 0, img.width, img.height);

            processor.set(imgData);
            processor.save();


            refresh();
        };
        img.src = './test/a.gif';
    }
};

entry.init();