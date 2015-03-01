/**
 * @file canvas读取图片
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var image2Values = require('graphics/image/image2Values');
        var findContours = require('graphics/image/findContours');

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                var context =document.getElementById("canvas").getContext("2d");
                var cvsH = context.height;
                var cvsW = context.width;

                var img = new Image();
                img.src = "../test/add.gif";
                var width;
                var height;
                img.onload = function (){
                    width = img.width;
                    height = img.height;
                    context.drawImage(img, 0, 0);
                    var imgData = context.getImageData(0, 0, width, height);
                    var result = image2Values(imgData);
                    //var pointArray = findContours(result);

                    context.clearRect(0, 0, width, height);
                    var putData = imgData.data;
                    var data = result.data;
                    for (var y = 0; y < height; y ++) {
                        for (var x = 0; x < width; x++) {
                            var offset = y * height + x;
                            if (data[offset]) {
                                putData[offset * 4] = 255;
                                putData[offset * 4 + 1] = 255;
                                putData[offset * 4 + 2] = 0;
                                putData[offset * 4 + 3] = 255;
                            }
                        }
                    }
                    context.putImageData(imgData, 0, 0);

                    console.log(result.length);
                };
            }
        };

        entry.init();

        return entry;
    }
);
