/**
 * @file hmtx 表
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hmtx.html
 */


define(
    function (require) {
        var table = require('./table');

        var hmtx = table.create(
            'hmtx',
            [],
            {

                read: function (reader, ttf) {
                    var offset = this.offset;
                    reader.seek(offset);

                    var numOfLongHorMetrics = ttf.hhea.numOfLongHorMetrics;
                    var hMetrics = [];
                    var i;
                    var hMetric;
                    for (i = 0; i < numOfLongHorMetrics; ++i) {
                        hMetric = {};
                        hMetric.advanceWidth = reader.readUint16();
                        hMetric.leftSideBearing = reader.readInt16();
                        hMetrics.push(hMetric);
                    }

                    // 最后一个宽度
                    var advanceWidth = hMetrics[numOfLongHorMetrics - 1].advanceWidth;
                    var numOfLast = ttf.maxp.numGlyphs - numOfLongHorMetrics;

                    // 获取后续的hmetrics
                    for (i = 0; i < numOfLast; ++i) {
                        hMetric = {};
                        hMetric.advanceWidth = advanceWidth;
                        hMetric.leftSideBearing = reader.readInt16();
                        hMetrics.push(hMetric);
                    }

                    return hMetrics;

                },

                write: function (writer, ttf) {
                    var i;
                    var numOfLongHorMetrics = ttf.hhea.numOfLongHorMetrics;
                    for (i = 0; i < numOfLongHorMetrics; ++i) {
                        writer.writeUint16(ttf.glyf[i].advanceWidth);
                        writer.writeInt16(ttf.glyf[i].leftSideBearing);
                    }

                    // 最后一个宽度
                    var numOfLast = ttf.glyf.length - numOfLongHorMetrics;

                    for (i = 0; i < numOfLast; ++i) {
                        writer.writeInt16(ttf.glyf[numOfLongHorMetrics + i].leftSideBearing);
                    }

                    return writer;
                },

                size: function (ttf) {

                    // 计算同最后一个advanceWidth相等的元素个数
                    var numOfLast = 0;
                    // 最后一个advanceWidth
                    var advanceWidth = ttf.glyf[ttf.glyf.length - 1].advanceWidth;

                    for (var i = ttf.glyf.length - 2; i >= 0; i--) {
                        if (advanceWidth === ttf.glyf[i].advanceWidth) {
                            numOfLast++;
                        }
                        else {
                            break;
                        }
                    }

                    ttf.hhea.numOfLongHorMetrics = ttf.glyf.length - numOfLast;

                    return 4 * ttf.hhea.numOfLongHorMetrics + 2 * numOfLast;
                }
            }
        );

        return hmtx;
    }
);
