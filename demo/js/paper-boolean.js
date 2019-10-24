/**
 * @file paperjs path  boolean 操作
 * @author mengke01(kekee000@gmail.com)
 */

import paper from 'paper';
import contour2svg from 'fonteditor-core/ttf/util/contour2svg';
import contours2svg from 'fonteditor-core/ttf/util/contours2svg';

const booleanStyle = {
    fillColor: new Color(1, 0, 0, 0.5),
    strokeColor: new Color(0, 0, 0),
    strokeWidth: 1.5
};

const pathStyleNormal = {
    strokeColor: new Color(0, 0, 0),
    fillColor: new Color(0, 0, 0, 0.1),
    strokeWidth: 1
};

const pathStyleBoolean = {
    strokeColor: new Color(0.8),
    fillColor: new Color(0, 0, 0, 0.5),
    strokeWidth: 1
};

let path1 = 'M316.01053,137.23124c0,-24.52046 -9.12403,-45.39839 -27.37209,-62.63379c-18.24806,-17.2354 -40.2907,-25.8531 -66.12791,-25.8531c-25.83721,0 -47.87984,8.6177 -66.12791,25.8531c-18.24806,17.2354 -27.37209,38.11333 -27.37209,62.63379c0,16.52466 4.86047,32.33858 14.5814,47.44176c0.85271,1.06611 4.68992,6.26338 11.51163,15.59182c6.82171,9.32844 12.96124,17.99056 18.4186,25.98636c5.45736,7.9958 11.55426,18.21266 18.2907,30.65058c6.73643,12.43792 11.81008,24.07625 15.22093,34.91501c1.02326,3.37601 3.06977,6.04127 6.13953,7.9958c3.06977,1.95453 6.18217,2.93179 9.33721,2.93179c3.15504,0 6.31008,-0.97726 9.46512,-2.93179c3.15504,-1.95453 5.15891,-4.6198 6.01163,-7.9958c3.41085,-10.83875 8.4845,-22.47709 15.22093,-34.91501c6.73643,-12.43792 12.83333,-22.65477 18.2907,-30.65058c5.45736,-7.9958 11.5969,-16.65792 18.4186,-25.98636c6.82171,-9.32844 10.65891,-14.52571 11.51163,-15.59182c9.72093,-14.74781 14.5814,-30.56173 14.5814,-47.44176zM261.96983,180.20868c-0.42636,0.53305 -2.34496,3.13169 -5.75581,7.79591c-3.41085,4.66422 -6.48062,8.99528 -9.2093,12.99318c-2.72868,3.9979 -5.77713,9.10633 -9.14535,15.32529c-3.36822,6.21896 -5.90504,12.03813 -7.61047,17.4575c-0.42636,1.688 -1.42829,3.02064 -3.00581,3.9979c-1.57752,0.97726 -3.15504,1.4659 -4.73256,1.4659c-1.57752,0 -3.13372,-0.48863 -4.6686,-1.4659c-1.53488,-0.97726 -2.55814,-2.3099 -3.06977,-3.9979c-1.70543,-5.41938 -4.24225,-11.23854 -7.61047,-17.4575c-3.36822,-6.21896 -6.41667,-11.32739 -9.14535,-15.32529c-2.72868,-3.9979 -5.79845,-8.32896 -9.2093,-12.99318c-3.41085,-4.66422 -5.32946,-7.26285 -5.75581,-7.79591c-4.86047,-7.55159 -7.2907,-15.45855 -7.2907,-23.72088c0,-12.26023 4.56202,-22.6992 13.68605,-31.31689c9.12403,-8.6177 20.14535,-12.92655 33.06395,-12.92655c12.9186,0 23.93992,4.30885 33.06395,12.92655c9.12403,8.6177 13.68605,19.05666 13.68605,31.31689c0,8.44001 -2.43023,16.34697 -7.2907,23.72088z';

let spliter = [
    {x: 307, y: 430, onCurve: true},
    {x: 119, y: -14, onCurve: true}
];


// 复合路径分割操作
function contoursdivide(contours1, spliter, operation) {
    let path1 = new paper.CompoundPath(contours1);
    let path2 = new paper.Path({
        segments: [
            [spliter[0].x, spliter[0].y],
            [spliter[1].x, spliter[1].y]
        ],
        closed: false
    });

    let intersections = path1.getIntersections(path2); // 分割
    intersections.forEach(function (ins) {
        console.log(ins.getPoint());
        let result = ins.split();
        // console.log(result);
    });
    let a = 0;
    path1.children.forEach(function (path) {
        path.segments[0].clearHandles();
        path.segments[path.segments.length - 1].clearHandles();
        path.closePath();
        if (++a % 2) {
            path.position.x -= 20;
        }
    });
    path1.resolveCrossings().reorient();

    path1.style = pathStyleBoolean;
    view.draw();
    let pathData = path1.getChildren().map(function (path) {
        return path.getPathData();
    }).join('');
    $('#pathresult').attr('d', pathData);
}


const entry = {

    /**
     * 初始化
     */
    init() {
        paper.setup(document.getElementById('canvas'));

        $('#path1').attr('d', path1);
        $('#path2').attr('d', contour2svg(spliter));
        // contoursboolean(contours1, contours2);
        contoursdivide(path1, spliter);
    }
};

entry.init();
