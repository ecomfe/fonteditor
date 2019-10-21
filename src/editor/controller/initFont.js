/**
 * @file Editor 的font相关方法
 * @author mengke01(kekee000@gmail.com)
 */

import lang from 'common/lang';
import pathAdjust from 'graphics/pathAdjust';
import pathCeil from 'graphics/pathCeil';
import computeBoundingBox from 'graphics/computeBoundingBox';
import guid from 'render/util/guid';
import getFontHash from '../util/getFontHash';

/**
 * 设置字体信息
 *
 * @param {Object} font font结构
 * @param {Array} font.contours 轮廓数组
 * @param {Array} font.unicode unicode编码点
 * @param {number} font.advanceWidth 推荐宽度
 * @param {number} font.xMin xMin
 * @param {number} font.xMax xMax
 * @param {number} font.yMin yMin
 * @param {number} font.yMax yMax
 * @return {this}
 */
function setFont(font) {

    this.font = font;
    this.fontHash = getFontHash(font);

    let originX = this.axis.x;
    let originY = this.axis.y;
    // 设置字形
    let fontLayer = this.fontLayer;
    fontLayer.clearShapes();
    let scale = 1;
    // 简单字形
    if (!font.compound) {
        let contours = font.contours || [];

        // 不需要在此保存contours
        delete font.contours;

        // 由于advanceWidth = rightSideBearing + xMax，原来的设置可能会不准确，重新计算
        let box = computeBoundingBox.computePathBox.apply(null, contours);

        if (box) {
            font.rightSideBearing = font.advanceWidth - box.x - box.width;
        }
        else {
            font.rightSideBearing = font.advanceWidth;
        }

        contours.forEach(function (contour) {
            fontLayer.addShape('path', {
                points: contour
            });
        });

        let shapes = fontLayer.shapes;

        // 重置历史
        this.history.reset();
        this.history.add(lang.clone(shapes));

        // 设置缩放
        scale = this.render.camera.scale;
        shapes.forEach(function (shape) {
            pathAdjust(shape.points, scale, -scale);
            pathAdjust(shape.points, 1, 1, originX, originY);
        });
    }

    fontLayer.refresh();

    // 设置参考线
    let advanceWidth = font.advanceWidth;
    this.rightSideBearing.p0.x = originX + (advanceWidth || this.options.unitsPerEm) * scale;
    this.referenceLineLayer.refresh();

    this.setMode();
    return this;
}

/**
 * 添加编辑中的shapes
 *
 * @param {Array} shapes 轮廓数组
 * @param {number} scale 原始轮廓缩放级别，没有设置则按照camera的缩放级别来进行缩放
 * @return {this}
 */
function addShapes(shapes, scale) {
    scale = scale || this.render.camera.scale;
    let origin = this.axis;
    let fontLayer = this.fontLayer;

    // 建立id hash 防止重复
    let shapeIdList = {};
    fontLayer.shapes.forEach(function (shape) {
        shapeIdList[shape.id] = true;
    });

    // 调整坐标系，重置ID
    shapes.forEach(function (shape) {
        pathAdjust(shape.points, scale, -scale);
        pathAdjust(shape.points, 1, 1, origin.x, origin.y);

        if (shapeIdList[shape.id]) {
            shape.id = guid('shape');
        }

        fontLayer.addShape(shape);
    });

    fontLayer.refresh();

    return this;
}

/**
 * 设置编辑中的轮廓
 *
 * @param {Array} contours 轮廓数组
 * @param {number} scale 原始轮廓缩放级别
 * @return {this}
 */
function addContours(contours, scale) {
    if (!contours || contours.length === 0) {
        return this;
    }

    let shapes = contours.map(function (contour) {
        return {
            id: guid('shape'),
            type: 'path',
            points: contour
        };
    });

    this.addShapes(shapes, scale);

    this.fire('change');

    return shapes;
}

/**
 * 获取编辑中的shapes
 *
 * @param {Array} shapes 要获取的shapes
 * @return {Array} 获取编辑中的shape
 */
function getShapes(shapes) {
    let origin = this.axis;
    shapes = shapes ? lang.clone(shapes) : lang.clone(this.fontLayer.shapes);
    let scale = 1 / this.render.camera.scale;

    // 调整坐标系
    shapes.forEach(function (shape) {
        pathAdjust(shape.points, scale, -scale, -origin.x, -origin.y);
    });

    return shapes;
}

/**
 * 获取编辑后的font
 *
 * @return {Object} glyfObject
 */
function getFont() {
    let font = lang.clone(this.font || {});
    font.unicode = font.unicode || [];
    font.name = font.name || '';

    let origin = this.axis;
    let advanceWidth = Math.round(
        (this.rightSideBearing.p0.x - origin.x) / this.render.camera.scale
    );
    let shapes = this.getShapes();
    let contours = shapes.map(function (shape) {
        return shape.points;
    });

    contours.forEach(function (g) {
        pathCeil(g);
    });

    // 设置边界
    let box = computeBoundingBox.computePathBox.apply(null, contours) || {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    font.xMin = box.x;
    font.yMin = box.y;
    font.xMax = box.x + box.width;
    font.yMax = box.y + box.height;
    font.leftSideBearing = font.xMin;

    // 这里仅还原之前的设置
    if (box.width === 0) {
        font.advanceWidth = font.rightSideBearing;
    }
    else {
        font.advanceWidth = advanceWidth || (font.xMax + font.rightSideBearing) || font.xMax;
    }

    delete font.rightSideBearing;

    font.contours = contours;

    return font;
}

/**
 * 调整font信息
 *
 * @param {Object} options 参数选项
 * @param {Object} options.leftSideBearing 左支撑
 * @param {Object} options.rightSideBearing 右支撑
 * @param {Object} options.unicode unicode
 * @param {Object} options.name 名字
 * @return {this}
 */
function adjustFont(options) {

    if (!this.font) {
        return;
    }

    let scale = this.render.camera.scale;
    let shapes = this.fontLayer.shapes;

    let origin = this.axis;
    // 计算边界
    let box = computeBoundingBox.computePathBox.apply(null, shapes.map(function (shape) {
        return shape.points;
    }));

    if (box) {
        let offset = 0;
        let xMin = box.x - origin.x;

        // 左边轴
        if (undefined !== options.leftSideBearing
            && Math.abs(options.leftSideBearing - xMin / scale) > 0.01
        ) {
            offset = options.leftSideBearing * scale - xMin;
            shapes.forEach(function (g) {
                pathAdjust(g.points, 1, 1, offset, 0);
            });
            this.fontLayer.refresh();
            this.font.leftSideBearing = options.leftSideBearing;
            this.fire('change');
        }

        // 右边轴
        if (undefined !== options.rightSideBearing) {
            this.font.rightSideBearing = options.rightSideBearing;
            this.rightSideBearing.p0.x = box.x + box.width
                + offset + options.rightSideBearing * scale;
            this.referenceLineLayer.refresh();
        }
    }
    else {
        this.font.rightSideBearing = options.rightSideBearing;
    }

    if (undefined !== options.unicode) {
        this.font.unicode = options.unicode;
    }

    if (undefined !== options.name) {
        this.font.name = options.name;
    }

    this.fire('change');
    return this;
}

export default function () {
    this.setFont = setFont;
    this.getFont = getFont;
    this.adjustFont = adjustFont;

    this.addShapes = addShapes;
    this.getShapes = getShapes;
    this.addContours = addContours;
}
