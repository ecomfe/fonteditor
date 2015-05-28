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


            preview_title: '预览{%=fontFormat%}格式字体',
            preview_first_step: '第一步：使用font-face声明字体',
            preview_second_step: '第二步：定义使用{%=fontFamily%}的样式',
            preview_third_step: '第三步：挑选相应图标并获取字体编码，应用于页面'
        };
    }
);
