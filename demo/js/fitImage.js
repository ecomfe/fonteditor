/**
 * @file canvas读取图片
 * @author mengke01(kekee000@gmail.com)
 */

import ImageProcessor from 'graphics/image/ImageProcessor';
import ContourPointsProcessor from 'graphics/image/ContourPointsProcessor';
import pathsUtil from 'graphics/pathsUtil';
import editor from 'editor/main';

let ctx = null;
let canvas = null;
let curImage = null;
let contourProcessor = null;

function onUpFileChange(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {

        let image = curImage = new Image();
        image.onload = function () {
            getContours(image);
        };

        image.src = e.target.result;
    };

    reader.onerror = function (e) {
        console.error(e);
    };

    reader.readAsDataURL(file);
}

function getContours(image) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let width = image.width;
    let height = image.height;
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0, width, height);
    let imgData = ctx.getImageData(0, 0, width, height);
    let result = new ImageProcessor(imgData).binarize(+$('#threshold-gray').val()).get();

    let putData = imgData.data;
    for (let y = 0; y < height; y++) {
        let line = width * y;
        for (let x = 0; x < width; x++) {
            let offset = line + x;
            if (result.data[offset] === 0) {
                putData[offset * 4] = 208;
                putData[offset * 4 + 1] = 247;
                putData[offset * 4 + 2] = 113;
                putData[offset * 4 + 3] = 255;
            }
            else {
                putData[offset * 4] = 255;
                putData[offset * 4 + 1] = 255;
                putData[offset * 4 + 2] = 255;
                putData[offset * 4 + 3] = 255;
            }
        }
    }
    contourProcessor = new ContourPointsProcessor();
    contourProcessor.import(result);
    let contours = contourProcessor.get();

    contours.forEach(function (contour) {
        contour.forEach(function (p) {
            let offset = p.y * width + p.x;
            putData[offset * 4] = 255;
            putData[offset * 4 + 1] = 0;
            putData[offset * 4 + 2] = 0;
            putData[offset * 4 + 3] = 255;
        });
    });
    ctx.putImageData(imgData, 0, 0);

    getBreakPoint();

    contours = contourProcessor.getContours();
    window.editor.setFont({
        contours: pathsUtil.flip(contours)
    });
}


function getBreakPoint() {
    let breakPoints = contourProcessor.getBreakPoints();
    breakPoints.forEach(function (p) {
        ctx.beginPath();
        if (p.breakPoint) {
            ctx.fillStyle = 'red';
        }
        else if (p.inflexion) {
            ctx.fillStyle = 'blue';
        }
        else if (p.tangency) {
            ctx.fillStyle = 'green';
        }
        ctx.fillRect(p.x, p.y, p.right === 1 ? 6 : 3, p.right === 1 ? 6 : 3);
    });

}

function refresh() {
    curImage && getContours(curImage);
}

const entry = {

    /**
     * 初始化
     */
    init() {

        window.editor = editor.create($('#render-view').get(0));
        document.getElementById('upload-file').addEventListener('change', onUpFileChange);
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        $('#threshold-gray').on('change', refresh);

        let img = new Image();
        img.onload = function () {
            curImage = img;
            refresh();
        };
        img.src = './test/qgqc.jpg';
    }
};

entry.init();
