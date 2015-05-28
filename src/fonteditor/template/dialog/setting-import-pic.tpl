<div id="import-pic-dialog">
    <div class="form-group">
        <div class="input-group btn-right">
            <div class="import-pic-url">
                <div class="input-group input-group-sm">
                    <span class="input-group-addon">${lang.dialog_picurl}</span>
                    <input id="import-pic-url-text" value="" class="form-control">
                </div>
            </div>
            <button type="button" data-action="import-url" class="btn btn-flat btn-new btn-sm" title="${lang.dialog_picurl_load_title}">${lang.dialog_picurl_load}</button>&nbsp;
            <button type="button" data-action="fitwindow" class="btn btn-flat btn-new btn-sm">${lang.dialog_adjustwindow}</button>&nbsp;
            <button type="button" data-action="fitwindow-left" class="btn btn-flat btn-new btn-sm">${lang.dialog_showorigin}</button>&nbsp;
            <button type="button" data-action="fitwindow-right" class="btn btn-flat btn-new btn-sm">${lang.dialog_showcontour}</button>
        </div>
        <button data-action="openfile" type="button" class="btn btn-flat btn-new btn-sm">${lang.dialog_choosepic}</button>
        <span>${lang.dialog_choosepic_tip}</span>
        <form id="import-pic-form" style="width:0px;height:0px;overflow:hidden;"><input id="import-pic-file" type="file"></form>
    </div>
    <div class="preview-panel"><div class="canvas-left"><canvas id="import-pic-canvas-origin"></canvas></div><div class="canvas-right"><canvas id="import-pic-canvas-fit"></canvas></div></div>
    <div class="form-inline">
        <button type="button" data-filter="restore" class="btn btn-flat btn-sm btn-right">${lang.resume}</button>
        <span class="form-title">${lang.dialog_preprocess}: </span>
        <div class="form-group">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_reverse}</span>
                <span class="form-control"><input data-filter="reverse" type="checkbox"></span>
            </div>
        </div>
        <div class="form-group">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_gaussblur}</span>
                <span class="form-control"><input data-filter="gaussBlur" type="range" min="0" max="20" value="0"
                step="1"></span>
            </div>
        </div>
        <div class="form-group">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_contrast}</span>
                <span class="form-control"><input data-filter="contrast" type="range" min="-50" max="50" value="0" step="1"></span>
            </div>
        </div>
    </div>
    <div class="form-inline">
        <button type="button" data-filter="restore-binarize" class="btn btn-flat btn-sm btn-right">${lang.resume}</button>
        <span class="form-title">${lang.dialog_contour}: </span>
        <div class="form-group">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_binarize_threshold}</span>
                <span class="form-control"><input data-filter="threshold" type="range" min="0" max="255" value="200" step="1"></span>
            </div>
            <div class="input-group input-group-sm">
                <select id="import-pic-threshold-pre" class="form-control">
                    <option value="">${lang.dialog_threshold_default}</option>
                    <option value="mean">${lang.dialog_threshold_mean}</option>
                    <option value="minimum">${lang.dialog_threshold_minimum}</option>
                    <option value="intermodes">${lang.dialog_threshold_intermodes}</option>
                    <option value="ostu">${lang.dialog_threshold_ostu}</option>
                    <option value="isoData">${lang.dialog_threshold_isodata}</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">${lang.dialog_pic_smooth}</span>
                <span class="form-control"><input data-filter="smooth" type="checkbox" checked="checked"></span>
            </div>
        </div>
        <div class="form-group">
            <span class="input-group">
                <button type="button" data-filter="open" class="btn btn-sm btn-flat btn-new">${lang.dialog_pic_open}</button>&nbsp;
                <button type="button" data-filter="close" class="btn btn-sm btn-flat btn-new">${lang.dialog_pic_close}</button>&nbsp;
                <button type="button" data-filter="dilate" class="btn btn-sm btn-flat btn-new">${lang.dialog_pic_dilate}</button>&nbsp;
                <button type="button" data-filter="erode" class="btn btn-sm btn-flat btn-new">${lang.dialog_pic_enrode}</button>
            </span>
        </div>
    </div>
</div>
