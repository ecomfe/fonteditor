/**
 * @file 消息提示
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        return {
            msg_not_support_file_type: 'Not support this file type!',
            msg_loading_pic: 'Loading pic...',
            msg_read_pic_error: 'Error reading pic...',
            msg_processing: 'Processing...',
            msg_input_pic_url: 'Please input pic url!',
            msg_no_glyph_to_import: 'No glyph to import',
            msg_error_read_file: 'Read error  file',
            msg_loading: 'Loading...',
            msg_confirm_del_proj: 'Do you want to delete project?',
            msg_not_set_sync_info: 'Not set sync config!',
            msg_no_sync_font: 'No sync font!',
            msg_repeat_unicode: 'Repeat unicode, glyph index are:',
            msg_confirm_del_glyph: 'Do you want to delete glyph？',
            msg_read_file_error: 'Error read file!',
            msg_syncing: 'Synchronizing...',
            msg_sync_success: 'Sync success...',
            msg_sync_failed: 'Sync failed：',
            msg_confirm_save_proj: 'Do you want to save current project before leave?',
            msg_save_success: 'Save success...',
            msg_save_failed: 'Save failed...',
            msg_input_proj_name: 'Please input project name：',
            msg_confirm_gen_names: 'Glyph name will be rewrite by generated name, do you really want to regenerate?',
            msg_not_support_compound_glyf: 'Not support compound glyph currently!',
            msg_confirm_save_glyph: 'Do you want to cancel save current editing glyph?',
            msg_no_related_glhph: 'Find no related glyph!',
            msg_error_open_proj: 'Open project error, do you want to delete this project?',
            msg_error_del_proj: 'Delete project error, please refresh this page and try delete again!',
            msg_no_sort_glyf: 'No glyph to sort!',
            msg_has_compound_glyf_sort: 'Can\'t sort glyphs while contains compound glyph.',

            preview_title: 'Preview {%=fontFormat%} Format Font',
            preview_first_step: 'Step 1: Use `{%=fontFamily%}` as font-face.',
            preview_second_step: 'Step 2：Define css styles with `{%=fontFamily%}`.',
            preview_third_step: 'Step 3：Set font unicode to icons on web page.'
        };
    }
);
