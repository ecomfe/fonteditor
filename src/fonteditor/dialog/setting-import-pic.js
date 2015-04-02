/**
 * @file 导入图片
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var tpl = require('../template/dialog/setting-import-pic.tpl');
        var pixelRatio = require('common/getPixelRatio');
        var lang = require('common/lang');
        var program = require('../widget/program');
        var drawPath = require('render/util/drawPath');
        var ImageProcessor = require('graphics/image/ImageProcessor');
        var ContourPointsProcessor = require('graphics/image/ContourPointsProcessor');
        var getHistogram = require('graphics/image/util/getHistogram');
        var getThreshold = require('graphics/image/util/getThreshold');
        var pathsUtil = require('graphics/pathsUtil');

        function getFilter(filter) {
            return $('#import-pic-dialog').find('[data-filter="' + filter + '"]');
        }

        /**
         * 保存当前的灰度图像
         * @param {Object} image 图片对象
         */
        function updateImage(image) {
            var canvas = $('#import-pic-canvas-origin').get(0);
            canvas.style.visiblity = 'hidden';
            var width = image.width;
            var height = image.height;

            canvas.width = width;
            canvas.height = height;
            canvas.style.width = (width / pixelRatio) + 'px';
            canvas.style.height = (height / pixelRatio) + 'px';
            canvas.ctx.drawImage(image, 0, 0, width, height);

            var imgData = canvas.ctx.getImageData(0, 0, width, height);
            var processor = program.data.imageProcessor;
            processor.set(imgData);
            processor.grayData = processor.clone();
            processor.resultContours = null;

            // 使用ostu来设置灰度阈值
            var histoGram = getHistogram(processor.get());
            getFilter('threshold').val(getThreshold(histoGram, 'ostu'));

            processImage();
            binarizeImage();
            refreshCanvasOrigin();
        }

        function refreshCanvasOrigin() {

            var binarizedImage = program.data.imageProcessor.get();
            var canvas = $('#import-pic-canvas-origin').get(0);
            canvas.style.visiblity = 'hidden';
            var width = binarizedImage.width;
            var height = binarizedImage.height;

            if (!binarizedImage.binarize) {
                binarizeImage();
                binarizedImage = program.data.imageProcessor.get();
            }

            var imgData = canvas.ctx.getImageData(0, 0,  width, height);
            var putData = imgData.data;
            var binarizedImageData = binarizedImage.data;
            var line;
            for (var y = 0; y < height; y ++) {
                line = width * y;
                for (var x = 0; x < width; x++) {
                    var offset = line + x;
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
                    var offset = p.y * width + p.x;
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
            var result = program.data.imageProcessor.get();
            var width = result.width;
            var height = result.height;
            var canvas = $('#import-pic-canvas-fit').get(0);
            canvas.ctx.clearRect(0, 0, width, height);

            canvas.width = pixelRatio * width;
            canvas.height = pixelRatio * height;
            canvas.style.width = (width / pixelRatio) + 'px';
            canvas.style.height = (height / pixelRatio) + 'px';

            // 绘制拟合曲线
            canvas.ctx.fillStyle = 'green';
            canvas.ctx.beginPath();
            var contours = program.data.imageProcessor.resultContours = program.data.pointsProcessor.getContours();
            contours.forEach(function (contour) {
                drawPath(canvas.ctx, contour);
            });
            canvas.ctx.fill();
        }


        function processImage() {
            var processor = program.data.imageProcessor;
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
            // 这里由于对hidpi进行修正，需要修复下设置
            var canvasOrigin = $('#import-pic-canvas-origin').get(0);
            canvasOrigin.ctx = canvasOrigin.getContext('2d');
            canvasOrigin.width = canvasOrigin.height = 0;
            canvasOrigin.style.width = canvasOrigin.style.height = 'auto';
            var canvasFit = $('#import-pic-canvas-fit').get(0);
            canvasFit.ctx = canvasFit.getContext('2d');
            canvasFit.width = canvasFit.height = 0;
            canvasFit.style.width = canvasFit.style.height = 'auto';


            $('#import-pic-file').get(0).onchange = function (e) {
                var file = e.target.files[0];
                var reader = new FileReader();
                program.loading.show('正在加载图片...', 10000);

                reader.onload = function(e) {
                    var image = new Image();
                    image.onload = function () {
                        updateImage(image);
                    };
                    image.src = e.target.result;
                    e.target.value = '';
                };
                reader.onerror = function(e) {
                    program.loading.warn('读取图片失败...', 4000);
                    throw e;
                };
                reader.readAsDataURL(file);
            };

            var throttleAction = lang.debounce(function (action) {
                // 调整灰度阈值，只需要恢复未二值化的数据不需要重新计算图像
                if (action === 'threshold') {
                    program.data.imageProcessor.restore();
                    binarizeImage();
                }
                else if (action === 'threshold-pre') {
                    var histoGram = getHistogram(program.data.imageProcessor.getOrigin());
                    getFilter('threshold').val(getThreshold(histoGram, $('#import-pic-threshold-pre').val()));
                    program.data.imageProcessor.restore();

                    binarizeImage();
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
                refreshCanvasOrigin();
            }, 100);


            $('#import-pic-dialog').on('click', '[data-action]', function () {
                var action = $(this).data('action');
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

            }).on('click', '[data-filter]', function (e) {
                if (!program.data.imageProcessor.grayData) {
                    return;
                }

                var action = $(this).data('filter');
                program.loading.show('正在处理...', 10000);
                throttleAction(action);
            })

            $('#import-pic-threshold-pre').on('change', function (e) {
                if (!program.data.imageProcessor.grayData) {
                    return;
                }
                program.loading.show('正在处理...', 10000);
                throttleAction('threshold-pre');
            });
        }

        function unbindEvent() {
            $('#import-pic-file').get(0).onchange = null;
            $('#import-pic-dialog').off('click');
            $('#import-pic-threshold-pre').off('change');
        }

        return require('./setting').derive({

            title: '导入字形图片',

            style: 'import-pic-dialog',

            getTpl: function () {
                return tpl;
            },

            set: function () {
                program.data.imageProcessor = new ImageProcessor();
                program.data.pointsProcessor = new ContourPointsProcessor();
                bindEvent();
            },
            onDispose: function () {
                unbindEvent();
                program.data.imageProcessor.grayData && program.data.imageProcessor.grayData.dispose();
                program.data.imageProcessor.dispose();
                program.data.pointsProcessor.dispose();
                program.data.imageProcessor = program.data.pointsProcessor = null;
            },
            validate: function () {
                var contours = program.data.imageProcessor.resultContours;
                if (contours) {
                    if (!contours || !contours.length) {
                        alert('没有找到可导入的字形！');
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
    }
);
