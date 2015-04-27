/**
 * @file shape变换相关命令
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var pathsUtil = require('graphics/pathsUtil');

        /**
         * 旋转图形
         *
         * @param {Array} shapes 图形集合
         * @param {number} angle 弧度
         * @return {boolean} `false`或者`undefined`
         */
        function rotate(shapes, angle) {
            if (!angle) {
                return false;
            }
            var paths = shapes.map(function (shape) {
                return shape.points;
            });

            pathsUtil.rotate(paths, angle);
        }


        var support = {

            /**
             * 旋转指定角度
             *
             * @param {Array} shapes 图形集合
             * @param {number} angle 弧度
             * @return {boolean} `false`或者`undefined`
             */
            rotate: function (shapes, angle) {

                if (!shapes || !shapes.length) {
                    return false;
                }

                var ret = rotate(shapes, angle);
                if (false !== ret) {
                    this.fontLayer.refresh();
                    this.refreshSelected(shapes);
                }
                return ret;
            },

            /**
             * 向左旋转
             *
             * @param {Array} shapes 图形集合
             * @return {boolean} `false`或者`undefined`
             */
            rotateleft: function (shapes) {
                return support.rotate.call(this, shapes, -Math.PI / 2);
            },

            /**
             * 向右旋转
             *
             * @param {Array} shapes 图形集合
             * @return {boolean} `false`或者`undefined`
             */
            rotateright: function (shapes) {
                return support.rotate.call(this, shapes, Math.PI / 2);
            },

            /**
             * 翻转
             *
             * @param {Array} shapes 图形集合
             * @return {boolean} `false`或者`undefined`
             */
            flipshapes: function (shapes) {

                if (!shapes || !shapes.length) {
                    return false;
                }

                pathsUtil.flip(shapes.map(function (shape) {
                    return shape.points;
                }));
                this.fontLayer.refresh();
                this.refreshSelected(shapes);
            },

            /**
             * 镜像
             *
             * @param {Array} shapes 图形集合
             * @return {boolean} `false`或者`undefined`
             */
            mirrorshapes: function (shapes) {

                if (!shapes || !shapes.length) {
                    return false;
                }

                pathsUtil.mirror(shapes.map(function (shape) {
                    return shape.points;
                }));
                this.fontLayer.refresh();
                this.refreshSelected(shapes);
            }
        };

        return support;
    }
);
