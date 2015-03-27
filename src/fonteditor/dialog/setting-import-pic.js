/**
 * @file 导入图片
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var program = require('../widget/program');


        var pathUtil = require('graphics/pathUtil');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('graphics/pathAdjust');
        var image2Values = require('graphics/image/image2Values');
        var findContours = require('graphics/image/findContours');
        var fitContour = require('graphics/image/fitContour');

        function getOptions() {
            return {
                threshold: $('#import-pic-threshold-fn').val() ? $('#threshold-fn').val() : +$('#import-pic-threshold-gray').val(),
                reverse: !!$('#import-pic-threshold-reverse').get(0).checked
            }
        }


        function refreshImage(image) {
            var canvas = $('#import-pic-canvas').get(0);
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0,0, canvas.width, canvas.height);
            var width = image.width;
            var height = image.height;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, 0, 0, width, height);
            var imgData = ctx.getImageData(0, 0, width, height);
            var result = image2Values(imgData, getOptions());
            var putData = imgData.data;
            for (var y = 0; y < height; y ++) {
                var line = width * y;
                for (var x = 0; x < width; x++) {
                    var offset = line + x;
                    if (result.data[offset]) {
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

            var contours = findContours(result);

            contours.forEach(function (contour) {
                contour.forEach(function (p) {
                    var offset = p.y * width + p.x;
                    putData[offset * 4] = 255;
                    putData[offset * 4 + 1] = 0;
                    putData[offset * 4 + 2] = 0;
                    putData[offset * 4 + 3] = 255;
                });
            });

            ctx.putImageData(imgData, 0, 0);
        }

        function fitImageContour(image) {
            var canvas = document.getElementById('import-pic-canvas');
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0,0, canvas.width, canvas.height);
            var width = image.width;
            var height = image.height;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, 0, 0, width, height);
            var imgData = ctx.getImageData(0, 0, width, height);
            var result = image2Values(imgData, getOptions());

            if (result && result.data.length > 20) {
                var contoursPoints = findContours(result);
                var contours = [];
                contoursPoints.forEach(function(points) {
                    points = pathUtil.scale(points, 10);
                    contours.push(pathUtil.scale(fitContour(points, 10), 0.1));
                });

                var bound = computeBoundingBox.computePath.apply(null, contours);
                var y = bound.y;
                var h = bound.height;
                contours.forEach(function (contour) {
                    pathAdjust(contour, 1, -1, 0, -y);
                    pathAdjust(contour, 1, 1, 0, y + h);
                    contour.reverse();
                });

                return contours;
            }

            return false;
        }


        var tpl = ''

            + '<div class="form-group">'
            +   '<button id="import-pic-fitpanel" type="button" class="btn btn-flat btn-preview btn-sm import-pic-fitpanel">适应窗口</button>'
            +   '<button id="import-pic-select" type="button" class="btn btn-flat btn-new btn-sm">选择图片</button> 请选择字形图片，支持jpg|gif|png。'
            +   '<form id="import-pic-form" style="width:0px;height:0px;overflow:hidden;"><input id="import-pic-file" type="file"></form>'
            + '</div>'

            + '<div class="import-pic-panel"><canvas id="import-pic-canvas"></canvas></div>'

            + '<div class="form-inline">'

            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">反转图像</span>'
            +         '<span class="form-control"><input id="import-pic-threshold-reverse" type="checkbox"></span>'
            +       '</div>'
            +   '</div>'

            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">灰度阈值</span>'
            +         '<span class="form-control"><input id="import-pic-threshold-gray" type="range" min="0" max="255" value="200"></span>'
            +       '</div>'
            +   '</div>'

            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">预设阈值</span>'
            +           '<select id="import-pic-threshold-fn" class="form-control">'
            +               '<option value=""> </option>'
            +               '<option value="mean">灰度平均值</option>'
            +               '<option value="minimum">谷底最小值</option>'
            +               '<option value="intermodes">双峰平均值</option>'
            +               '<option value="ostu">大津法</option>'
            +               '<option value="isoData">ISODATA法</option>'
            +           '</select>'
            +       '</div>'
            +   '</div>'
            + '</div>';

        return require('./setting').derive({

            title: '导入字形图片',

            getTpl: function () {
                return tpl;
            },

            set: function () {

                $('#import-pic-file').get(0).onchange = function (e) {
                    program.data.importedImage = null;

                    var file = e.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var image = new Image();
                        image.onload = function () {
                            refreshImage(image);
                        };

                        image.src = e.target.result;
                        program.data.importedImage = image;

                        e.target.value = '';
                    };
                    reader.onerror = function(e) {
                        alert('读取图片失败!');
                    };
                    reader.readAsDataURL(file);
                };

                $('#import-pic-select').on('click', function () {
                    $('#import-pic-file').click();
                });

                $('#import-pic-threshold-reverse').on('change', function () {
                    program.data.importedImage && refreshImage(program.data.importedImage);
                });

                $('#import-pic-threshold-gray').on('change', function () {
                    $('#import-pic-threshold-fn').val('');
                    program.data.importedImage && refreshImage(program.data.importedImage);
                });

                $('#import-pic-threshold-fn').on('change', function () {
                    program.data.importedImage && refreshImage(program.data.importedImage);
                });

                $('#import-pic-fitpanel').on('click', function () {
                    $('#import-pic-canvas').toggleClass('fitpanel');
                });

            },

            validate: function () {

                $('#import-pic-file').get(0).onchange = null;
                $('#import-pic-select').off('click');
                $('#import-pic-threshold-reverse').off('change');
                $('#import-pic-threshold-gray').off('change');
                $('#import-pic-threshold-fn').off('change');
                 $('#import-pic-fitpanel').off('click');
                $('#import-pic-canvas').css('visiblity', 'hidden');

                if (program.data.importedImage) {

                    var contours = fitImageContour(program.data.importedImage);
                    program.data.importedImage = null;

                    if (!contours || !contours.length) {
                        alert('没有找到可导入的字形！');
                    }
                    else {
                        return {
                            contours: contours
                        };
                    }
                }

                program.data.importedImage = null;

                return {};
            }
        });
    }
);
