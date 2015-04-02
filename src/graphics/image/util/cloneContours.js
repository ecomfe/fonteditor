/**
 * @file 克隆轮廓数组
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {


        /**
         * 克隆轮廓点集
         *
         * @param  {Array} contours 轮廓点集
         * @return {Array}          克隆后的点集
         */
        function cloneContours(contours) {
            var newContours = [];
            contours.forEach(function (contour) {
                var newContour = [];
                contour.forEach(function (p) {
                    newContour.push({
                        x: p.x,
                        y: p.y,
                        onCurve: p.onCurve ? true : false
                    });
                });
            });

            return newContours;
        }

        return cloneContours;
    }
);
