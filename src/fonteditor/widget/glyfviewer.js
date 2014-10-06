/**
 * @file glyflist.js
 * @author mengke01
 * @date 
 * @description
 * glyf 查看器
 */

define(
    function(require) {
        var glyf2svg = require('ttf/util/glyf2svg');
        var string = require('common/string');
        
        var GLYF_ITEM_TPL = ''
            + '<div data-index="${index}" class="glyf-item ${compound} ${modify}">'
            +   '<svg class="glyf" viewbox="0 0 ${unitsPerEm} ${unitsPerEm}"><g transform="scale(1, -1) translate(0, -${descent}) scale(0.95, 0.95) "><path class="path" ${d}/></g></svg>'
            +   '<div class="unicode" title="${unicode}">${unicode}</div><div class="name" title="${name}">${name}</div>'
            + '</div>';


        // 显示glyf
        function showGLYF(ttf) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = unitsPerEm + ttf.hhea.descent;
            var glyfStr = '', d = '';
            ttf.glyf.forEach(function(glyf, index) {
                var g = {
                    index: index,
                    compound: glyf.compound ? 'compound' : '',
                    modify: glyf.modify,
                    unitsPerEm: unitsPerEm,
                    descent: descent,
                    unicode: (glyf.unicode || []).map(function(u) {
                        return '$' + u.toString(16).toUpperCase();
                    }).join(','),
                    name: glyf.name
                };

                if (d = glyf2svg(glyf, ttf)) {
                    g.d = 'd="'+ d +'"';
                }

                glyfStr += string.format(GLYF_ITEM_TPL, g);
            });

            this.main.html(glyfStr);
        }

        /**
         * glyf查看器
         * 
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         */
        function GlyfViewer(main, options) {
            this.options = options || {};
            this.main = $(main);
        }

        GlyfViewer.prototype.show = function(ttf) {
            showGLYF.call(this, ttf);
        };

        require('common/observable').mixin(GlyfViewer.prototype);

        return GlyfViewer;
    }
);
