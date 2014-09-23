/**
 * @file hmtx.js
 * @author mengke01
 * @date 
 * @description
 * hmtx 表
 * 
 * The 'hmtx' table contains metric information
 *  for the horizontal layout each of the glyphs in the font
 * 
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hmtx.html
 */


define(
    function(require) {
        var table = require('./table');

        var hmtx = table.create(
            'hmtx', 
            [
            ], 
            {
                read: function(reader, ttf) {
                    var offset = this.offset;
                    reader.seek(offset);

                    var numOfLongHorMetrics = ttf.hhea.numOfLongHorMetrics;
                    var hMetrics = [];
                    
                    for (var i = 0; i < numOfLongHorMetrics; ++i) {
                        var hMetric = {};
                        hMetric.advanceWidth = reader.readUint16();
                        hMetric.leftSideBearing = reader.readInt16();
                        hMetrics.push(hMetric);
                    }

                    // 最后一个宽度
                    var advanceWidth = hMetrics[numOfLongHorMetrics - 1].advanceWidth;
                    var numOfLast = ttf.maxp.numGlyphs - numOfLongHorMetrics;
                    
                    // 获取后续的hmetrics
                    for (var i = 0; i < numOfLast; ++i) {
                        var hMetric = {};
                        hMetric.advanceWidth = advanceWidth;
                        hMetric.leftSideBearing = reader.readInt16();
                        hMetrics.push(hMetric);
                    }

                    return hMetrics;

                }
            }
        );

        return hmtx;
    }
);
