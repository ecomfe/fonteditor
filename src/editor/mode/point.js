/**
 * @file 点编辑模式
 * @author mengke01(kekee000@gmail.com)
 */

import lang from 'common/lang';
import commandList from '../menu/commandList';

// 移动步频
const stepMap = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1]
};


function onContextMenu(e) {

    if (!this.curPoint) {
        return;
    }

    if (e.returnValue === false) {
        return;
    }

    this.contextMenu.hide();

    let command = e.command;
    let shape = this.curShape;
    let points = shape.points;
    let pointId = +this.curPoint.pointId;

    if (command === 'add') {
        let cur = points[pointId];
        let next = points[pointId === points.length - 1 ? 0 : pointId + 1];
        let p = {
            x: (cur.x + next.x) / 2,
            y: (cur.y + next.y) / 2,
            onCurve: true
        };

        points.splice(pointId + 1, 0, p);
    }
    else if (command === 'remove') {
        points.splice(pointId, 1);
    }
    else if (command === 'onCurve') {
        points[pointId].onCurve = true;
    }
    else if (command === 'offCurve') {
        delete points[pointId].onCurve;
    }
    else if (command === 'asStart') {
        shape.points = points.slice(pointId).concat(points.slice(0, pointId));
    }
    else if (this.supportCommand(command)) {
        this.execCommand(command);
        return;
    }

    refreshControlPoints.call(this, shape);

    delete this.curPoint;
    this.fontLayer.refresh();
    this.fire('change');
}


function refreshControlPoints(shape) {
    let controls = [];
    let last = shape.points.length - 1;
    let clonedShape = lang.clone(shape);

    let style = this.options.coverLayer;

    clonedShape.id = 'cover-' + shape.id;
    clonedShape.selectable = false;
    clonedShape.style = {
        strokeColor: style.outlineColor
    };
    clonedShape.points.forEach(function (p, index) {
        let cpoint = {
            type: p.onCurve ? 'point' : 'cpoint',
            x: p.x,
            y: p.y,
            point: p,
            pointId: index,
            style: {
                fill: true,
                stroke: true,
                strokeColor: style.strokeColor,
                fillColor: style.fillColor
            }
        };

        if (index === 0) {
            cpoint.style.strokeColor = 'blue';
            cpoint.style.fillColor = 'blue';
            cpoint.style.strokeWidth = 2;
        }
        else if (index === last) {
            cpoint.style.strokeColor = 'red';
            cpoint.style.fillColor = 'red';
            cpoint.style.strokeWidth = 2;
        }

        controls.push(cpoint);
    });

    let coverLayer = this.coverLayer;

    coverLayer.clearShapes();

    // 添加轮廓
    coverLayer.addShape(clonedShape);
    // 添加控制点
    controls.forEach(function (shape) {
        coverLayer.addShape(shape);
    });

    this.curShape = shape;
    coverLayer.refresh();
}


export default {


    down(e) {

        // 恢复原来样式
        if (this.curPoint) {
            if (this.curPoint._style) {
                this.curPoint.style = lang.clone(this.curPoint._style);
            }
        }

        delete this.curPoint;

        let result = this.coverLayer.getShapeIn(e);
        if (result) {
            this.curPoint = result[0];
            this.curPoint._style = lang.clone(this.curPoint.style);
            this.curPoint.style.fillColor = this.options.coverLayer.outlineColor;

            // 设置吸附选项
            if (this.sorption.isEnable()) {

                if (this.sorption.enableShape) {

                    let xAxisArray = [];
                    let yAxisArray = [];

                    // 过滤需要吸附的对象
                    this.curShape.points.forEach(function (p) {
                        xAxisArray.push(p.x);
                        yAxisArray.push(p.y);
                    });

                    // 添加参考线
                    let referenceLines = this.referenceLineLayer.shapes;
                    referenceLines.forEach(function (shape) {
                        if (undefined !== shape.p0.x) {
                            xAxisArray.push(shape.p0.x);
                        }
                        if (undefined !== shape.p0.y) {
                            yAxisArray.push(shape.p0.y);
                        }
                    });

                    this.sorption.clear();
                    xAxisArray.length && this.sorption.addXAxis(xAxisArray);
                    yAxisArray.length && this.sorption.addYAxis(yAxisArray);
                }
            }

            this.coverLayer.refresh();
        }
    },


    drag(e) {
        let camera = this.render.camera;
        if (this.curPoint) {
            let current = this.curPoint;
            let reserved = this.curShape.points[current.pointId];

            if (camera.event.altKey) {
                current.x = reserved.x;
            }
            else {
                current.x = reserved.x + camera.event.deltaX;
            }

            if (camera.event.shiftKey) {
                current.y = reserved.y;
            }
            else {
                current.y = reserved.y + camera.event.deltaY;
            }

            if (this.sorption.isEnable()) {
                let result;
                if (result = this.sorption.detectX(current.x)) {
                    current.x = result.axis;
                }

                if (result = this.sorption.detectY(current.y)) {
                    current.y = result.axis;
                }
            }

            current.point.x = current.x;
            current.point.y = current.y;
            // 更新tip text
            {
                if (!this.tipTextPoint) {
                    this.tipTextPoint = this.coverLayer.addShape('text',
                    Object.assign({text: ''}, this.options.tipText));
                }
                let coord = this.getPointCoordinate(current);
                this.tipTextPoint.text = coord.x + ',' + coord.y;
                this.tipTextPoint.x = e.x + 16;
                this.tipTextPoint.y = e.y + 16;
                this.coverLayer.refresh();
            }
        }
    },

    dragend() {
        // remove tip text
        if (this.tipTextPoint) {
            this.coverLayer.removeShape(this.tipTextPoint);
            this.tipTextPoint = null;
            this.coverLayer.refresh();
        }

        if (this.curPoint) {
            let reserved = this.curShape.points[this.curPoint.pointId];
            reserved.x = this.curPoint.x;
            reserved.y = this.curPoint.y;
            if (this.sorption.isEnable()) {
                this.sorption.clear();
            }
            this.fontLayer.refresh();
        }

        this.fire('change');
    },


    move(e) {
        let shape = this.coverLayer.getShapeIn(e);
        if (shape) {
            this.render.setCursor('pointer');
        }
        else {
            this.render.setCursor('default');
        }
    },


    rightdown(e) {
        if (this.curPoint) {
            this.contextMenu.onClick = onContextMenu.bind(this);
            this.contextMenu.show(e, commandList.point);
        }
    },


    keyup(e) {

        // esc键，重置model
        if (e.key === 'delete' && this.curPoint) {
            onContextMenu.call(this, {
                command: 'remove'
            });
        }
        // 移动
        else if (stepMap[e.key] && this.curPoint) {
            this.fire('change');
        }
        else if (e.key === 'esc') {
            this.setMode();
        }
    },


    keydown(e) {
        // 移动
        if (stepMap[e.key] && this.curPoint) {
            let step = stepMap[e.key];
            let current = this.curPoint;

            if (step[0]) {
                current.x += step[0];
            }

            if (step[1]) {
                current.y += step[1];
            }

            let reserved = this.curShape.points[current.pointId];
            reserved.x = current.point.x = current.x;
            reserved.y = current.point.y = current.y;

            this.coverLayer.refresh();
            this.fontLayer.refresh();
        }
    },


    begin(shape) {
        let me = this;
        refreshControlPoints.call(me, shape);
    },


    end() {

        delete this.curPoint;
        delete this.curShape;

        this.coverLayer.clearShapes();
        this.coverLayer.refresh();
        this.render.setCursor('default');
    }
};
