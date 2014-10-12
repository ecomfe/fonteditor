/**
 * @file moveTransform.js
 * @author mengke01
 * @date 
 * @description
 * 移动对象
 */


define(
    function(require) {

        var lang = require('common/lang');
        var pathAdjust = require('graphics/pathAdjust');

        /**
         * 移动对象
         * 
         * @param {Object} camera 镜头对象
         */
        function moveTransform (camera) {

            var x = camera.x - camera.startX;
            var y = camera.y - camera.startY;

            // 更新shape
            var shapes = this.shapes;

            this.coverShapes.forEach(function(coverShape, index) {
                var shape = lang.clone(shapes[index]);
                pathAdjust(shape.points, 1, 1, x, y);
                lang.extend(coverShape, shape);

            });
            

            // 更新边界
            var coverLayer = this.editor.coverLayer;
            var boundShape = coverLayer.getShape('bound');
            var bound = this.bound;
            boundShape.points = pathAdjust(
                [
                    {x: bound.x, y:bound.y},
                    {x: bound.x + bound.width, y:bound.y},
                    {x: bound.x + bound.width, y:bound.y + bound.height},
                    {x: bound.x, y:bound.y + bound.height}
                ], 
                1, 1, x, y
            );
            
            coverLayer.refresh();

        }

        return moveTransform;
    }
);
