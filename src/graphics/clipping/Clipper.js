/**
 * @file 路径裁剪
 * @author kekee000@gmail.com
 */


define(
    function (require) {

        var ClipperLib = require('ClipperLib');

        /**
         * 将数据转换成clipper格式
         *
         * @param {Array} contour 轮廓集合
         * @return {contour}
         */
        function transformData(contour) {
            for (var i = 0, l = contour.length; i < l; i++) {
                contour[i].X = contour[i].x;
                contour[i].Y = contour[i].y;
            }
            return contour;
        }

        /**
         * 将数据转换回小写格式
         *
         * @param {Array} contours 轮廓集合
         * @return {contour}
         */
        function transbackData(contours) {
            var result = [];
            contours.forEach(function (contour) {
                var path = [];
                for (var i = 0, l = contour.length; i < l; i++) {
                    path.push({
                        x: contour[i].X,
                        y: contour[i].Y,
                        onCurve: true
                    });
                }
                result.push(path);
            });
            return result;
        }


        /**
         * 添加路径
         *
         * @param {Array} contour 轮廓集合
         * @param {number} 填充规则
         */
        function addPath(contour, polyType) {
            contour = transformData(contour);
            ClipperLib.JS.ScaleUpPath(contour, this.scale);
            this.clipper.AddPath(contour, polyType, true);
        }


        /**
         * 裁剪组件
         *
         * @param {Object} options 选项参数
         */
        function Clipper(options) {
            options = options || {};
            this.clipType = options.clipType || ClipperLib.ClipType.ctXor;
            this.fillType = options.fillType || ClipperLib.PolyFillType.pftNonZero;
            this.scale = options.scale || 100000;
            this.clipper = new ClipperLib.Clipper();
        }

        Clipper.prototype.addSubject = function (contour) {
            addPath.call(this, contour, ClipperLib.PolyType.ptSubject);
        };

        Clipper.prototype.addClip = function (contour) {
            addPath.call(this, contour, ClipperLib.PolyType.ptClip);
        };

        /**
         * 执行裁剪路径
         *
         * @param  {number} 裁剪方法, 相交、相切、合并
         * @return {Array} 裁剪后的路径
         */
        Clipper.prototype.execute = function (relation) {
            var result = [];
            var succeeded = this.clipper.Execute(relation, result, this.fillType, this.fillType);
            if (succeeded) {
                result = ClipperLib.Clipper.SimplifyPolygons(result, this.fillType);
                ClipperLib.JS.ScaleDownPaths(result, this.scale);
                return transbackData(result);
            }
            return [];
        };

        return Clipper;
    }
);
