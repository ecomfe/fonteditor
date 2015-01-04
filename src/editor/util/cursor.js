/**
 * @file cursor.js
 * @author mengke01
 * @date
 * @description
 * 光标集合
 */


define(
    function (require) {
        // 不同位置的光标集合
        return {
            scale: {
                1: 'nw-resize',
                2: 'ne-resize',
                3: 'se-resize',
                4: 'sw-resize',
                5: 's-resize',
                6: 'e-resize',
                7: 'n-resize',
                8: 'w-resize'
            },
            rotate: {
                1: 'pointer',
                2: 'pointer',
                3: 'pointer',
                4: 'pointer',
                5: 'e-resize',
                6: 's-resize',
                7: 'w-resize',
                8: 'n-resize'
            }
        };
    }
);
