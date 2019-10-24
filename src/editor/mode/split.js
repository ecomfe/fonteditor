/**
 * @file 轮廓切割模式
 * @author mengke01(kekee000@gmail.com)
 */

export default {

    down(e) {
        if (1 === e.which) {
            this.coverLayer.clearShapes();
            this.splitLine = this.coverLayer.addShape({
                type: 'line',
                p0: {
                    x: e.x,
                    y: e.y
                },
                p1: {
                    x: e.x,
                    y: e.y
                }
            });
        }
    },


    move(e) {
        if (1 === e.which) {
            if (this.splitLine) {
                this.splitLine.p1.x = e.x;
                this.splitLine.p1.y = e.y;
                if (e.shiftKey) {
                    this.splitLine.p1.y = this.splitLine.p0.y;
                }

                if (e.altKey) {
                    this.splitLine.p1.x = this.splitLine.p0.x;
                }

                this.coverLayer.refresh();
            }
        }
    },


    up(e) {
        if (1 === e.which) {
            if (this.splitLine) {
                let p0 = this.splitLine.p0;
                let p1 = this.splitLine.p1;
                // 对shape进行多选
                if (Math.abs(p0.x - p1.x) >= 20 || Math.abs(p0.y - p1.y) >= 20) {
                    if (false !== this.execCommand('splitshapes', p0, p1)) {
                        return;
                    }
                }
            }

            this.setMode();
        }
    },

    begin() {
    },

    end() {
        delete this.splitLine;
        this.coverLayer.clearShapes();
        this.coverLayer.refresh();
    }
};

