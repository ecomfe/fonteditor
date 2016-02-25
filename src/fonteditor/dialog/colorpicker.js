/**
 * @file 颜色选择器
 * @author mengke01(kekee000@gmail.com)
 */


define(function(require) {
    var lang = require('common/lang');

    var defaultOptions = {
        customBG: '#222',
        margin: '5px -2px 0',
        doRender: 'div div',
        cssAddon: // could also be in a css file instead
            '.cp-color-picker{border:1px solid #999; padding:10px 10px 0;' +
            'background:#eee; overflow:visible; border-radius:3px;}' +
            '.cp-color-picker:after{content:""; display:block; ' +
            'position:absolute; top:-15px; left:12px; border:8px solid #eee;' +
            'border-color: transparent transparent #eee}' +
            // simulate border...
            '.cp-color-picker:before{content:""; display:block; ' +
            'position:absolute; top:-16px; left:12px; border:8px solid #eee;' +
            'border-color: transparent transparent #999}' +
            '.cp-xy-slider:active {cursor:none;}' +
            '.cp-xy-slider{border:1px solid #999; margin-bottom:10px;}' +
            '.cp-xy-cursor{width:12px; height:12px; margin:-6px}' +
            '.cp-z-slider{margin-left:10px; border:1px solid #999;}' +
            '.cp-z-cursor{border-width:5px; margin-top:-5px;}' +
            '.cp-color-picker .cp-alpha{margin:10px 0 0; height:6px; border-radius:6px;' +
            'overflow:visible; border:1px solid #999; box-sizing:border-box;' +
            'background: linear-gradient(to right, rgba(238,238,238,1) 0%,rgba(238,238,238,0) 100%);}' +
            '.cp-color-picker .cp-alpha{margin:10px 0}' +
            '.cp-alpha-cursor{background: #eee; border-radius: 100%;' +
            'width:14px; height:14px; margin:-5px -7px; border:1px solid #666!important;' +
            'box-shadow:inset -2px -4px 3px #ccc}',
            renderCallback: function (e, toggle) {
                if (false === toggle) {
                    this.$trigger.trigger('change');
                }
            }
    };


    var exports = {
        show: function(element, options) {
            var picker = $(element).colorPicker($.extend({}, defaultOptions, options));
            return picker;
        }
    };

    return exports;
});
