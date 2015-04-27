/**
 * @file cmap 表
 * @author mengke01(kekee000@gmail.com)
 *
 * @see
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
 */

define(
    function (require) {
        var table = require('./table');
        var parse = require('./cmap/parse');
        var write = require('./cmap/write');
        var sizeof = require('./cmap/sizeof');

        var cmap = table.create(
            'cmap',
            [],
            {
                read: parse,
                write: write,
                size: sizeof
            }
        );

        return cmap;
    }
);
