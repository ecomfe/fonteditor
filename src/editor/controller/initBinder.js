/**
 * @file 初始化绑定器
 * @author mengke01(kekee000@gmail.com)
 */

import commandSupport from '../command/commandSupport';

/**
 * 初始化绑定器
 */
export default function () {
    let me = this;
    // 保存历史记录
    me.on('change', function () {
        me.history.add(me.getShapes());
    });

    me.on('command', function (e) {
        if (false !== e.result && commandSupport.history[e.command]) {
            me.fire('change');
        }
    });
}
