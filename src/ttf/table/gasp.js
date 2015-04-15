/**
 * @file gasp 表
 * 对于需要hinting的字号需要这个表，否则会导致错误
 * @author mengke01(kekee000@gmail.com)
 * reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gasp.html
 */


define(
    function (require) {

        var table = require('./table');

        var gasp = table.create(
            'gasp',
            [],
            {

                read: function (reader, ttf) {
                    var length = ttf.tables.gasp.length;
                    return reader.readBytes(this.offset, length);
                },

                write: function (writer, ttf) {
                    if (ttf.gasp) {
                        writer.writeBytes(ttf.gasp, ttf.gasp.length);
                    }
                },

                size: function (ttf) {
                    return ttf.gasp ? ttf.gasp.length : 0;
                }
            }
        );

        return gasp;
    }
);
