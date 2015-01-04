/**
 * @file supportHistory.js
 * @author mengke01
 * @date
 * @description
 *  命令相关配置
 */


define(
    function (require) {

        // 支持历史记录的命令列表
        var supportHistory = {
            alignshapes: true,
            verticalalignshapes: true,
            horizontalalignshapes: true,
            joinshapes: true,
            intersectshapes: true,
            tangencyshapes: true,
            splitshapes: true,
            removeshapes: true,
            reversepoints: true,
            topshape: true,
            bottomshape: true,
            upshape: true,
            downshape: true,
            cutshapes: true,
            pasteshapes: true,
            addshapes: true,
            rotateleft: true,
            rotateright: true,
            flipshapes: true,
            mirrorshapes: true
        };


        return {
            history: supportHistory
        };
    }
);
