<div class="form-inline">
  <div class="input-group input-group-sm">
    <span class="input-group-addon">翻转</span>
    <span class="form-control">
      <input data-field="reverse" type="checkbox">
    </span>
  </div>
</div>
<div class="form-inline">
  <div class="input-group input-group-sm">
    <span class="input-group-addon">镜像</span>
    <span class="form-control">
      <input data-field="mirror" type="checkbox">
    </span>
  </div>
</div>
<div class="form-inline">
  <div class="input-group input-group-sm">
    <span class="input-group-addon">按比例缩放</span>
    <input data-field="scale" type="number" min="0" max="1" step="0.1" class="form-control">
  </div>
</div>
<div class="form-inline">
  <div class="form-group">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">缩放字形到上下边界</span>
      <span class="form-control">
        <input data-field="ajdustToEmBox" type="checkbox" onclick="$(\'#setting-ajdustToEmPadding\')[this.checked ? \'removeClass\' : \'addClass\'](\'hide\')">
      </span>
    </div>
  </div>
  <div id="setting-ajdustToEmPadding" class="form-group hide">
    <div class="input-group input-group-sm">
      <span class="input-group-addon">顶部和底部留白</span>
      <input data-field="ajdustToEmPadding" data-ceil="true" type="number" min="-16384" max="16384" step="1" class="form-control">
    </div>
  </div>
</div>
