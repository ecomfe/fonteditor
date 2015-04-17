/**
 * @file cvt表
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cvt.html
 */

define(
    function (require) {

        var table = require('./table');

        var cvt = table.create(
            'cvt',
            [],
            {

                read: function (reader, ttf) {
                    var length = ttf.tables.cvt.length;
                    return reader.readBytes(this.offset, length);
                },

                write: function (writer, ttf) {
                    if (ttf.cvt) {
                        writer.writeBytes(ttf.cvt, ttf.cvt.length);
                    }
                },

                size: function (ttf) {
                    return ttf.cvt ? ttf.cvt.length : 0;
                }
            }
        );

        return cvt;
    }
);
