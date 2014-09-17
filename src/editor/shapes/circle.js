/**
 * @file circle.js
 * @author mengke01
 * @date 
 * @description
 * 圆的shape
 */

define(
    function(require) {
        return {
            xMin:0,
            yMin:0,
            xMax: 300,
            yMax: 300,
            points:[
                {x:212, y: 300},
                {x:300, y: 212},
                {x:300, y: 88},
                {x:212, y: 0},
                {x:87, y: 0},
                {x:0, y: 88},
                {x:0, y: 212},
                {x:87, y: 300}
            ]
        };
    }
);
