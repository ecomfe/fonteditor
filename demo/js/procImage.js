/**
 * @file canvas读取图片
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var ImageProcessor = require('graphics/image/ImageProcessor');
        var binarizeImage = require('graphics/image/filter/binarize');
        var findContours = require('graphics/image/contour/findContours');
        var clone
        var ctx = null;
        var canvas = null;
        var canvasSrc = null;
        var curImage = null;
        var processor = new ImageProcessor();


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

                var img = curImage = new Image();
                img.onload = function () {

                    canvasSrc.width = img.width;
                    canvasSrc.height = img.height;
                    canvasSrc.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
                    var imgData = canvasSrc.getContext('2d').getImageData(0, 0, img.width, img.height);


                    processor.set(imgData);
                    processor.save();
                    processingImage();
                };

                img.src = e.target.result;
            }

            reader.onerror = function(e) {
                console.error(e);
            };

            reader.readAsDataURL(file);
        }

        function processingImage() {

            ctx.clearRect(0,0, canvas.width, canvas.height);

            var width = processor.imageData.width;
            var height = processor.imageData.height;
            canvas.width = width;
            canvas.height = height;

            var imgData = ctx.getImageData(0, 0, width, height);
            var putData = imgData.data;

            if ($('#show-binarized').get(0).checked) {

                var result = processor.clone().binarize(+$('#threshold-gray').val()).get();

                var resultData = result.data;
                for (var y = 0; y < height; y ++) {
                    var line = width * y;
                    for (var x = 0; x < width; x++) {
                        var offset = line + x;
                        putData[offset * 4] = resultData[offset];
                        putData[offset * 4 + 1] = resultData[offset];
                        putData[offset * 4 + 2] = resultData[offset];
                        putData[offset * 4 + 3] = 255;
                    }
                }

                var contours = findContours(result);
                contours.forEach(function (contour) {
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
            }
            else {
                var result = processor.get();
                var resultData = result.data;
                for (var y = 0; y < height; y ++) {
                    var line = width * y;
                    for (var x = 0; x < width; x++) {
                        var offset = line + x;

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

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                document.getElementById('upload-file').addEventListener('change', onUpFileChange);
                canvasSrc = document.getElementById("canvas-src");
                canvas = document.getElementById("canvas");
                ctx = canvas.getContext("2d");

                $('#threshold-gray').on('change', function () {
                    $('#threshold-fn').val('');
                    refresh();
                });

                $('[data-action]').on('change', function (e) {
                    var action = $(this).data('action');
                    if (action === 'threshold') {
                        var threshold = parseInt(processor.getThreshold(e.target.value));
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

                var img = new Image();
                img.onload = function () {
                    canvasSrc.width = img.width;
                    canvasSrc.height = img.height;
                    canvasSrc.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
                    var imgData = canvasSrc.getContext('2d').getImageData(0, 0, img.width, img.height);

                    processor.set(imgData);
                    processor.save();


                    refresh();
                }
                img.src = './test/a.gif';
            }
        };

        entry.init();

        return entry;
    }
);
