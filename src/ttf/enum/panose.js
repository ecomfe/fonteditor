/**
 * @file 字体外观分类器
 * @author mengke01(kekee000@gmail.com)
 *
 * @see:
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6OS2.html
 */


define(
    function (require) {

        var panose = {

            bFamilyType: [
                'Any',
                'No Fit',
                'Text and Display',
                'Script',
                'Decorative',
                'Pictorial',
            ],

            bSerifStyle: [
                'Any',
                'No Fit',
                'Cove',
                'Obtuse Cove',
                'Square Cove',
                'Obtuse Square Cove',
                'Square',
                'Thin',
                'Bone',
                'Exaggerated',
                'Triangle',
                'Normal Sans',
                'Obtuse Sans',
                'Perp Sans',
                'Flared',
                'Rounded'
            ],

            bWeight: [
                'Any',
                'No Fit',
                'Very Light',
                'Light',
                'Thin',
                'Book',
                'Medium',
                'Demi',
                'Bold',
                'Heavy',
                'Black',
                'Nord'
            ],

            bProportion: [
                'Any',
                'No Fit',
                'Old Style',
                'Modern',
                'Even Width',
                'Expanded',
                'Condensed',
                'Very Expanded',
                'Very Condensed',
                'Monospaced'
            ],

            bContrast: [
                'Any',
                'No Fit',
                'None',
                'Very Low',
                'Low',
                'Medium Low',
                'Medium',
                'Medium High',
                'High',
                'Very High'
            ],

            bStrokeVariation: [
                'Any',
                'No Fit',
                'Gradual/Diagonal',
                'Gradual/Transitional',
                'Gradual/Vertical',
                'Gradual/Horizontal',
                'Rapid/Vertical',
                'Rapid/Horizontal',
                'Instant/Vertical'
            ],

            bArmStyle: [
                'Any',
                'No Fit',
                'Straight Arms/Horizontal',
                'Straight Arms/Wedge',
                'Straight Arms/Vertical',
                'Straight Arms/Single Serif',
                'Straight Arms/Double Serif',
                'Non-Straight Arms/Horizontal',
                'Non-Straight Arms/Wedge',
                'Non-Straight Arms/Vertical',
                'Non-Straight Arms/Single Serif',
                'Non-Straight Arms/Double Serif'
            ],


            bLetterform: [
                'Any',
                'No Fit',
                'Normal/Contact',
                'Normal/Weighted',
                'Normal/Boxed',
                'Normal/Flattened',
                'Normal/Rounded',
                'Normal/Off Center',
                'Normal/Square',
                'Oblique/Contact',
                'Oblique/Weighted',
                'Oblique/Boxed',
                'Oblique/Flattened',
                'Oblique/Rounded',
                'Oblique/Off Center',
                'Oblique/Square'
            ],

            bMidline: [
                'Any',
                'No Fit',
                'Standard/Trimmed',
                'Standard/Pointed',
                'Standard/Serifed',
                'High/Trimmed',
                'High/Pointed',
                'High/Serifed',
                'Constant/Trimmed',
                'Constant/Pointed',
                'Constant/Serifed',
                'Low/Trimmed',
                'Low/Pointed',
                'Low/Serifed'
            ],

            bXHeight: [
                'Any',
                'No Fit',
                'Constant/Small',
                'Constant/Standard',
                'Constant/Large',
                'Ducking/Small',
                'Ducking/Standard',
                'Ducking/Large'
            ]
        };

        return panose;
    }
);
