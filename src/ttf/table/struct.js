/**
 * @file struct.js
 * @author mengke01
 * @date 
 * @description
 * 基本数据结构
 */


define(
    function(require) {

        var struct = {
            Int8: 1, 
            Uint8: 2,
            Int16: 3,
            Uint16: 4,
            Int32: 5,
            Uint32: 6,
            Fixed: 7, // 32-bit signed fixed-point number (16.16)
            FUnit: 8, // Smallest measurable distance in the em space
            // 16-bit signed integer (SHORT) that describes a quantity in FUnits.
            //FWord: 9, 
            // Unsigned 16-bit integer (USHORT) that describes a quantity in FUnits
            //UFWord: 10, 
            // 16-bit signed fixed number with the low 14 bits of fraction
            F2Dot14: 11, 
            // The long internal format of a date in seconds since 12:00 midnight, 
            // January 1, 1904. It is represented as a signed 64-bit integer.
            LongDateTime: 12
        };

        var names = {};

        for(var key in struct) {
            names[struct[key]] = key;
        }

        struct.names = names;

        return struct;
    }
);
