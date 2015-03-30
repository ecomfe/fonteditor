/**
 * @file canvas读取图片
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var grayImage = require('graphics/image/grayImage');
        var procImage = require('graphics/image/procImage');
        var binarizeImage = require('graphics/image/filter/binarize');
        var image2Values = require('graphics/image/image2Values');
        var findContours = require('graphics/image/findContours');
        var pathUtil = require('graphics/pathUtil');

        var ctx = null;
        var canvas = null;
        var curImage = null;

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
                    getContours(image);
                };

                image.src = e.target.result;
            }

            reader.onerror = function(e) {
                console.error(e);
            };

            reader.readAsDataURL(file);
        }

        function getContours(image) {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            var width = image.width;
            var height = image.height;
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0, width, height);
            var imgData = ctx.getImageData(0, 0, width, height);

            var grayData = procImage(imgData);
            var putData = imgData.data;
            var putGrayData = grayData.data;

            for (var y = 0; y < height; y ++) {
                var line = width * y;
                for (var x = 0; x < width; x++) {
                    var offset = line + x;
                    var gray = putGrayData[offset];
                    putData[offset * 4] = gray;
                    putData[offset * 4 + 1] = gray;
                    putData[offset * 4 + 2] = gray;
                    putData[offset * 4 + 3] = 255;

                    // if (result.data[offset]) {
                    //     putData[offset * 4] = 208;
                    //     putData[offset * 4 + 1] = 247;
                    //     putData[offset * 4 + 2] = 113;
                    //     putData[offset * 4 + 3] = 255;
                    // }
                    // else {
                    //     putData[offset * 4] = 255;
                    //     putData[offset * 4 + 1] = 255;
                    //     putData[offset * 4 + 2] = 255;
                    //     putData[offset * 4 + 3] = 255;
                    // }
                }
            }

            // var result = binarizeImage(grayData, getOptions().threshold);
            // var contours = findContours(result);

            // contours.forEach(function (contour) {
            //     var flag = contour.flag;
            //     for (var i = 0, l = contour.length; i < l; i++) {
            //         var p = contour[i];
            //         var offset = p.y * width + p.x;
            //         putData[offset * 4] = flag ? 100 : 255;
            //         putData[offset * 4 + 1] = 0;
            //         putData[offset * 4 + 2] = 0;
            //         putData[offset * 4 + 3] = 255;
            //     }
            // });
            ctx.putImageData(imgData, 0, 0);
        }

        function refresh() {
            curImage && getContours(curImage, getOptions());
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                document.getElementById('upload-file').addEventListener('change', onUpFileChange);
                canvas = document.getElementById("canvas");
                ctx = canvas.getContext("2d");

                $('#threshold-gray').on('change', function () {
                    $('#threshold-fn').val('');
                    refresh();
                });

                $('#threshold-fn').on('change', refresh);
                $('#threshold-reverse').on('change', refresh);

                var img = new Image();
                img.onload = function () {
                    curImage = img;
                    refresh();
                }
                img.src = '../test/rw1.jpg';
            }
        };

        entry.init();

        return entry;
    }
);
