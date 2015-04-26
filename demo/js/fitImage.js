/**
 * @file canvas读取图片
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var lang = require('common/lang');

        var ImageProcessor = require('graphics/image/ImageProcessor');
        var ContourPointsProcessor = require('graphics/image/ContourPointsProcessor');
        var pathsUtil = require('graphics/pathsUtil');
        var editor = require('editor/main');

        var ctx = null;
        var canvas = null;
        var curImage = null;

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
            var result = new ImageProcessor(imgData).binarize(+$('#threshold-gray').val()).get();

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
            contourProcessor = new ContourPointsProcessor();
            contourProcessor.import(result);
            var contours = contourProcessor.get();

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

            getBreakPoint();

            var contours = contourProcessor.getContours();
            window.editor.setFont({
                contours: pathsUtil.flip(contours)
            });
        }


        function getBreakPoint() {
            var breakPoints = contourProcessor.getBreakPoints();
            breakPoints.forEach(function (p) {
                ctx.beginPath();
                if (p.breakPoint) {
                    ctx.fillStyle = 'red';
                }
                else if (p.inflexion) {
                    ctx.fillStyle = 'blue';
                }
                else if (p.tangency) {
                    ctx.fillStyle = 'green';
                }
                ctx.fillRect(p.x, p.y, p.right == 1 ? 6 : 3, p.right == 1 ? 6 : 3);
            });

        }

        function refresh() {
            curImage && getContours(curImage);
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                window.editor  = editor.create($('#render-view').get(0));
                document.getElementById('upload-file').addEventListener('change', onUpFileChange);
                canvas = document.getElementById("canvas");
                ctx = canvas.getContext("2d");
                $('#threshold-gray').on('change', refresh);

                var img = new Image();
                img.onload = function () {
                    curImage = img;
                    refresh();
                };
                img.src = './test/qg.jpg';
            }
        };

        entry.init();

        return entry;
    }
);
