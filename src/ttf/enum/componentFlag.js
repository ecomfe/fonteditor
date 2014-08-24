/**
 * @file componentFlag.js
 * @author mengke01
 * @date 
 * @description
 *  
 * 复合图元标记位
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6glyf.html
 */


define(
    function(require) {

        var  componentFlag= {
            ARG_1_AND_2_ARE_WORDS: 0x01,
            ARGS_ARE_XY_VALUES: 0x02,
            ROUND_XY_TO_GRID: 0x04,
            WE_HAVE_A_SCALE: 0x08,
            RESERVED: 0x10,
            MORE_COMPONENTS: 0x20,
            WE_HAVE_AN_X_AND_Y_SCALE: 0x40,
            WE_HAVE_A_TWO_BY_TWO: 0x80,
            WE_HAVE_INSTRUCTIONS: 0x100,
            USE_MY_METRICS: 0x200,
            OVERLAP_COMPOUND: 0x400,
            SCALED_COMPONENT_OFFSET: 0x800,
            UNSCALED_COMPONENT_OFFSET: 0x1000
        };

        return componentFlag;
    }
);
