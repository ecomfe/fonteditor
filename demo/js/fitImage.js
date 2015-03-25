/**
 * @file 拟合图像字形
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var fitContour = require('graphics/image/fitContour');
        var image2Values = require('graphics/image/image2Values');
        var findContours = require('graphics/image/findContours');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('graphics/pathAdjust');
        var drawPath = require('render/util/drawPath');
        var data = require('demo/../data/image-contours2');
        var pathUtil = require('graphics/pathUtil');


        var editor = require('editor/main');
        var canvas = null;
        var ctx = null;
        var curImage = null;




        function fitGlyf(data) {
            var html = '';
            var contours = [];

            data.forEach(function(contour) {
                contour.forEach(function (p) {
                    html += '<i style="left:'+p.x+'px;top:'+p.y+'px;"></i>';
                });

                contour = pathUtil.scale(contour, 10);
                var result = pathUtil.scale(fitContour(contour, 10), 0.1);
                contours.push(result);
                contour = pathUtil.scale(contour, 0.1);
            });

            $('#points').html(html);

            html = '';
            ctx.beginPath();
            ctx.clearRect(0,0, canvas.width, canvas.height);
            ctx.strokeStyle = 'pink';
            contours.forEach(function (contour) {
                for (var i = 0, l = contour.length; i < l; i++) {
                    html += '<i style="left:'+contour[i].x+'px;top:'+contour[i].y+'px;" class="break"></i>';
                }
                drawPath(ctx, contour);
            });

            ctx.stroke();

            $('#points-break').html(html);

            var bound = computeBoundingBox.computePath.apply(null, contours);

            window.editor.setFont({
                contours: contours.map(function (contour) {
                    pathAdjust(contour, 1, -1);
                    pathAdjust(contour, 1, 1, 0, bound.height);
                    return contour;
                })
            });
        }

        function findImageContours(imgData) {
            var result = image2Values(imgData);
            var contours = findContours(result);

            fitGlyf(contours);
        }



        function onUpFileChange(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {

                var image = new Image();
                image.onload = function () {
                    ctx.clearRect(0,0, canvas.width, canvas.height);
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    findImageContours(ctx.getImageData(0, 0, image.width, image.height));
                };

                image.src = e.target.result;
            }

            reader.onerror = function(e) {
                console.error(e);
            };

            reader.readAsDataURL(file);
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                window.editor  = editor.create($('#render-view').get(0));

                document.getElementById('upload-file').addEventListener('change', onUpFileChange);
                canvas = $('#canvas').get(0);
                ctx = canvas.getContext('2d');

                if (data) {
                    data.forEach(function(contour) {
                        contour.splice(contour.length - 1, 1);
                    });

                    fitGlyf(data);
                }
            }

        };

        entry.init();

        return entry;
    }
);
