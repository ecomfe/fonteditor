/**
 * @file 单元测试入口
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        // math
        require('./math/getBezierQ2T.spec');

        // ttf
        require('./ttf/reader-writer.spec');

        // graphics
        require('./graphics/vector.spec');
        require('./graphics/isSegmentCross.spec');
    }
);
