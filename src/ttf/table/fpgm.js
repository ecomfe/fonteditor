/**
 * @file fpgm 表
 * @author mengke01(kekee000@gmail.com)
 *
 * reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6fpgm.html
 */

define(
    function (require) {

        var table = require('./table');

        var fpgm = table.create(
            'fpgm',
            [],
            {

                read: function (reader, ttf) {
                    var length = ttf.tables['fpgm'].length;
                    return reader.readBytes(this.offset, length);
                },

                write: function (writer, ttf) {
                    if (ttf.fpgm) {
                        writer.writeBytes(ttf.fpgm, ttf.fpgm.length);
                    }
                },

                size: function (ttf) {
                    return ttf.fpgm ? ttf.fpgm.length : 0;
                }
            }
        );

        return fpgm;
    }
);
