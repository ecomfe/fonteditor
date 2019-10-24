/**
 * @file 寻找关键点
 * @author mengke01(kekee000@gmail.com)
 */

import reducePoints from 'graphics/image/contour/reducePoints';
import findBreakPoints from 'graphics/image/contour/findBreakPoints';
import pathUtil from 'graphics/pathUtil';

const data = require('../data/image-contours-circle');


const entry = {

    /**
     * 初始化
     */
    init() {
        let breakPoints = [];
        let html = '';

        data.forEach(function(c) {
            c.splice(c.length - 1, 1);
        });

        data.forEach(function (contour) {
            contour.forEach(function(p) {
                html += '<i style="left:'+p.x+'px;top:'+p.y+'px;"></i>';
            });
        });

        $('#points').html(html);

        data.forEach(function (contour) {
            pathUtil.scale(contour, 2);
            let ctr = reducePoints(contour, 0, contour.length - 1, 2);
            let points  = findBreakPoints(ctr, 2);
            breakPoints = breakPoints.concat(ctr);
            pathUtil.scale(contour, 0.5);
        });


        html = '';
        for (let i = 0, l = breakPoints.length; i < l; i++) {
            let c = "";
            let p = breakPoints[i];
            if (p.breakPoint) {
                c = 'break';
            }
            else if (p.apex) {
                c = 'apex';
            }
            else if(p.inflexion) {
                c = 'inflexion';
            }
            else if(p.tangency) {
                c = 'tangency';
            }
            let width = '';
            if (p.right == 1) {
                width = 'width: 4px;height: 4px';
            }
            html += '<i data-index="'+ p.index +'" data-pdist="'+ (p.pdist / 2)+'" data-ndist="'+(p.ndist/2) +'"'
                + (p.ntiny || p.ptiny ? 'data-tiny="1"' : '')
                + (p.tangency ? 'data-tangency="1"' : '')
                + (p.visited ? 'data-visited="1"' : '') +' title="'+ p.theta +'"  style="left:'+p.x+'px;top:'+p.y+'px;'+width+'" class="'+c+'"></i>';
        }

        $('#points-break').html(html);
    }
};

entry.init();
