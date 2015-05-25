/**
 * @file 单元测试入口
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        // common
        require('./common/lang.spec');

        // math
        require('./math/getBezierQ2T.spec');


        // graphics
        require('./graphics/vector.spec');
        require('./graphics/isSegmentCross.spec');

        // ttf
        require('./ttf/reader.spec');
        require('./ttf/writer.spec');
        require('./ttf/ttfreader.spec');
        require('./ttf/ttfwriter.spec');
        require('./ttf/otfreader.spec');
        require('./ttf/otf2ttfobject.spec');
        require('./ttf/ttf2woff.spec');
        require('./ttf/woff2ttf.spec');
        require('./ttf/ttf2eot.spec');
        require('./ttf/eot2ttf.spec');
        require('./ttf/svg2ttfobject.spec');
        require('./ttf/ttf2svg.spec');
    }
);
