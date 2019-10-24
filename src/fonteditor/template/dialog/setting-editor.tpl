<div class="form-inline column-3">
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_viewercolor}</span>
      <input data-field="viewer.color" type="text" class="form-control">
    </div>
  </div>
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_fontsize}</span>
      <select data-field="viewer.shapeSize" class="form-control">
        <option value="xlarge">${lang.dialog_editor_fontsize_xlarge}</option>
        <option value="large">${lang.dialog_editor_fontsize_large}</option>
        <option value="normal">${lang.dialog_editor_fontsize_normal}</option>
        <option value="small">${lang.dialog_editor_fontsize_small}</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_pageSize}</span>
      <input data-field="viewer.pageSize" type="number" class="form-control">
    </div>
  </div>
</div>
<hr>
<div class="form-inline column-3">
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_gridsorption}</span>
      <span class="form-control">
        <input data-field="editor.sorption.enableGrid" type="checkbox">
      </span>
    </div>
  </div>
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_shapesorption}</span>
      <span class="form-control">
        <input data-field="editor.sorption.enableShape" type="checkbox">
      </span>
    </div>
  </div>
</div>
<div class="form-inline">
  <div class="input-group input-group-sm">
    <span class="input-group-addon">${lang.dialog_editor_showgrid}</span>
    <span class="form-control"><input data-field="editor.axis.showGrid" type="checkbox"></span>
  </div>
</div>
<div class="form-inline column-3">
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_fillcontour}</span>
      <span class="form-control"><input data-field="editor.fontLayer.fill" type="checkbox"></span>
    </div>
  </div>
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_contourstrokecolor}</span>
      <input data-field="editor.fontLayer.strokeColor" type="text" class="form-control">
    </div>
  </div>
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_contourfillcolor}</span>
      <input data-field="editor.fontLayer.fillColor" type="text" class="form-control">
    </div>
  </div>
</div>
<div class="form-inline column-3">
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_gapcolor}</span>
      <input data-field="editor.axis.gapColor" type="text" class="form-control">
    </div>
  </div>
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_gap}</span>
      <input data-field="editor.axis.graduation.gap" type="number" class="form-control">
    </div>
  </div>
</div>
<div class="form-inline column-3">
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">${lang.dialog_editor_metricscolor}</span>
      <input data-field="editor.axis.metricsColor" type="text" class="form-control">
    </div>
  </div>
</div>
<div class="form-inline column-3">
  <div class="input-group input-group-sm">
    <span class="input-group-addon">${lang.dialog_savesetting}</span>
    <span class="form-control"><input data-field="saveSetting" type="checkbox"></span>
    </div>
    <a href="#" id="setting-editor-default">${lang.dialog_resetsetting}</a>
</div>