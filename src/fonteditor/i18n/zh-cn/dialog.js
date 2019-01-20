/**
 * @file dialog.js
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        return {
            dialog_savesetting: '保存设置',
            dialog_resetsetting: '重置为默认设置',

            dialog_no_input: '没有设置项目!',
            dialog_adjust_glyph: '调整字形',
            dialog_glyph_info: '字形信息',
            dialog_adjust_pos: '调整字形位置',

            dialog_scale_to_bound: '缩放字形到上下边界',
            dialog_set_unicode: '请设置查找内容!',

            dialog_top_bottom_padding: '顶部和底部留白',

            dialog_find_glyf_by_unicode: '按代码点查找字形',
            dialog_find_glyf_by_name: '按名字查找字形',
            dialog_find_glyf_by_index: '按字形序号查找字形',
            dialog_find_glyf_example: '<b>查找内容：</b> （代码点："$21"，名字： "uniE001"，序号："5"）',

            dialog_editor_setting: '编辑器设置',
            dialog_editor_viewercolor: '字体列表颜色',
            dialog_editor_fontsize: '字体列表大小',
            dialog_editor_fontsize_xlarge: '特大',
            dialog_editor_fontsize_large: '大',
            dialog_editor_fontsize_normal: '中',
            dialog_editor_fontsize_small: '小',
            dialog_editor_pageSize: '分页个数',
            dialog_editor_gridsorption: '吸附到网格线',
            dialog_editor_shapesorption: '吸附到轮廓',
            dialog_editor_showgrid: '显示网格',
            dialog_editor_fillcontour: '填充轮廓',
            dialog_editor_contourstrokecolor: '轮廓颜色',
            dialog_editor_contourfillcolor: '轮廓填充颜色',
            dialog_editor_gapcolor: '网格线颜色',
            dialog_editor_gap: '网格线间距',
            dialog_editor_metricscolor: '度量线颜色',

            dialog_glyf_unicode_example: ' &nbsp;&nbsp;可以设置多个unicode，例如："$21,$22,$23"',

            dialog_unicode_set: '设置代码点',
            dialog_unicode_start: '起始代码点',
            dialog_generage_name: '是否生成字形名称',

            dialog_metrics: '字体度量',

            dialog_import_and_export: '导入和导出',

            dialog_combine_svg_single_glyph: '导入svg文件时合并成单个字形',
            dialog_save_with_glyf_name: '保存字体时同时保存字形命名',

            dialog_onlinefont: '在线字体',

            dialog_import_pic: '导入字形图片',
            dialog_fonturl: '字体URL',
            dialog_picurl: '图片URL',
            dialog_picurl_load_title: '指定图片URL加载图片',
            dialog_picurl_load: '从URL导入图片',
            dialog_adjustwindow: '适应窗口',
            dialog_showorigin: '查看原图',
            dialog_showcontour: '查看轮廓',
            dialog_choosepic: '选择图片',
            dialog_choosepic_tip: '请选择字形图片，支持jpg、gif、png、bmp、svg。',
            dialog_preprocess: '预处理',
            dialog_reverse: '反转',
            dialog_gaussblur: '高斯模糊',
            dialog_contrast: '对比度',
            dialog_contour: '轮　廓',
            dialog_binarize_threshold: '二值化阈值',
            dialog_threshold_default: '预设',
            dialog_threshold_mean: '均值',
            dialog_threshold_minimum: '谷底最小值',
            dialog_threshold_intermodes: '双峰平均',
            dialog_threshold_ostu: '大津法',
            dialog_threshold_isodata: 'ISODATA法',
            dialog_pic_smooth: '平滑',
            dialog_pic_open: '消除杂点',
            dialog_pic_close: '消除孔洞',
            dialog_pic_dilate: '膨胀',
            dialog_pic_enrode: '腐蚀',

            dialog_export_glyf: '导出字形',
            dialog_batch_export_glyf: '批量导出字形',
            dialog_glyf_name: '图标名称',
            dialog_color: '颜色',
            dialog_size: '大小',
            dialog_download_svg: '下载SVG',
            dialog_download_png: '下载PNG',

            dialog_alert_set_sync_name: '请设置同步文件名称!',
            dialog_alert_set_url_or_syncurl: '需要设置远程地址或者推送地址至少一项!',
            dialog_alert_set_sync_url: '需要设置远程同步地址!',
            dialog_alert_set_filetype: '请设置文件类型!'
        };
    }
);
