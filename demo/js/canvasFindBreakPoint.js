/**
 * @file canvas读取图片
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var ImageProcessor = require('graphics/image/ImageProcessor');
        var ContourPointsProcessor = require('graphics/image/ContourPointsProcessor');

        var drawPath = require('render/util/drawPath');
        var pathUtil = require('graphics/pathUtil');
        var lang = require('common/lang');

        var ctx = null;
        var canvas = null;
        var curImage = null;
        var processor = null;
        var pointsProcessor = new ContourPointsProcessor();;

        function getOptions() {
            return {
                threshold: $('#threshold-fn').val() ? $('#threshold-fn').val() : +$('#threshold-gray').val(),
                reverse: !!$('#threshold-reverse').get(0).checked
            }
        }

        function onUpFileChange(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {

                var image = curImage = new Image();
                image.onload = function () {
                    refreshImg(image);
                    refresh();
                };

                image.src = e.target.result;
            }

            reader.onerror = function(e) {
                console.error(e);
            };

            reader.readAsDataURL(file);
        }

        function refresh() {
            var width = canvas.width;
            var height = canvas.height;
            var imgData = ctx.getImageData(0, 0, width, height);

            if (!processor.get().binarize) {
                processor.binarize(+$('#threshold-gray').val());
            }

            result = processor.get();

            var putData = imgData.data;
            for (var y = 0; y < height; y ++) {
                var line = width * y;
                for (var x = 0; x < width; x++) {
                    var offset = line + x;
                    if (result.data[offset] === 0) {
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

            pointsProcessor.import(result);
            var contoursPoints = pointsProcessor.get();

            contoursPoints.forEach(function (contour) {
                var flag = contour.flag;
                for (var i = 0, l = contour.length; i < l; i++) {
                    var p = contour[i];
                    var offset = p.y * width + p.x;
                    putData[offset * 4] = flag ? 100 : 255;
                    putData[offset * 4 + 1] = 0;
                    putData[offset * 4 + 2] = 0;
                    putData[offset * 4 + 3] = 255;
                }
            });

            ctx.putImageData(imgData, 0, 0);

            setTimeout(function() {
                if (!!$('#show-breakpoints').get(0).checked) {
                    getBreakPoints(contoursPoints);
                }
                getContours(contoursPoints);
            }, 20);

        }

        function getBreakPoints(contoursPoints) {
            // 绘制关键点
            ctx.beginPath();
            pointsProcessor.getBreakPoints().forEach(function (p) {
                if (p.breakPoint) {
                    ctx.fillStyle = 'red';
                }
                else if (p.inflexion) {
                    ctx.fillStyle = 'blue';
                }
                ctx.fillRect(p.x, p.y, p.right == 1 ? 6 : 3, p.right == 1 ? 6 : 3);
            });
        }

        function getContours(contoursPoints) {

            var result = processor.get();
            var canvas = $('#canvas-glyf').get(0);
            canvas.width = result.width;
            canvas.height = result.height;
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, result.width, result.height);

            // 绘制拟合曲线
            ctx.fillStyle = 'green';
            ctx.beginPath();
            pointsProcessor.getContours().forEach(function (contour) {
                drawPath(ctx, contour);
            });
            ctx.fill();
        }


        function refreshImg(image) {
            var width = image.width;
            var height = image.height;
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0, width, height);
            var imgData = ctx.getImageData(0, 0, width, height);
            processor = new ImageProcessor(imgData);
            processor.filters = {};
            processor.save();
        }

        function binarize() {
            processor.restore();

            if (processor.filters.reverse) {
                processor.reverse();
            }

            if (processor.filters.gaussBlur) {
                processor.gaussBlur(processor.filters.gaussBlur);
            }

            processor.binarize(+$('#threshold-gray').val());
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                document.getElementById('upload-file').addEventListener('change', onUpFileChange);
                canvas = document.getElementById("canvas");
                ctx = canvas.getContext("2d");

                $('[data-action]').on('click', function () {
                    var action = $(this).data('action');

                    if (action === 'fitwindow') {
                        var fit = $(this).get(0).checked;
                        $('#canvas')[fit ? 'addClass' : 'removeClass']('fitwindow');
                        $('#canvas-glyf')[fit ? 'addClass' : 'removeClass']('fitwindow');
                        return;
                    }
                    else if (action === 'binarize') {
                        binarize();
                    }
                    else if (action === 'restore') {
                        processor.filters = {};
                        $('[data-action="reverse"]').get(0).checked = false;
                        $('[data-action="gaussBlur"]').val(0);
                        binarize();
                    }
                    else if (action === 'open' || action === 'close' || action === 'dilate' || action === 'erode') {
                        processor[action]();
                    }
                    else if (action === 'reverse') {
                        processor.filters.reverse = !!this.checked;
                        binarize();
                    }
                    else if (action === 'gaussBlur') {
                        processor.filters.gaussBlur = +$(this).val();
                        binarize();
                    }

                    refresh();
                });

                var img = new Image();

                img.onload = function () {
                    refreshImg(img);
                    refresh();
                }

                img.src = './test/qg.gif';
            }
        };

        entry.init();

        return entry;
    }
);
