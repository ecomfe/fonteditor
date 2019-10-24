/**
 * @file 区域查看模式
 * @author mengke01(kekee000@gmail.com)
 */

export default {

    drag(e) {
        if (1 === e.which) {
            let camera = this.render.camera;
            this.render.move(camera.mx, camera.my);
            this.render.refresh();
        }
    },

    keyup(e) {
        if (e.keyCode === 32) {
            this.setMode('bound');
        }
    },


    begin() {
        this.render.setCursor('pointer');
    },


    end() {
        this.render.setCursor('default');
    }
};
