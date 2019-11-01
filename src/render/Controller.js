/**
 * @file 默认的渲染控制器，仅实现基本的缩放平移控制
 * @author mengke01(kekee000@gmail.com)
 */

import selectShape from './util/selectShape';


export default class Controller {

    /**
     * Render控制器
     *
     * @param {Object} options 参数
     * @constructor
     */
    constructor(options = {}) {
        this.options = options;
    }

    /**
     * 设置render对象
     *
     * 所有的controller都需要实现此接口
     *
     * @param {Render} render render对象
     * @return {this}
     */
    setRender(render) {
        this.render = render;
        render.capture.on('down', function (e) {
            let result = render.getLayer('cover').getShapeIn(e);

            if (result) {
                render.selectedShape = result[0];
            }
            else {
                result = render.getLayer('font').getShapeIn(e);
                if (result.length > 1) {
                    render.selectedShape = selectShape(result, e);
                }
                else {
                    render.selectedShape = result[0];
                }
            }


            render.camera.x = e.x;
            render.camera.y = e.y;
        });

        render.capture.on('drag', function (e) {
            let shape = render.selectedShape;
            if (shape) {
                render.getLayer(shape.layerId)
                    .move(e.x - render.camera.x, e.y - render.camera.y, shape)
                    .refresh();
            }
            else {
                render.move(e.x - render.camera.x, e.y - render.camera.y)
                    .refresh();
            }
            render.camera.x = e.x;
            render.camera.y = e.y;
        });

        render.capture.on('dragend', function (e) {
            let shape = render.selectedShape;
            if (shape) {
                render.getLayer(shape.layerId)
                    .move(e.x - render.camera.x, e.y - render.camera.y, shape)
                    .refresh();
                render.selectedShape = null;
            }
            else {
                render.painter.refresh();
            }
        });
        return this;
    }

    /**
     * 注销
     */
    dispose() {
        this.render && this.render.dispose();
        this.options = this.render = null;
    }
}

