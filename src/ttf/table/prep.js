/**
 * @file prep表
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: http://www.microsoft.com/typography/otspec140/prep.htm
 */

define(
    function (require) {

        var table = require('./table');

        var prep = table.create(
            'prep',
            [],
            {

                read: function (reader, ttf) {
                    var length = ttf.tables.prep.length;
                    return reader.readBytes(this.offset, length);
                },

                write: function (writer, ttf) {
                    if (ttf.prep) {
                        writer.writeBytes(ttf.prep, ttf.prep.length);
                    }
                },

                size: function (ttf) {
                    return ttf.prep ? ttf.prep.length : 0;
                }
            }
        );

        return prep;
    }
);
