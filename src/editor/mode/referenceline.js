/**
 * @file 参考线操作模式
 * @author mengke01(kekee000@gmail.com)
 */

import lang from 'common/lang';

const mode = {

    newLine: 1, // 拖出新参考线模式

    dragLine: 2, // 拖动参考线模式

    drag(e) {
        if (1 === e.which) {
            if (this.currentLine) {
                let camera = this.render.camera;
                let line = this.currentLine;
                if (undefined !== line.p0.x) {
                    line.p0.x += camera.mx;
                }
                else {
                    line.p0.y += camera.my;
                }
                this.referenceLineLayer.refresh();
            }
            else if (this._dragMode === mode.newLine) {

                if (e.startX <= 20 && e.x > 20) {
                    this.currentLine = this.referenceLineLayer.addShape('gridarrow', {
                        p0: {
                            x: e.x
                        },
                        axis: this.axis,
                        drawAxisText: true,
                        style: this.options.referenceline.style
                    });
                    this._dragMode = mode.dragLine;
                    this.render.setCursor('col-resize');
                }
                else if (e.startY <= 20 && e.y > 20) {
                    this.currentLine = this.referenceLineLayer.addShape('gridarrow', {
                        p0: {
                            y: e.y
                        },
                        axis: this.axis,
                        drawAxisText: true,
                        style: this.options.referenceline.style
                    });
                    this._dragMode = mode.dragLine;
                    this.render.setCursor('row-resize');
                }
            }
        }
    },


    up(e) {
        if (1 === e.which) {
            if (this.currentLine) {
                let line = this.currentLine;

                // 如果右支撑被移除去了
                if (line === this.rightSideBearing && line.p0.x < 20) {
                    line.p0.x = this.p0.x;
                    this.referenceLineLayer.refresh();
                }
                // 拖出刻度线，代表删除
                else if ((undefined !== line.p0.x && line.p0.x < 20)
                    || (undefined !== line.p0.y && line.p0.y < 20)
                ) {
                    this.execCommand('removereferenceline', line);
                }
            }
            this.setMode();
        }
    },


    begin(m, arg1) {
        if (m === mode.dragLine) {
            let line = arg1;
            if (undefined !== line.p0.x) {
                this.render.setCursor('col-resize');
            }
            else {
                this.render.setCursor('row-resize');
            }

            this.currentLine = line;
            this.p0 = lang.clone(line.p0);
        }
        this._dragMode = m;
    },


    end() {
        delete this._dragMode;
        delete this.currentLine;
        delete this.p0;
        this.render.setCursor('default');
    }
};

export default mode;
