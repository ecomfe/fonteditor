<div class="glyph-download-dialog">
    <div class="form-inline">
        <span class="form-title">${lang.dialog_glyph_name}: <em id="glyph-download-name"></em></span>
        <div class="form-group field-margin">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_color}</span>
                <input id="glyph-download-color" type="text" value="#666" class="form-control">
            </div>
        </div>

        <div class="form-group field-margin">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_size}</span>
                <input id="glyph-download-size" type="number" value="128" min="10" max="10000" step="1" class="form-control"><span class="input-group-addon">px</span>
            </div>
        </div>
    </div>
    <div id="glyph-download-preview" class="preview-panel">

    </div>
    <div class="form-inline glyph-download-btn">
        <div class="input-group input-group-sm">
            <a id="glyph-download-svg" class="btn btn-flat btn-new">${lang.dialog_download_svg}</a>
            <a id="glyph-download-png" class="btn btn-flat field-margin">${lang.dialog_download_png}</a>
        </div>
    </div>
</div>
