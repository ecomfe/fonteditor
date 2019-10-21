/**
 * @file 默认模式
 * @author mengke01(kekee000@gmail.com)
 */

import selectShape from 'render/util/selectShape';
import referenceline from './referenceline';
export default {


    down(e) {
        if (1 === e.which) {

            // 是否在边界拉出参考线
            if (e.x <= 20 || e.y <= 20) {
                this.setMode('referenceline', referenceline.newLine, e.x, e.y);
                return;
            }

            // 字体模式
            let result = this.fontLayer.getShapeIn(e);
            if (result) {
                let shape = selectShape(result, e);
                this.setMode('shapes', [shape], 'bound');
                return;
            }

            // 参考线模式
            result = this.referenceLineLayer.getShapeIn(e);
            if (result) {
                let line = result[0];
                this.setMode('referenceline', referenceline.dragLine, line, e);
                return;
            }

            this.setMode('range');
        }
    },


    keydown(e) {
        if (e.keyCode === 32) {
            this.setMode('pan');
        }
        else if (e.keyCode === 65 && e.ctrlKey) {
            this.setMode('shapes', this.fontLayer.shapes.slice());
        }
    }
};

