/**
 * @file GPOS.js
 * @author mengke01
 * @date 
 * @description
 * GPOS表
 * The Glyph Positioning Table
 * 暂不支持解析 ScriptList，FeatureList，LookupList 表
 * 
 * The Glyph Positioning table (GPOS) provides precise control over glyph placement for sophisticated
 *  text layout and rendering in each script and language system that a font supports.
 * 
 * http://www.microsoft.com/typography/otspec/gpos.htm
 * 
 * http://www.microsoft.com/typography/otspec/chapter2.htm
 */


define(
    function(require) {

        var table = require('./table');

        var GPOS = table.create(
            'GPOS', 
            [],
            {
                /**
                 * 解析GPOS表
                 */
                read: function(reader, ttf) {
                    reader.seek(this.offset);
                    var gpos  = {};
                    gpos.Version = reader.readFixed();
                    gpos.ScriptList = reader.readUint16();
                    gpos.FeatureList = reader.readUint16();
                    gpos.LookupList = reader.readUint16();
                    // 脚本表
                    gpos.ScriptTbl = {
                        ScriptCount: reader.readUint16(this.offset + gpos.ScriptList)
                    };

                    // 特征表
                    gpos.FeatureTbl = false;
                    // 查找表
                    gpos.LookupTbl = false;

                    return gpos;
                }
            }
        );

        return GPOS;
    }
);