/**
 * @file 平滑轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        /**
         * 平滑图像轮廓
         * @param  {Array} contour 轮廓点集
         * @param  {number} smooth 平滑边界
         * @return {Array}         平滑后轮廓
         */
        function smooth(contour, smooth) {

            smooth = Math.floor((smooth || 2) / 2);
            var div = smooth * 2 + 1;

            for (var i = 0, l = contour.length; i < l; i++) {
                var p = contour[i];
                var xAvg = p.x;
                var yAvg = p.y;
                var index;
                for (var j = 0; j < smooth; j++) {
                    index = (i + l - j) % l;
                    xAvg += contour[index].x;
                    yAvg += contour[index].y;

                    index = (i + l + j) % l;
                    xAvg += contour[index].x;
                    yAvg += contour[index].y;
                }
                p.x = Math.floor(xAvg / div);
                p.y = Math.floor(yAvg / div);
            }

            return contour;
        }

        return smooth;
    }
);
