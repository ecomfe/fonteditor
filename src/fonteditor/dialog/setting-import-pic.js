/**
 * @file 导入图片
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import setting from './setting';

import string from 'common/string';
import pixelRatio from 'common/getPixelRatio';
import lang from 'common/lang';
import program from '../widget/program';
import drawPath from 'render/util/drawPath';
import ImageProcessor from 'graphics/image/ImageProcessor';
import ContourPointsProcessor from 'graphics/image/ContourPointsProcessor';
import getHistogram from 'graphics/image/util/getHistogram';
import getThreshold from 'graphics/image/util/getThreshold';
import pathsUtil from 'graphics/pathsUtil';

function getFilter(filter) {
    return $('#import-pic-dialog').find('[data-filter="' + filter + '"]');
}

/**
 * 保存当前的灰度图像
 * @param {Object} image 图片对象
 */
function updateImage(image) {
    let canvas = $('#import-pic-canvas-origin').get(0);
    canvas.style.visiblity = 'hidden';
    let width = image.width;
    let height = image.height;

    canvas.width = width;
    canvas.height = height;

    if (pixelRatio !== 1) {
        canvas.style.width = (width / pixelRatio) + 'px';
        canvas.style.height = (height / pixelRatio) + 'px';
    }

    canvas.ctx.drawImage(image, 0, 0, width, height);

    let imgData = canvas.ctx.getImageData(0, 0, width, height);
    let processor = program.data.imageProcessor;
    processor.set(imgData);
    processor.grayData = processor.clone();
    processor.resultContours = null;

    // 使用ostu来设置灰度阈值
    let histoGram = getHistogram(processor.get());
    getFilter('threshold').val(getThreshold(histoGram, 'ostu'));
    $('#import-pic-threshold-pre').val('ostu');

    processImage();
    binarizeImage();
    refreshCanvasOrigin();
}

function refreshCanvasOrigin() {
    let binarizedImage = program.data.imageProcessor.get();
    let canvas = $('#import-pic-canvas-origin').get(0);
    canvas.style.visiblity = 'hidden';
    let width = binarizedImage.width;
    let height = binarizedImage.height;

    if (!binarizedImage.binarize) {
        binarizeImage();
        binarizedImage = program.data.imageProcessor.get();
    }

    let imgData = canvas.ctx.getImageData(0, 0, width, height);
    let putData = imgData.data;
    let binarizedImageData = binarizedImage.data;

    for (let y = 0, line; y < height; y++) {
        line = width * y;
        for (let x = 0; x < width; x++) {
            let offset = line + x;
            if (binarizedImageData[offset] === 0) {
                putData[offset * 4] = 208;
                putData[offset * 4 + 1] = 247;
                putData[offset * 4 + 2] = 113;
                putData[offset * 4 + 3] = 255;
            }
            else {
                putData[offset * 4] = 255;
                putData[offset * 4 + 1] = 255;
                putData[offset * 4 + 2] = 255;
                putData[offset * 4 + 3] = 255;
            }
        }
    }

    program.data.pointsProcessor.import(binarizedImage);
    program.data.pointsProcessor.get().forEach(function (points) {
        points.forEach(function (p) {
            let offset = p.y * width + p.x;
            putData[offset * 4] = 255;
            putData[offset * 4 + 1] = 0;
            putData[offset * 4 + 2] = 0;
            putData[offset * 4 + 3] = 255;
        });
    });

    canvas.ctx.putImageData(imgData, 0, 0);

    canvas.style.visiblity = 'visible';
    program.loading.hide();

    setTimeout(function () {
        refreshCanvasFit();
    }, 20);
}

function refreshCanvasFit() {
    let result = program.data.imageProcessor.get();
    let width = result.width;
    let height = result.height;
    let canvas = $('#import-pic-canvas-fit').get(0);
    canvas.ctx.clearRect(0, 0, width, height);

    canvas.width = pixelRatio * width;
    canvas.height = pixelRatio * height;
    if (pixelRatio !== 1) {
        canvas.style.width = (width / pixelRatio) + 'px';
        canvas.style.height = (height / pixelRatio) + 'px';
    }

    // 绘制拟合曲线
    canvas.ctx.fillStyle = 'green';
    canvas.ctx.beginPath();
    let contours = program.data.imageProcessor.resultContours = program.data.pointsProcessor.getContours();
    contours.forEach(function (contour) {
        drawPath(canvas.ctx, contour);
    });
    canvas.ctx.fill();
}


function processImage() {
    let processor = program.data.imageProcessor;
    processor.set(processor.grayData.clone().get());

    if (getFilter('reverse').is(':checked')) {
        processor.reverse();
    }

    if (+getFilter('gaussBlur').val() >= 2) {
        processor.gaussBlur(+getFilter('gaussBlur').val());
    }

    if (+getFilter('contrast').val()) {
        processor.brightness(0, +getFilter('contrast').val());
    }

    // 保存一份处理后的
    processor.save();
}

function binarizeImage() {
    program.data.imageProcessor.binarize(+getFilter('threshold').val());
}

function bindEvent() {
    let canvasOrigin = $('#import-pic-canvas-origin').get(0);
    canvasOrigin.ctx = canvasOrigin.getContext('2d');
    let canvasFit = $('#import-pic-canvas-fit').get(0);
    canvasFit.ctx = canvasFit.getContext('2d');

    // 这里由于对retina屏幕进行修正，需要修复下设置
    if (pixelRatio !== 1) {
        canvasOrigin.width = canvasOrigin.height = 0;
        canvasOrigin.style.width = canvasOrigin.style.height = 'auto';
        canvasFit.width = canvasFit.height = 0;
        canvasFit.style.width = canvasFit.style.height = 'auto';
    }

    $('#import-pic-file').get(0).onchange = function (e) {
        let file = e.target.files[0];

        if (!file) {
            return;
        }

        if (!/\.(?:jpg|gif|png|jpeg|bmp|svg)$/i.test(file.name)) {
            alert(i18n.lang.msg_not_support_file_type);
            return;
        }

        let reader = new FileReader();
        program.loading.show(i18n.lang.msg_loading_pic, 10000);

        reader.onload = function (loadEvent) {
            let image = new Image();
            image.onload = function () {
                updateImage(image);
            };
            image.onerror = function () {
                program.loading.warn(i18n.lang.msg_read_pic_error, 2000);
            };
            image.src = loadEvent.target.result;
            loadEvent.target.value = '';
        };

        reader.onerror = function () {
            program.loading.warn(i18n.lang.msg_read_pic_error, 2000);
        };

        reader.readAsDataURL(file);
    };

    let throttleAction = lang.debounce(function (action) {
        // 调整灰度阈值，只需要恢复未二值化的数据不需要重新计算图像
        if (action === 'threshold') {
            program.data.imageProcessor.restore();
            binarizeImage();
        }
        else if (action === 'threshold-pre') {
            let val = $('#import-pic-threshold-pre').val();
            if (val) {
                let histoGram = getHistogram(program.data.imageProcessor.getOrigin());
                getFilter('threshold').val(getThreshold(histoGram, $('#import-pic-threshold-pre').val()));
                program.data.imageProcessor.restore();
                binarizeImage();
            }
        }
        // 处理图片的情况，需要调用处理图片和二值化函数
        else if (action === 'restore') {
            getFilter('reverse').get(0).checked = false;
            getFilter('gaussBlur').val(0);
            getFilter('contrast').val(0);
            processImage();
            binarizeImage();
        }
        else if (
            action === 'reverse'
            || action === 'gaussBlur'
            || action === 'contrast'
            || action === 'restore-binarize'
        ) {
            processImage();
            binarizeImage();
        }
        // 腐蚀和膨胀只需要处理二值数据
        else if (
            action === 'open'
            || action === 'close'
            || action === 'dilate'
            || action === 'erode'
        ) {
            program.data.imageProcessor[action]();
        }
        // 是否仅线段
        else if (action === 'smooth') {
            program.data.pointsProcessor.segment = !getFilter('smooth').get(0).checked;
        }
        refreshCanvasOrigin();
    }, 100);


    $('#import-pic-dialog').on('click', '[data-action]', function () {
        let action = $(this).data('action');
        if (action === 'openfile') {
            $('#import-pic-file').click();
        }
        else if (action === 'fitwindow') {
            $('#import-pic-dialog').find('.preview-panel').toggleClass('fitpanel');
        }
        else if (action === 'fitwindow-left') {
            $('#import-pic-dialog').find('.preview-panel')
                .removeClass('fitpanel').removeClass('showright').toggleClass('showleft');
        }
        else if (action === 'fitwindow-right') {
            $('#import-pic-dialog').find('.preview-panel')
                .removeClass('fitpanel').removeClass('showleft').toggleClass('showright');
        }
        else if (action === 'import-url') {
            $('#import-pic-dialog').find('.import-pic-url').toggleClass('show-url');
        }


    }).on('click', '[data-filter]', function (e) {
        if (!program.data.imageProcessor.grayData) {
            return;
        }

        let action = $(this).data('filter');
        program.loading.show(i18n.lang.msg_processing, 10000);
        throttleAction(action);
    });

    $('#import-pic-threshold-pre').on('change', function (e) {
        if (!program.data.imageProcessor.grayData) {
            return;
        }
        program.loading.show(i18n.lang.msg_processing, 10000);
        throttleAction('threshold-pre');
    });

    $('#import-pic-url-text').on('keyup', function (e) {

        if (e.keyCode !== 13) {
            return;
        }
        let val = this.value.trim();
        if (/^https?:\/\//i.test(val)) {
            this.value = '';
            $('#import-pic-dialog').find('.import-pic-url').removeClass('show-url');
            program.loading.show(i18n.lang.msg_loading_pic, 10000);
            let image = new Image();
            image.onload = function () {
                updateImage(image);
            };
            image.onerror = function () {
                program.loading.warn(i18n.lang.msg_read_pic_error, 2000);
            };
            image.src = string.format(program.config.readOnline, ['image', val]);
        }
        else {
            alert(i18n.lang.msg_input_pic_url);
        }
    });
}

function unbindEvent() {
    $('#import-pic-file').get(0).onchange = null;
    $('#import-pic-dialog').off('click');
    $('#import-pic-threshold-pre').off('change');
    $('#import-pic-url-text').off('keyup');
}

export default setting.derive({

    title: i18n.lang.dialog_import_pic,

    style: 'import-pic-dialog',

    getTpl() {
        return require('../template/dialog/setting-import-pic.tpl');
    },

    set() {
        program.data.imageProcessor = new ImageProcessor();
        program.data.pointsProcessor = new ContourPointsProcessor();
        bindEvent();
    },
    onDispose() {
        unbindEvent();
        program.data.imageProcessor.grayData && program.data.imageProcessor.grayData.dispose();
        program.data.imageProcessor.dispose();
        program.data.pointsProcessor.dispose();
        program.data.imageProcessor = program.data.pointsProcessor = null;
    },
    validate() {
        let contours = program.data.imageProcessor.resultContours;
        if (contours) {
            if (!contours || !contours.length) {
                alert(i18n.lang.msg_no_glyph_to_import);
            }
            else {
                return {
                    contours: pathsUtil.flip(contours)
                };
            }
        }
        return {};
    }
});
