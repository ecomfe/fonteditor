<div class="glyf-download-dialog batch">
    <div class="form-inline">
        <!-- <span class="form-title">${lang.dialog_glyf_name}: <em id="glyf-download-name"></em></span> -->
        <div class="form-group field-margin">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_color}</span>
                <input id="glyf-download-color" type="text" value="#666" class="form-control">
            </div>
        </div>

        <div class="form-group field-margin">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_size}</span>
                <input id="glyf-download-size" type="number" value="24" min="10" max="1024" step="1" class="form-control"><span class="input-group-addon">px</span>
            </div>
        </div>
    </div>
    <div id="glyf-download-preview" class="preview-panel">

    </div>
    <div class="form-inline glyf-download-btn">
        <div class="input-group input-group-sm">
            <div id="download-glyf-select" class="pull-left">
                <label class="radio-inline">
                    <input type="radio" name="download-glyf-select" value="svg" checked="checked">${lang.dialog_download_svg}
                </label>
                <label class="radio-inline">
                    <input type="radio" name="download-glyf-select" value="png">${lang.dialog_download_png}
                </label>
            </div>
            <a id="glyf-download-confirm" class="btn btn-flat field-margin pull-right">${lang.confirm}</a>
        </div>
    </div>
</div>
