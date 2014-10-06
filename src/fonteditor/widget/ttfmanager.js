/**
 * @file ttf.js
 * @author mengke01
 * @date 
 * @description
 * ttf相关操作类
 */


define(
    function(require) {

        var pathAdjust = require('graphics/pathAdjust');

        var manager = {

            /**
             * 合并两个ttfObject，此处仅合并简单字形
             * 
             * @param {Object} ttf ttfObject
             * @param {Object} imported ttfObject
             * @param {Object} options 参数选项
             * @param {boolean} options.scale 是否自动缩放
             * 
             * @return {Object} 合并后的ttfObject
             */
            combine: function(ttf, imported, options) {
                options = options || {};

                // 调整glyf以适应打开的文件
                var scale = 1;
                // 对导入的轮廓进行缩放处理
                if (options.scale && imported.head.unitsPerEm && imported.head.unitsPerEm != ttf.head.unitsPerEm) {
                    scale = ttf.head.unitsPerEm / imported.head.unitsPerEm;
                }

                imported.glyf.filter(function(g, index) {

                    return g.contours && g.contours.length //简单轮廓
                        && g.name != '.notdef' && g.name != '.null' && g.name != 'nonmarkingreturn'; // 非预定义字形
                        
                }).forEach(function(g) {
                    if (scale !== 1) {
                        g.contours.forEach(function(contour) {
                            pathAdjust(contour, scale, scale);
                        });
                    }
                    g.modify = 'new';
                    ttf.glyf.push(g);
                });

                return ttf;
            }
        };

        return manager;
    }
);
