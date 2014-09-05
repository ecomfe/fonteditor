/**
 * @file math.js
 * @author mengke01
 * @date 
 * @description
 * 方程运算
 */

define(
    function(require) {

        var quadraticEquation = require('math/quadraticEquation');
        var cubeEquation = require('math/cubeEquation');
        var quarticEquation = require('math/quarticEquation');

        var bezierQuadraticEquation = require('math/bezierQuadraticEquation');
        var bezierCubeEquation = require('math/bezierCubeEquation');
        var bezierQuarticEquation = require('math/bezierQuarticEquation');

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                
                console.log(quadraticEquation(1, 0, 1));
                console.log(bezierQuadraticEquation(1, 0, 1));
                console.log('--------------------------------');
                console.log(quadraticEquation(1, -2, 1));
                console.log(bezierQuadraticEquation(1, -2, 1));
                console.log('--------------------------------');




                console.log(cubeEquation(1, 0, 0, 1));
                console.log(bezierCubeEquation(1, 0, 0, 1));
                console.log('--------------------------------');
                console.log(cubeEquation(1, 0, 0, -1));
                console.log(bezierCubeEquation(1, 0, 0, -1));
                console.log('--------------------------------');




                console.log(quarticEquation(1, 0, 0, 0, 1));
                console.log(bezierQuarticEquation(1, 0, 0, 0, 1));
                console.log('--------------------------------');
                console.log(quarticEquation(1, 0, 0, 0, -1));
                console.log(bezierQuarticEquation(1, 0, 0, 0, -1));



                
                

                
                
                
                
                

            }
        };

        entry.init();
        
        return entry;
    }
);