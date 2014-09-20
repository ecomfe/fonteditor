/**
 * @file commandList.js
 * @author mengke01
 * @date 
 * @description
 * 右键命令集合
 */


define(
    function(require) {

        // 点编辑命令
        var point_command = {
            add: {
                title: '添加点'
            },

            remove: {
                title: '删除点'
            },

            onCurve: {
                title: '在曲线上'
            },

            offCurve: {
                title: '远离曲线'
            },

            asStart: {
                title: '作为开始点'
            }
        };

        // 路径编辑命令
        var shape_command = {

            remove: {
                title: '删除轮廓'
            },

            reverse_point: {
                title: '改变方向'
            },

            cut: {
                title: '剪切'
            },

            copy: {
                title: '复制'
            },

            top: {
                title: '置前'
            },

            bottom: {
                title: '置后'
            },

            up: {
                title: '上移一层'
            },

            down: {
                title: '下移一层'
            },

            rotate_left: {
                title: '向左旋转'
            },

            rotate_right: {
                title: '向右旋转'
            },

            reverse_shapes: {
                title: '翻转'
            },

            mirror_shapes: {
                title: '镜像'
            },
            
            add_referenceline: {
                title: '添加边界参考线'
            }
        };

        var shapes_command = {

            addshape: {
                title: '添加轮廓'
            },

            remove: {
                title: '删除轮廓'
            },
            
            cut: {
                title: '剪切'
            },

            copy: {
                title: '复制'
            },


            rotate_left: {
                title: '向左旋转'
            },

            rotate_right: {
                title: '向右旋转'
            },

            reverse_shapes: {
                title: '翻转'
            },

            mirror_shapes: {
                title: '镜像'
            },

            add_referenceline: {
                title: '添加边界参考线'
            }
        }


        var editor_command = {

            addshape: {
                title: '添加轮廓'
            },

            addrect: {
                title: '添加矩形'
            },

            addcircle: {
                title: '添加圆'
            },

            undo: {
                title: '撤销'
            },

            redo: {
                title: '恢复'
            },

            paste: {
                title: '粘贴'
            },

            add_referenceline: {
                title: '添加参考线'
            },
            
            clearreferenceline: {
                title: '清除参考线'
            },

            rescale: {
                title: '重置缩放'
            }
        };

        return {
            point: point_command,
            shape: shape_command,
            shapes: shapes_command,
            editor: editor_command
        };
    }
);
