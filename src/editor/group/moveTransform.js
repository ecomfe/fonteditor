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
         * @param {boolean} fixX 固定X
         * @param {boolean} fixY 固定Y
         * @param {boolean} elableSorption 是否吸附
         */
        function moveTransform (camera, fixX, fixY, elableSorption) {

            var x = fixX ? 0 : (camera.x - camera.startX);
            var y = fixY ? 0 : (camera.y - camera.startY);

            // 更新shape
            var shapes = this.shapes;
            var bound = this.bound;

            var coverLayer = this.editor.coverLayer;
            var boundShape = coverLayer.getShape('bound');

            // 吸附选项
            if (elableSorption) {
                var centerX = bound.x + bound.width / 2;
                var centerY = bound.y + bound.height / 2;

                if (!fixX) {

                    // 设置吸附辅助线
                    var sorptionShapeX = coverLayer.getShape('sorptionX');
                    if (!sorptionShapeX) {
                        sorptionShapeX = coverLayer.addShape({
                            type: 'line',
                            id: 'sorptionX',
                            style: {
                                strokeColor: '#4AFF4A'
                            },
                            p0: {},
                            p1: {}
                        });
                    }

                    var i = 0;
                    var posXList = [this.bound.x, centerX, this.bound.x + this.bound.width];
                    for (i = 0; i < 3; i++) {
                        var result = this.editor.sorption.detectX(posXList[i] + x);
                        if (result) {
                            x = result.axis - posXList[i];
                            sorptionShapeX.p0.x = sorptionShapeX.p1.x = result.axis;
                            sorptionShapeX.p0.y = centerY + y;
                            sorptionShapeX.p1.y = result.y;
                            sorptionShapeX.disabled = false;
                            break;
                        }
                    }

                    if (i === 3) {
                        sorptionShapeX.disabled = true;
                    }
                }

                if (!fixY) {

                    // 设置吸附辅助线
                    var sorptionShapeY = coverLayer.getShape('sorptionY');
                    if (!sorptionShapeY) {
                        sorptionShapeY = coverLayer.addShape({
                            type: 'line',
                            id: 'sorptionY',
                            style: {
                                strokeColor: '#4AFF4A'
                            },
                            p0: {},
                            p1: {}
                        });
                    }

                    var i = 0;
                    var posYList = [this.bound.y, centerY, this.bound.y + this.bound.height];
                    for (i = 0; i < 3; i++) {
                        var result = this.editor.sorption.detectY(posYList[i] + y);
                        if (result) {
                            y = result.axis - posYList[i];
                            sorptionShapeY.p0.x = centerX + x;
                            sorptionShapeY.p1.x = result.x;
                            sorptionShapeY.p0.y = sorptionShapeY.p1.y = result.axis;
                            sorptionShapeY.disabled = false;
                            break;
                        }
                    }

                    if (i === 3) {
                        sorptionShapeY.disabled = true;
                    }
                }

            }

            this.coverShapes.forEach(function(coverShape, index) {
                var shape = lang.clone(shapes[index]);
                pathAdjust(shape.points, 1, 1, x, y);
                lang.extend(coverShape, shape);

            });

            // 更新边界
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
