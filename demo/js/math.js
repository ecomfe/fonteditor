/**
 * @file math.js
 * @author mengke01
 * @date
 * @description
 * 方程运算
 */

import quadraticEquation from 'math/quadraticEquation';
import cubeEquation from 'math/cubeEquation';
import quarticEquation from 'math/quarticEquation';

import bezierQ2Equation from 'math/bezierQ2Equation';
import bezierCubeEquation from 'math/bezierCubeEquation';
import bezierQ4Equation from 'math/bezierQ4Equation';

const entry = {

    /**
     * 初始化
     */
    init() {

        console.log(quadraticEquation(1, 0, 1));
        console.log(bezierQ2Equation(1, 0, 1));
        console.log('--------------------------------');
        console.log(quadraticEquation(1, -2, 1));
        console.log(bezierQ2Equation(1, -2, 1));
        console.log('--------------------------------');




        console.log(cubeEquation(1, 0, 0, 1));
        console.log(bezierCubeEquation(1, 0, 0, 1));
        console.log('--------------------------------');
        console.log(cubeEquation(1, 0, 0, -1));
        console.log(bezierCubeEquation(1, 0, 0, -1));
        console.log('--------------------------------');




        console.log(quarticEquation(1, 0, 0, 0, 1));
        console.log(bezierQ4Equation(1, 0, 0, 0, 1));
        console.log('--------------------------------');
        console.log(quarticEquation(1, 0, 0, 0, -1));
        console.log(bezierQ4Equation(1, 0, 0, 0, -1));












    }
};

entry.init();