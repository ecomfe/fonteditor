/**
 * @file 消息提示
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        return {
            msg_not_support_file_type: '不支持的文件类型！',
            msg_loading_pic: '正在加载图片...',
            msg_read_pic_error: '读取图片失败...',
            msg_processing: '正在处理...',
            msg_input_pic_url: '请输入图片URL!',
            msg_no_glyph_to_import: '没有找到可导入的字形！',
            msg_error_read_file: '读取文件出错!',
            msg_loading: '正在加载...',
            msg_confirm_del_proj: '是否删除项目?',
            msg_not_set_sync_info: '没有设置同步信息!',
            msg_no_sync_font: '没有要同步的字体!',
            msg_repeat_unicode: '重复的unicode代码点，字形序号：',
            msg_confirm_del_glyph: '确定删除字形么？',
            msg_read_file_error: '加载文件错误!',
            msg_syncing: '正在同步...',
            msg_sync_success: '同步成功...',
            msg_sync_failed: '同步失败：',
            msg_confirm_save_proj: '是否放弃保存当前编辑的项目?',
            msg_save_success: '保存成功...',
            msg_save_failed: '保存失败...',
            msg_input_proj_name: '请输入项目名称：',
            msg_confirm_gen_names: '生成的字形名称会覆盖原来的名称，确定生成？',
            msg_not_support_compound_glyf: '暂不支持复合字形!',
            msg_transform_compound_glyf: '是否转换复合字形为简单字形？',
            msg_confirm_save_glyph: '是否放弃保存当前编辑的字形?',
            msg_no_related_glhph: '未找到相关字形!',
            msg_error_open_proj: '打开项目失败，是否删除项目?',
            msg_error_del_proj: '删除项目失败，请刷新页面后删除!',
            msg_no_sort_glyf: '没有要排序的字形!',
            msg_has_compound_glyf_sort: '包含复合字形,无法进行排序',


            preview_title: '预览{%=fontFormat%}格式字体',
            preview_first_step: '第一步：使用font-face声明字体',
            preview_second_step: '第二步：定义使用{%=fontFamily%}的样式',
            preview_third_step: '第三步：挑选相应图标并获取字体编码，应用于页面'
        };
    }
);
