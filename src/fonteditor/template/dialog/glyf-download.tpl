<div class="glyf-download-dialog">
    <div class="form-inline">
        <span class="form-title">${lang.dialog_glyf_name}: <em id="glyf-download-name"></em></span>
        <div class="form-group field-margin">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_color}</span>
                <input id="glyf-download-color" type="text" value="#666" class="form-control">
            </div>
        </div>

        <div class="form-group field-margin">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_size}</span>
                <input id="glyf-download-size" type="number" value="128" min="10" max="10000" step="1" class="form-control"><span class="input-group-addon">px</span>
            </div>
        </div>
    </div>
    <div id="glyf-download-preview" class="preview-panel">

    </div>
    <div class="form-inline glyf-download-btn">
        <div class="input-group input-group-sm">
            <a id="glyf-download-svg" class="btn btn-flat btn-new">${lang.dialog_download_svg}</a>
            <a id="glyf-download-png" class="btn btn-flat field-margin">${lang.dialog_download_png}</a>
        </div>
    </div>
</div>
