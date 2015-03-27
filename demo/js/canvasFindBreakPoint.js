/**
 * @file canvas读取图片
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var image2Values = require('graphics/image/image2Values');
        var findContours = require('graphics/image/findContours');
        var findBreakPoints = require('graphics/image/findBreakPoints');
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

            getBreakPoint(contours);
        }


        function getBreakPoint(contours) {
            var breakPoints = [];
            contours.forEach(function (contour) {

                contour = pathUtil.scale(contour, 10);
                var points  = findBreakPoints(contour);

                if (points) {
                    points.forEach(function (p) {
                        breakPoints.push(p);
                    });
                }

                contour = pathUtil.scale(contour, 0.1);
            });



            breakPoints.forEach(function (p) {

                ctx.beginPath();

                if (p.breakPoint) {
                    ctx.fillStyle = 'red';
                }
                else if (p.inflexion) {
                    ctx.fillStyle = 'blue';
                }

                ctx.fillRect(p.x, p.y, p.right == 1 ? 6 : 3, p.right == 1 ? 6 : 3);
            });

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
                img.src = '../test/meng1.gif';
            }
        };

        entry.init();

        return entry;
    }
);
