/**
 * @file rotateTransform.js
 * @author mengke01
 * @date
 * @description
 * 旋转变换
 */


define(
    function (require) {

        var getRotateMatrix = require('./getRotateMatrix');
        var pathRotate = require('graphics/pathRotate');
        var pathSkew = require('graphics/pathSkew');
        var lang = require('common/lang');

        /**
         * 旋转变换
         *
         * @param {Object} point 参考点
         * @param {Camera} camera 镜头对象
         */
        function rotateTransform(point, camera) {

            var matrix = getRotateMatrix(point.pos, this.bound, camera);

            var transformer = point.pos <= 4 ? pathRotate : pathSkew;

            // 更新shape
            var shapes = this.shapes;

            this.coverShapes.forEach(function (coverShape, index) {
                var shape = lang.clone(shapes[index]);
                transformer(shape.points, matrix[2], matrix[0], matrix[1]);
                lang.extend(coverShape, shape);

            });


            // 更新边界
            var coverLayer = this.editor.coverLayer;
            var boundShape = coverLayer.getShape('bound');
            var bound = this.bound;
            boundShape.points = transformer(
                [
                    {x: bound.x, y: bound.y},
                    {x: bound.x + bound.width, y: bound.y},
                    {x: bound.x + bound.width, y: bound.y + bound.height},
                    {x: bound.x, y: bound.y + bound.height}
                ],
                matrix[2], matrix[0], matrix[1]
            );

            // 更新中心点
            var boundCenter = coverLayer.getShape('boundcenter');
            if (!boundCenter) {
                boundCenter = {
                    type: 'cpoint',
                    id: 'boundcenter',
                    x: bound.x + bound.width / 2,
                    y: bound.y + bound.height / 2
                };
                coverLayer.addShape(boundCenter);
            }
            boundCenter.x = (boundShape.points[0].x + boundShape.points[2].x) / 2;
            boundCenter.y = (boundShape.points[0].y + boundShape.points[2].y) / 2;


            coverLayer.refresh();
        }

        return rotateTransform;
    }
);
